const stripe = require('stripe')(
  'sk_test_51JdytaJGNsvkOPNSqUhyoExomn7lKvdgwQ46AqYaPM5cjdrxcXoZPnVJQV4xg3GvYaF5rbsOhOn4E2u6gQfoNQvc00KQgdqDQD',
);
exports.handler = async event => {
  const {typeName, arguments} = event;

  if (typeName !== 'Mutation') {
    throw new Error('Request is not a mutation');
  }

  if (!arguments?.amount) {
    throw new Error('Amount argument is required');
  }

  // create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: arguments.amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};
