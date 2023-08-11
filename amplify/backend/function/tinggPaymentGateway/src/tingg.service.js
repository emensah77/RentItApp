const axios = require('axios');
const short = require('short-uuid');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = require('./rentitapp-8fc19-firebase-adminsdk-ewhh3-d58d4d8eba.json');
const Encryption = require('./Encryption');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

function functionThatCheckPaymentIsValid(body) {
  return true;
}

const envUrl = 'https://i08fhhbxwk.execute-api.us-east-2.amazonaws.com/dev';
const functionPrefix = 'tingg';

const fullUrl = `${envUrl}/${functionPrefix}`;

class TinggService {
  // Prod details
  host = 'http://localhost';

  serviceCode = 'RENTIZO';

  // for authentication
  clientId = '1b23778c-fa83-4297-bb22-1537714a0505';

  clientSecret = 'BezbZ88Q3ydrLAF9w8NGN5xYUP6DvzBF2nzDEthT';

  // for encryption
  accessKey = 'v4JmKjXyLfuPn8Lmv66ZvdktBZQBMAr4FIKGUzGRpL4MMhJTrn8k7MgVJmKkN';

  IVKey = 'T3c892rSeWnR66cZ';

  secretKey = 'tDYSqBQs35un2Ye';

  algorithm = 'aes-256-cbc';

  constructor(request, response) {
    this.login = this.login.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getConversionRate = this.getConversionRate.bind(this);
    this.checkoutEncryption = this.checkoutEncryption.bind(this);
    this.baseUrl = process.env.TINGG_BASE_URL || 'https://online.tingg.africa/v2';

    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 0,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getAccessToken() {
    try {
      console.log('getAccessToken');
      const res = await this.api.post('custom/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });
      if (res.data.access_token) {
        // const tokenType = res.data.token_type
        const token = res.data.access_token;
        this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(request, response) {
    const res = await this.getAccessToken();
    return response.json(res);
  }

  async checkoutEncryption(request, response) {
    // get the request body
    const requestBody = {
      merchantTransactionID: short.generate(), // '<YOUR_UNIQUE_TRANSACTION_ID>',
      requestAmount: '75',
      currencyCode: 'GHS',
      accountNumber: this.generateAccountNo(), // '10092019',
      // accountNumber: "10092019",
      serviceCode: this.serviceCode, // '<SERVICE_CODE>',
      // dueDate: '2019-06-01 23:59:59', //Must be a future date
      // dueDate: dayjs().add(5, 'minute').format('YYYY-MM-DD HH:mm:ss'), // '2019-06-01 23:59:59', //Must be a future date
      requestDescription: 'Dummy merchant transaction',
      countryCode: 'GH',
      // languageCode: 'en',
      payerClientCode: '',
      MSISDN: '+233240000000', // '233552618521', // '+233240000000', // '+2547XXXXXXXX', //Must be a valid number
      customerFirstName: 'John',
      customerLastName: 'Smith',
      customerEmail: 'john.smith@example.com',
      successRedirectUrl: this.getUrl(request, 'callback', { type: 'success' }), // '<YOUR_SUCCESS_REDIRECT_URL>',
      failRedirectUrl: this.getUrl(request, 'callback', { type: 'fail' }), // '<YOUR_FAIL_REDIRECT_URL>',
      pendingRedirectUrl: this.getUrl(request, 'callback', { type: 'pending' }), // '<YOUR_PENDING_REDIRECT_URL>',
      paymentWebhookUrl: `${fullUrl}/webhook`, // '<PAYMENT_WEBHOOK_URL>',
      ...request.body,
    };
    const { accessKey } = this;

    const encryption = new Encryption(this.IVKey, this.secretKey, this.algorithm);

    const payload = JSON.stringify(requestBody).replace(/\//g, '\\/');

    const params = encryption.encrypt(payload);
    const paymentUrl = `${this.baseUrl}/express/?params=${params}&accessKey=${accessKey}&countryCode=${requestBody.countryCode}`;
    // console.log(paymentUrl);

    const modalUrl = `${this.baseUrl}/modal/?params=${params}&accessKey=${accessKey}&countryCode=${requestBody.countryCode}`;

    // console.log(modalUrl);

    // return a JSON response
    return response.json({
      paymentUrl,
      modalUrl,
      params: encryption.encrypt(payload),
      accessKey,
      countryCode: requestBody.countryCode,
      requestBody,
    });
  }

  async checkoutCallback(request, response) {
    console.log('checkoutCallback');
    console.log(JSON.stringify(request.body));
    const html = fs.readFileSync(path.join(__dirname, 'callback.hbs'));
    let type = null;
    if ('type' in request.query) {
      type = request.query.type;
    }
    let htmlStr = html.toString();
    htmlStr = htmlStr.replace('{{title}}', type);
    htmlStr = htmlStr.replace('{{message}}', JSON.stringify({ type }));
    return response.send(htmlStr);
  }

  async checkoutSuccess(request, response) {
    console.log('checkoutSuccess');
    console.log(JSON.stringify(request.body));
    return response.json({
      message: 'Payment success',
    });
  }

  async checkoutFail(request, response) {
    console.log('checkoutFail');
    console.log(JSON.stringify(request.body));
    return response.json({
      message: 'Payment fail',
    });
  }

  async checkoutPending(request, response) {
    console.log('checkoutPending');
    console.log(JSON.stringify(request.body));
    return response.json({
      message: 'Payment is pending',
    });
  }

  async webhook(request, response) {
    // console.log("webhook");
    // console.log(JSON.stringify(request.body));
    // return response.send('Ok');
    let verifiedInFirebase = false;
    let orderId;
    console.log('webhook');
    console.log(JSON.stringify(request.body));
    const { merchantTransactionID } = request.body;
    console.log('merchantId', merchantTransactionID);
    if (request.body.requestStatusCode == 178) {
      const transactionsRef = db.collection('transactions').doc(merchantTransactionID);

      const transactionDoc = await transactionsRef.get();

      if (transactionDoc.exists) {
        const data = transactionDoc.data();
        console.log('transaction2 data', data);
        if (data.paymentStatus === 'Processing') {
          orderId = data.id;
          verifiedInFirebase = true;
          transactionDoc.ref.update('paymentStatus', 'Success');
          console.log('verifiedInfirebase2', verifiedInFirebase);
          if (data.orderType === 'payment') {
            await db
              .collection('payments')
              .doc(merchantTransactionID)
              .update({ paymentStatus: 'Success' });
          } else if (data.orderType === 'nsspayment') {
            await db
              .collection('subscriptiontransactions')
              .doc(merchantTransactionID)
              .update({ paymentStatus: 'Success' });
          } else {
            await db
              .collection('homeorders')
              .doc(merchantTransactionID)
              .update({ paymentStatus: 'Success' });
          }
        }
        if (verifiedInFirebase) {
          // if (functionThatCheckPaymentIsValid(request.body)) {
          // payment valid, acknowledge
          console.log('verifiedinfirebase3', verifiedInFirebase);
          return response.json({
            checkoutRequestID: request.body.checkoutRequestID,
            merchantTransactionID: request.body.merchantTransactionID,
            statusCode: '183',
            statusDescription: 'Payment processed successfully',
            receiptNumber: orderId,
          });
        }
      }
    }

    // payment failed, refund user
    return response.json({
      checkoutRequestID: request.body.checkoutRequestID,
      merchantTransactionID: request.body.merchantTransactionID,
      statusCode: '180',
      statusDescription: 'Payment was not processed successfully',
      receiptNumber: '',
    });
  }

  async paymentOptions(request, response) {
    await this.getAccessToken();

    const params = new URLSearchParams({
      serviceCode: this.serviceCode,
      countryCode: 'GH',
    });
    const res = await this.api.get('custom/requests/service-options', {
      params,
    });
    return response.json(res.data);
  }

  async getConversionRate(request, response) {
    try {
      await this.getAccessToken();
      const res = await this.api.post('custom/requests/acknowledgement-rate', {
        baseCurrencyCode: request.query.base || 'USD',
        exchangeCurrencyCode: request.query.code || 'GHS',
        serviceCode: this.serviceCode,
      });
      return response.json(res.data);
    } catch (error) {
      throw new Error(error);
    }
  }

  getCountriesCodes(request, response) {
    return response.json({
      status: {
        statusCode: 200,
        statusDescription: 'Countries code fetched successfully',
      },
      results: [
        { country: 'Cameroon', code: 'CM' },
        { country: 'Cape Verde', code: 'CV' },
        { country: 'Central Africa', code: 'CA' },
        { country: 'Chad', code: 'TD' },
        { country: 'Congo Brazzaville', code: 'CG' },
        { country: 'Congo DRC', code: 'CD' },
        { country: "Cote D'Ivoire", code: 'CI' },
        { country: 'Egypt', code: 'EG' },
        { country: 'Equatorial Guinea', code: 'GQ' },
        { country: 'Ethiopia', code: 'ET' },
        { country: 'Gabon', code: 'GA' },
        { country: 'Gambia', code: 'GM' },
        { country: 'Ghana', code: 'GH' },
        { country: 'Guinea-Bissau', code: 'GW' },
        { country: 'Guinea Conakry', code: 'GN' },
        { country: 'Kenya', code: 'KE' },
        { country: 'Liberia', code: 'LR' },
        { country: 'Malawi', code: 'MW' },
        { country: 'Mali', code: 'ML' },
        { country: 'Morocco', code: 'MR' },
        { country: 'Mozambique', code: 'MZ' },
        { country: 'Nigeria', code: 'NG' },
        { country: 'Niger', code: 'NE' },
        { country: 'Rwanda', code: 'RW' },
        { country: 'Sao Tome', code: 'ST' },
        { country: 'Senegal', code: 'SN' },
        { country: 'Sierra Leone', code: 'SL' },
        { country: 'South Sudan', code: 'SD' },
        { country: 'Uganda', code: 'UG' },
        { country: 'Tanzania', code: 'TZ' },
        { country: 'Togo', code: 'TG' },
        { country: 'Zambia', code: 'ZM' },
        { country: 'Zimbabwe', code: 'ZW' },
      ],
    });
  }

  getCurrenciesCodes(request, response) {
    return response.json({
      status: {
        statusCode: 200,
        statusDescription: 'Countries with currency code fetched successfully',
      },
      results: [
        { country: 'Cameroon', name: 'Central African CFA franc', code: 'XAF' },
        { country: 'Cape Verde', name: 'Cape Verdean escudo', code: 'CVE' },
        {
          country: 'Central Africa',
          name: 'Central African CFA franc',
          code: 'XAF',
        },
        { country: 'Chad', name: 'Central African CFA franc', code: 'XAF' },
        {
          country: 'Congo Brazzaville',
          name: 'Central African CFA franc',
          code: 'XAF',
        },
        { country: 'Congo DRC', name: 'Congolese franc', code: 'CDF' },
        {
          country: "Cote D'Ivoire",
          name: 'West African CFA franc',
          code: 'XOF',
        },
        { country: 'Egypt', name: 'Egyptian Pounds', code: 'utc' },
        {
          country: 'Equatorial Guinea',
          name: 'Central African CFA franc',
          code: 'XAF',
        },
        { country: 'Gabon', name: 'Central African CFA franc', code: 'XAF' },
        { country: 'Gambia', name: 'Gambian Dalasi', code: 'GMD' },
        { country: 'Ghana', name: 'Ghanaian Cedi', code: 'GHS' },
        {
          country: 'Guinea-Bissau',
          name: 'West African CFA Franc',
          code: 'XOF',
        },
        { country: 'Guinea Conakry', name: 'Guinean Franc', code: 'GNF' },
        { country: 'Kenya', name: 'Kenyan Shilling', code: 'KES' },
        { country: 'Liberia', name: 'Liberian Dollar', code: 'LRD' },
        { country: 'Malawi', name: 'Malawi Kwacha', code: 'MWK' },
        { country: 'Mali', name: 'West African CFA franc', code: 'XAF' },
        { country: 'Mozambique', name: 'Mozambique Metical', code: 'MZN' },
        { country: 'Nigeria', name: 'Nigerian Naira', code: 'NGN' },
        { country: 'Niger', name: 'West African CFA franc', code: 'XOF' },
        { country: 'Rwanda', name: 'Rwandan Franc', code: 'RWF' },
        {
          country: 'Sao Tome',
          name: 'Sao Tome and Principe Dobra',
          code: 'STD',
        },
        { country: 'Senegal', name: 'West African CFA franc', code: 'XOF' },
        { country: 'Sierra Leone', name: 'Sierra Leonean Leone', code: 'SLL' },
        { country: 'South Sudan', name: 'South Sudanese Pound', code: 'SSP' },
        { country: 'Uganda', name: 'Ugandan Shilling', code: 'UGX' },
        { country: 'Tanzania', name: 'Tanzanian Shilling', code: 'TZS' },
        { country: 'Togo', name: 'West African CFA franc', code: 'XOF' },
        { country: 'Zambia', name: 'Rebased Zambian Kwacha', code: 'ZMW' },
        { country: 'Zimbabwe', name: 'US Dollar', code: 'USD' },
      ],
    });
  }

  getDialingCodes(request, response) {
    return response.json({
      status: {
        statusCode: 200,
        statusDescription: 'Countries with dialing code fetched successfully',
      },
      results: [
        { country: 'Burundi', code: '+257' },
        { country: 'Cameroon', code: '+237' },
        { country: 'Cape Verde', code: '+238' },
        { country: 'Central Africa', code: '+236' },
        { country: 'Chad', code: '+235' },
        { country: 'Congo Brazzaville', code: '+242' },
        { country: 'Congo DRC', code: '+243' },
        { country: "Cote D'Ivoire", code: '+225' },
        { country: 'Equatorial Guinea', code: '+240' },
        { country: 'Gabon', code: '+241' },
        { country: 'Gambia', code: '+220' },
        { country: 'Ghana', code: '+233' },
        { country: 'Guinea-Bissau', code: '+245' },
        { country: 'Guinea Conakry', code: '+224' },
        { country: 'Kenya', code: '+254' },
        { country: 'Liberia', code: '+231' },
        { country: 'Malawi', code: '+265' },
        { country: 'Mali', code: '+223' },
        { country: 'Mozambique', code: '+258' },
        { country: 'Nigeria', code: '+234' },
        { country: 'Niger', code: '+227' },
        { country: 'Rwanda', code: '+250' },
        { country: 'Sao Tome', code: '+239' },
        { country: 'Senegal', code: '+221' },
        { country: 'Sierra Leone', code: '+232' },
        { country: 'South Sudan', code: '+249' },
        { country: 'Uganda', code: '+256' },
        { country: 'Tanzania', code: '+255' },
        { country: 'Togo', code: '+228' },
        { country: 'Zambia', code: '+260' },
        { country: 'Zimbabwe', code: '+263' },
      ],
    });
  }

  getUrl(req, endPoint = '', jsonParams) {
    // const protocol = req.protocol;
    // const host = req.hostname;
    // const url = "tingg"; // req.originalUrl;
    // const port = process.env.PORT || 1500;
    const params = new URLSearchParams(jsonParams);
    // const fullUrl = `${protocol}://${host}:${port}${url}/${endPoint}`
    return `${fullUrl}/${endPoint}?${params}`;
  }

  generateAccountNo() {
    const translator = short(); // Defaults to flickerBase58
    translator.alphabet;
    const alpha = String(translator.generate()).substring(0, 4);
    const time = new Date().valueOf() / 1000;
    return alpha + time; // .split('', 4).join('');
  }

  async test(request, response) {
    // console.log(JSON.stringify(request.body))
    await db.collection('test').add({ testNumber: short.generate() });
    return response.json(JSON.stringify(request.requestContext));
  }
}

module.exports = new TinggService();
