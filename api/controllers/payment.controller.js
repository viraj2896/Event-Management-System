const config = require('config');
const paypal = require('paypal-rest-sdk');
const payModel = require('../models/pay.model');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': config.get('paypal_clientId'),
    'client_secret': config.get('paypal_secret')
});

exports.pay = function(req, res){

    const name = req.body.name;
    const amount = req.body.amount;
    const userId = req.user;

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://falcons-event-management.herokuapp.com/paymentsuccess",
            "cancel_url": "https://falcons-event-management.herokuapp.com/paymentfailure"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": name,
                    "sku": "001",
                    "price": amount,
                    "currency": "CAD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "CAD",
                "total": amount
            },
            "description": "Contributing money"
        }]
    };
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error)
            throw error;
        } else {
            
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                return res.send({
                    'paypalLink':payment.links[i].href,
                    'userId': userId,
                    'eventId': "5e728f21cb5eb79ed0d277b5",
                    'amount': amount
                });
              }
            }
        }
      });
};

exports.success = function(req, res){
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const userId = req.body.userId;
  const eventId = req.body.eventId;
  const amount = req.body.amount;

  console.log(`userId: ${userId} -- eventId: ${eventId}`)

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "CAD",
            "total": amount
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
    if (error) {
        console.log('paypal execute error',error)
        throw error;
    } else {
        await payModel.create({
            userId: userId,
            amount: payment.transactions[0].amount.total,
            firstname: payment.payer.payer_info.first_name,
            lastname: payment.payer.payer_info.last_name,
            eventId: eventId
        }, function(err, data){
            if(err){
                return res.status(400).send('Error Encountered while processing the payment!'+err);
            }
            
            res.send({
                'status': 'success',
                'message': 'Transaction successfully completed!'
            });
        });
    }
});
};

exports.cancel = function(req, res){
    res.send({
        'status': 'failure',
        'message': 'Something went wrong!'
    });
};

