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

    //Transaction from past x number of days, the value of x would be given in user input.
    const days = event.queryStringParameters && event.queryStringParameters.days ? parseInt(event.queryStringParameters.days) : 7; // Defaulting to 7 days if not provided

    // Calculate the timestamp for 'days' days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const params = {
        TableName: "usersTransactions",
        KeyConditionExpression: "userId = :uid AND createTimestamp >= :startDate",
        ExpressionAttributeValues: {
            ":uid": Number(userId),
            ":startDate": startDate.toISOString(),
        },
    };

    console.log("params", params);

    try {
        const data = await documentClient.query(params).promise();

        if (data.Items.length === 0) {
            console.log("User not found or no transactions from past", days, "days");
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Transaction not found' })
            };
        }

        console.log("Fetched Records", data.Items);
        const response = data.Items;

        //Convert the amount back from cents to dollars for response
        const finalResponse = response.map(obj => {
            obj['transactionAmt'] = obj['transactionAmt'] / 100
            return obj;
        } );

        return {
            statusCode: 200,
            body: JSON.stringify(finalResponse)
        };
    } catch (error) {
        console.error('Error fetching transaction info:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

module.exports = {
    handler
};


// //serverless invoke local -f getTransactionDetails -p  data/getTransactionDetails.json
