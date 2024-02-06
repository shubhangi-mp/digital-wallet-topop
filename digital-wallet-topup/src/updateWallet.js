'use strict';
const _ = require('lodash');

const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const { v4: uuidv4 } = require('uuid');

const handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    const transactionAmt = _.get(requestBody, 'transactionAmt', '') * 100;
    const userId = _.get(requestBody, 'userId', '');

    // Check if userId is valid
    if (!userId || isNaN(userId)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid userId' })
        };
    }

    const currentTime = new Date().toISOString();

    let userParamsToSave;

    const transactionParamsToSave = {
        TableName: 'usersTransactions',
        Item: {
            userId: userId,
            transactionId: generateTransactionId(),
            transactionAmt,
            createTimestamp: currentTime
        },
    };

    try {

        const userIdParam = {
            TableName: 'users',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        };

        const userData = await documentClient.query(userIdParam).promise();

        const userNotExists = (!userData.Items) || userData.Items.length === 0;

        let transactionItems;

        //If the user doesn't exist, creating the user record only in user table but not in transaction table
        if (userNotExists) {
            userParamsToSave = {
                TableName: 'users',
                Item: {
                    userId: userId,
                    balanceAmt: 0,
                    accountNumber: generateAccountNumber(),
                    createTimestamp: currentTime,
                },
            };
            transactionItems = [
                {
                    Put: userParamsToSave,
                }
            ];
        }
        //If user exists, then transaction info is also needed to be stored
        else {
            const response = await getBalanceAndAccNumber(userId, transactionAmt);
            console.log("response", response);
            userParamsToSave = {
                TableName: 'users',
                Item: {
                    userId: userId,
                    balanceAmt: response[1],
                    accountNumber: response[0],
                    createTimestamp: currentTime,
                },
            };
            transactionItems = [
                {
                    Put: userParamsToSave,
                },
                {
                    Put: transactionParamsToSave

                }
            ];
        }
        console.log("params to be stored", userParamsToSave, transactionParamsToSave);
       
        
        const transactionParams = {
            TransactItems: transactionItems,
        };

        await documentClient.transactWrite(transactionParams).promise();


        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Wallet got updated successfully' }),
        };
    } catch (error) {
        console.error('Error putting data:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

const generateAccountNumber = () => {
    return uuidv4();
};

const generateTransactionId = () => {
    return uuidv4();
};

//Come up with balanceAmt and accountNumber from the latest record in the database.
//Account Number = Direct copy from latets user record
//balanceAmt = latest record balanceAmt + transaction amount from user

const getBalanceAndAccNumber = async (userId, transactionAmt) => {
    const params = {
        TableName: 'users',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        },
        ScanIndexForward: false,
        Limit: 1,
    };
    const result = await documentClient.query(params).promise();
    console.log("result", result);
    const latestRecord = result.Items ? result.Items[0] : null;
    console.log("latest", latestRecord);
    const accountNumber = _.get(latestRecord, 'accountNumber', '');
    console.log("aacc", accountNumber);
    const balanceAmt = _.get(latestRecord, 'balanceAmt', '');
    const newBalanceAmt = balanceAmt + transactionAmt;
    return [accountNumber, newBalanceAmt];

}


module.exports = {
    handler
};

// serverless invoke local - f updateWallet - p data/updateWallet.json  