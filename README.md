# Digital Wallet Topup Feature:


We are building an online shopping system and one feature is a digital wallet. Each registered customer has one digital wallet in our system.
Customers can top up their digital wallets using PayId (Australia’s instant bank transfer process), and they can use the funds in their wallets
to purchase products and enjoy special discounts.

The actual PayId payment process is handled by a third-party payment platform. To integrate with the third-party payment platform, our
digital wallet top-up sub-system needs to provide a webhook API endpoint. Every time a customer makes a payment via our PayId, the third-
party payment platform will send a notification to the webhook endpoint, and our system needs to credit the customer’s wallet account
accordingly.

## What's in this repository?

Set of APIs contributing to the functioning of the Digital Wallet Topup Feature.

1. /getUserInfo - API to retrive User and account details
2. /getTransaction - API to retrieve transaction information w.r.t particular userID over a period of time.
3. /updateWallet - API to update the wallet with the latest transaction made by the user.


## Getting Started:

1. Clone this Git reposiotry in the desired location of your local system.
   
   - git clone https://github.com/shubhangi-mp/digital-wallet-topop.git
3. Make sure, you have  nodejs, serverless, your favourite IDE installed. Then navigate to the project directory and install all the dependencies.

   - npm install
4. Configure AWS Credentials: To run this in your local system you can run the below command:
   
    serverless config credentials --provider aws --key {your aws access key id} --secret {your was secret access key} --profile serverlessAccount

    I have used the name serverlessAccount for the profile, you may give your own name and make sure the same profile name is updated in serverless.yml under provider.

    Alternatively you can set up and use gimme-aws-creds for connecting to AWS locally
   
5. Hit below command:
   
   serverless deploy
   
## Further Details on the API:

1. /getUserInfo:
   
   Method - GET
   
   Gateway URL to test - https://zvl247n3hl.execute-api.us-east-1.amazonaws.com/dev/getUserInfo/{userId}
   
   Example -  https://zvl247n3hl.execute-api.us-east-1.amazonaws.com/dev/getUserInfo/111

   Sample Response:
   
   {
   
    "accountNumber": "39bf97f5-9951-4182-bddf-abc82d6bfb6c",
   
    "userId": 111,
   
    "balanceAmt": 10.6,
   
    "createTimestamp": "2024-02-06T02:25:36.096Z"

   }

  Current Balance of the wallet account of a user with user Id - 11 is 10.6.
  
  accountNumber - Account Number of the user. 

  2. /getTransactionDetails

     Method - GET
   
     Gateway URL to test - https://zvl247n3hl.execute-api.us-east-1.amazonaws.com/dev/getUserInfo/{userId}
     
     Example -  https://zvl247n3hl.execute-api.us-east-1.amazonaws.com/dev/getTransactionDetails/{userId}
  
     Sample Response:
     
     [
     
    {
        "transactionAmt": 5.6,
     
        "transactionId": "6fb67d4e-76af-40b6-b2f5-332a22c6a08e",
     
        "userId": 111,
     
        "createTimestamp": "2024-02-06T02:25:20.715Z"
     
    },
    
    {
        "transactionAmt": 5,
        
        "transactionId": "13869c17-4712-4f8d-b0c2-07de17f593ab",
        
        "userId": 111,
        
        "createTimestamp": "2024-02-06T02:25:36.096Z"
    }
]
  
3. /updateWallet:

     Method - POST
   
     Gateway URL to test - https://zvl247n3hl.execute-api.us-east-1.amazonaws.com/dev/updateWallet
     
     Sample Request:

     {
   
      "userId": 111,
   
      "transactionAmt": 5
   
    }
  
     Sample Response:

    {

    "message": "Wallet got updated successfully"
   
    }


   


   
