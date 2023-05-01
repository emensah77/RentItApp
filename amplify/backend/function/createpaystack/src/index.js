const https = require('https')

function httpsRequest(options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        
        req.on('error', (e) => {
            reject(e.message);
        });
        
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

exports.handler = async (event) => {
    const { typeName, args } = event;

    if (typeName !== 'Mutation') {
        throw new Error('Request is not a mutation');
    }

    if (!args?.amount) {
        throw new Error('Amount argument is required');
    }
    const params = JSON.stringify({
        "email": "customer@email.com",
        "amount": "20000"
    })

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: 'Bearer SECRET_KEY',
            'Content-Type': 'application/json'
        }
    }

    let postBody;
    try {
        postBody = await httpsRequest(options, params);
        // The console.log below will not run until the POST request above finishes
        console.log('POST response body:', postBody);

    } catch (err) {
        console.error('POST request failed, error:', err);
    }

    // create payment intent
    return {
        authorizationUrl: postBody,
    }
};
