exports.handler = async (event) => {
  const { typeName, args } = event;

  if (typeName !== 'Mutation') {
    throw new Error('Request is not a mutation');
  }

  if (!args?.amount) {
    throw new Error('Amount argument is required');
  }

  try {
    // The console.log below will not run until the POST request above finishes
  } catch (err) {
    console.error('POST request failed, error:', err);
  }
  //   const req = https.request(options, res => {
  //     let data = ''
  //     res.on('data', (chunk) => {
  //       data += chunk
  //     });
  //     res.on('end', () => {
  //       console.log(JSON.parse(data))
  //     })
  //   }).on('error', error => {
  //     console.error(error)
  //   })
  //   req.write(params)
  //   req.end()

  // create payment intent
  return {
    authorizationUrl: '',
  };
};
