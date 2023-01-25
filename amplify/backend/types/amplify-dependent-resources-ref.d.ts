export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "airbnbclone52f6e38c": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "airbnbclone": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        },
        "tinggPaymentGateway": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "analytics": {
        "rentIt": {
            "Region": "string",
            "Id": "string",
            "appName": "string"
        }
    },
    "function": {
        "CreatePaymentIntent": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        },
        "createpaystack": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        },
        "tinggPaymentGateway": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        }
    },
    "storage": {
        "rentitmedia": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}