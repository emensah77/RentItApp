const AWS = require('aws-sdk');

const stepfunctions = new AWS.StepFunctions();

exports.handler = async event => {
  const params = {
    stateMachineArn: 'arn:aws:states:us-east-2:945426664553:stateMachine:stepFunctionProcessor', // replace with your state machine ARN
    input: JSON.stringify(event), // pass DynamoDB Stream event as input to the Step Function
    name: `Execution-${Date.now()}`, // execution name must be unique
  };

  try {
    const response = await stepfunctions.startExecution(params).promise();
    console.log(`Started execution for ${params.name}: ${JSON.stringify(response)}`);
  } catch (error) {
    console.error(`Error starting execution for ${params.name}: ${JSON.stringify(error)}`);
    throw error;
  }
};
