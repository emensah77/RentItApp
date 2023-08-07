const {StreamChat} = require('stream-chat');

exports.handler = async event => {
  const body = JSON.parse(event.body);
  const {user_id} = body;

  // Initialize the Stream Chat SDK with your API key and secret
  const chatClient = StreamChat.getInstance(
    'upcrj3b3pp7v',
    'ndvgk77tteykh2nqmyu6x3rvumyq65fzg22apw47wj7qk2nwvqwte3m52tac8z8z',
  );

  // Create a token for the user
  const token = chatClient.createToken(user_id);

  // Return the token in the response
  return {
    statusCode: 200,
    body: JSON.stringify({token}),
  };
};
