'use strict';

const _ = require('lodash');

const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();


const handler = async (event) => {
    console.log("event", event);

    const userId = _.get(event, 'pathParameters.userId');

    // Check if userId is valid
    if (!userId || isNaN(userId)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid userId' })
        };
    }

    const params = {
        TableName: "users",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
            ":uid": Number(userId),
        },
        ScanIndexForward: false,
        Limit: 1,
    };

    console.log("params", params);


    try {
        const data = await documentClient.query(params).promise();

        if (data.Items.length === 0) {
            console.log("User not found");
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' })
            };
        }

        const response = data.Items[0];
        console.log("Fetched Params", response);
        response['balanceAmt'] = response['balanceAmt'] / 100; //Convert back from cents to dollars in response
        
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };

    } catch (error) {
        console.error('Error fetching user info:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};


module.exports = {
    handler
};

// serverless invoke local - f getUserInfo - p data/getUserInfo.json