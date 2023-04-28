/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const tinggService = require('./tingg.service');
// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

/** ********************
 * Example get method *
 ********************* */

app.get('/tingg/login', tinggService.login);

app.post('/tingg/checkout-encryption', tinggService.checkoutEncryption);

app.get('/tingg/payment-options', tinggService.paymentOptions);

app.get('/tingg/rate', tinggService.getConversionRate);

app.get('/tingg/countries-code', tinggService.getCountriesCodes);

app.get('/tingg/currencies-code', tinggService.getCurrenciesCodes);

app.get('/tingg/dialing-code', tinggService.getDialingCodes);

app.get('/tingg/callback', tinggService.checkoutCallback);
app.post('/tingg/callback', tinggService.checkoutCallback);

app.get('/tingg/success', tinggService.checkoutSuccess);
app.get('/tingg/fail', tinggService.checkoutFail);
app.get('/tingg/pending', tinggService.checkoutPending);

app.all('/tingg/webhook', tinggService.webhook);

app.get('/tingg/test', tinggService.test);

app.listen(3000, () => {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
