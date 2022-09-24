const Encryption = require('./Encryption')
const axios = require('axios')
const short = require('short-uuid')

class TinggService {
  host = 'http://localhost';
  serviceCode = 'RENDEV5770';
  clientCode = 'RENDEV6469';

  // for authentication
  clientId = 'ec58f9eb-c39f-40a5-90af-61ec739d87ec';
  clientSecret = 'KFTPVf6PorF11eWsp57fUw1qkvtPZDHtZtmA6PTt';

  // for encryption
  accessKey =
    '$2a$08$gdOvLEvjCLx/272Ly.ML2eibzOoZqVyqEX0pGxsWqpv4EQw3mm/3K';
  IVKey = '87TpztX9WMLFNgHB';
  secretKey = 'yfvWm6F2rR7TYNgZ';
  algorithm = 'aes-256-cbc';

  constructor(request, response) {
    this.login = this.login.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getConversionRate = this.getConversionRate.bind(this)
    this.checkoutEncryption = this.checkoutEncryption.bind(this)

    const BASE_URL =
      process.env.TINGG_BASE_URL ||
      'https://developer.tingg.africa/checkout/v2'

    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 0,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${this.token}`,
      },
    })
  }

  async getAccessToken() {
    try {
      console.log('getAccessToken')
      const res = await this.api.post('custom/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      })
      if (res.data.access_token) {
        this.api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${res.data.access_token}`
      }
      return res.data
    } catch (error) {
      throw new Error(error)
    }
  }

  async login(request, response) {
    let res = await this.getAccessToken()
    return response.json(res)
  }

  async checkoutEncryption(request, response) {
    // get the request body
    const requestBody = {
      merchantTransactionID: short.generate(), // '<YOUR_UNIQUE_TRANSACTION_ID>',
      requestAmount: '75',
      currencyCode: 'GHS',
      // accountNumber: this.generateAccountNo(), // '10092019',
      accountNumber: '10092019',
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
      successRedirectUrl: this.getUrl(request, 'success'), // '<YOUR_SUCCESS_REDIRECT_URL>',
      failRedirectUrl: this.getUrl(request, 'fail'), // '<YOUR_FAIL_REDIRECT_URL>',
      pendingRedirectUrl: this.getUrl(request, 'pending'), // '<YOUR_PENDING_REDIRECT_URL>',
      paymentWebhookUrl: this.getUrl(request, 'webhook'), // '<PAYMENT_WEBHOOK_URL>',
      ...request.body,
    }
    const accessKey = this.accessKey

    const encryption = new Encryption(
      this.IVKey,
      this.secretKey,
      this.algorithm,
    )

    const payload = JSON.stringify(requestBody).replace(/\//g, '\\/')

    const params = encryption.encrypt(payload)
    const paymentUrl = `https://developer.tingg.africa/checkout/v2/express/?params=${params}&accessKey=${accessKey}&countryCode=${requestBody.countryCode}`

    // console.log(paymentUrl);

    const modalUrl = `https://developer.tingg.africa/checkout/v2/modal/?params=${params}&accessKey=${accessKey}&countryCode=${requestBody.countryCode}`

    // console.log(modalUrl);

    // return a JSON response
    return response.json({
      paymentUrl,
      modalUrl,
      params: encryption.encrypt(payload),
      accessKey,
      countryCode: requestBody.countryCode,
      requestBody,
    })
  }

  async checkoutSuccess(request) {
    console.log('checkoutSuccess')
    console.log(JSON.stringify(request.body))
    return response.json({
      message: 'Payment success',
    })
  }

  async checkoutFail(request) {
    console.log('checkoutFail')
    console.log(JSON.stringify(request.body))
    return response.json({
      message: 'Payment fail',
    })
  }

  async checkoutPending(request) {
    console.log('checkoutPending')
    console.log(JSON.stringify(request.body))
    return response.json({
      message: 'Payment is pending',
    })
  }

  async webhook(request) {
    console.log('webhook')
    console.log(JSON.stringify(request.body))
    return response.json(request.body)
  }

  async paymentOptions(request, response) {
    await this.getAccessToken()

    const params = new URLSearchParams({
      serviceCode: this.serviceCode,
      countryCode: 'GH',
    })
    const res = await this.api.get('custom/requests/service-options', {
      params,
    })
    return response.json(res.data)
  }

  async getConversionRate(request, response) {
    try {
      await this.getAccessToken()
      const res = await this.api.post('custom/requests/acknowledgement-rate', {
        baseCurrencyCode: request.query.base || 'USD',
        exchangeCurrencyCode: request.query.code || 'GHS',
        serviceCode: this.serviceCode,
      })
      return response.json(res.data)
    } catch (error) {
      throw new Error(error)
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
    })
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
    })
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
    })
  }

  getUrl(req, endPoint = '') {
    const protocol = req.protocol
    const host = req.hostname
    const url = '/tingg' // req.originalUrl;
    const port = process.env.PORT || 1500

    const fullUrl = `${protocol}://${host}:${port}${url}/${endPoint}`
    return fullUrl
  }

  generateAccountNo() {
    const translator = short() // Defaults to flickerBase58
    translator.alphabet
    const alpha = String(translator.generate()).substring(0, 4)
    const time = new Date().valueOf() / 1000
    return alpha + time // .split('', 4).join('');
  }
}

module.exports = new TinggService()
