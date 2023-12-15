const { APIContracts, APIControllers } = require('authorizenet');
require('dotenv').config();
const addresses = require('../models/addressesModel');
const orders = require('../models/ordersModel');
const { sendOrderConfirmedMail } = require('../services/orderConfirmedEmail');
const { sendOrderCancelledMail } = require('../services/orderCancelledEmail');
const customerProfiles = require('../models/customerProfilesModel');
const { getCustomerProfile } = require('../controllers/customerProfile');

//Authorize.net credentials
const apiLoginId = process.env.API_LOGIN_ID;
const transactionKey = process.env.TRANSACTION_KEY;

//Charge a customer payment profile
const chargeCustomerProfile = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const { creditCard, amount } = req.body;
        const customerProfile = await customerProfiles.findOne({
            where: {
                user_id: userId
            }
        });
        const customerprofileData = await getCustomerProfile(customerProfile.customer_profile_id);
        const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(apiLoginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const profileToCharge = new APIContracts.CustomerProfilePaymentType();
        profileToCharge.setCustomerProfileId(customerprofileData.customerProfileId);

        const paymentProfile = new APIContracts.PaymentProfile();
        paymentProfile.setPaymentProfileId(creditCard);
        // paymentProfile.setCardCode(cvv);
        profileToCharge.setPaymentProfile(paymentProfile);

        //Add shipping and billing address
        const shipping_adress = await addresses.findOne({
            where: {
                user_id: userId,
                type: 'S',
                default_address: true
            }
        });

        const shipTo = new APIContracts.CustomerAddressType();
        shipTo.setFirstName(shipping_adress.name);
        shipTo.setAddress(shipping_adress.hno);
        shipTo.setCity(shipping_adress.city);
        shipTo.setState(shipping_adress.state);
        shipTo.setZip(shipping_adress.pincode);

        const transactionRequestType = new APIContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setProfile(profileToCharge);
        transactionRequestType.setAmount(parseFloat(amount));
        transactionRequestType.setShipTo(shipTo);

        const createRequest = new APIContracts.CreateTransactionRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setTransactionRequest(transactionRequestType);

        const controller = new APIControllers.CreateTransactionController(createRequest.getJSON());

        controller.execute(async () => {
            const apiResponse = controller.getResponse();
            const response = new APIContracts.CreateTransactionResponse(apiResponse);
            if (response != null) {
                if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                    const transactionId = apiResponse.transactionResponse.transId;
                    sendOrderConfirmedMail(user.email, transactionId);
                    console.log('Payment Successfull!');
                    res.redirect(`/checkout/place_order/${transactionId}`);
                } else {
                    console.log('Payment Failed!');
                    const errorMessage = response.getMessages().getMessage();
                    console.log(errorMessage);
                    req.flash('error', 'Payment Failed, Please Try Again!');
                    res.redirect('/checkout');
                }
            } else {
                console.log('No Response');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

//To get transaction details to check if it is settled or not
//If not settled void transaction else refund
const getTransactionDetails = async (transactionId) => {
    try {
        const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(apiLoginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const getRequest = new APIContracts.GetTransactionDetailsRequest();
        getRequest.setMerchantAuthentication(merchantAuthenticationType);
        getRequest.setTransId(transactionId);

        const controller = new APIControllers.GetTransactionDetailsController(getRequest.getJSON());

        return new Promise((resolve, reject) => {
            controller.execute(() => {
                const apiResponse = controller.getResponse();
                const response = new APIContracts.GetTransactionDetailsResponse(apiResponse);
                if (response != null && response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                    resolve(apiResponse);
                } else {
                    reject(null);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

//Void Transaction
const voidTransaction = async (req, res, userId, userEmail, transactionId) => {
    try {
        const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(apiLoginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const transactionRequestType = new APIContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.VOIDTRANSACTION);
        transactionRequestType.setRefTransId(transactionId);

        const createRequest = new APIContracts.CreateTransactionRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setTransactionRequest(transactionRequestType);

        const controller = new APIControllers.CreateTransactionController(createRequest.getJSON());

        controller.execute(async () => {
            const apiResponse = controller.getResponse();
            const response = new APIContracts.CreateTransactionResponse(apiResponse);

            if (response != null) {
                if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                    const apiTransactionId = apiResponse.transactionResponse.transId;
                    sendOrderCancelledMail(userEmail, apiTransactionId, false);  //false for void transaction and true for refund to mention in mail
                    console.log('Transaction Voided!');
                    await orders.update({
                        status: 'Cancelled'
                    }, {
                        where: {
                            user_id: userId,
                            transaction_id: transactionId
                        }
                    })
                    res.redirect('/profile/track_orders');
                } else {
                    console.log('Void Transaction Failed!');
                    const errorMessage = response.getMessages().getMessage();
                    console.log(errorMessage);
                    req.flash('error', 'Order Cancellation Failed!');
                    res.redirect('/profile/track_orders');
                }
            } else {
                console.log('No Response');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

//Refund on cancellation of order
const refundPayment = async (req, res, userId, userEmail, transactionId, creditCard) => {
    try {
        const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(apiLoginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const order = await orders.findOne({
            where: {
                user_id: userId,
                transaction_id: transactionId
            }
        })

        const paymentType = new APIContracts.PaymentType();
        paymentType.setCreditCard({
            cardNumber: creditCard.cardNumber,
            expirationDate: creditCard.expirationDate
        })

        //Transaction Request
        const transactionRequestType = new APIContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.REFUNDTRANSACTION);
        transactionRequestType.setAmount(parseFloat(order.total_price));
        transactionRequestType.setRefTransId(transactionId);
        transactionRequestType.setPayment(paymentType);

        const createRequest = new APIContracts.CreateTransactionRequest();
        createRequest.setTransactionRequest(transactionRequestType);
        createRequest.setMerchantAuthentication(merchantAuthenticationType);

        const controller = new APIControllers.CreateTransactionController(createRequest.getJSON());
        controller.execute(async () => {
            const apiResponse = controller.getResponse();
            const response = new APIContracts.CreateTransactionResponse(apiResponse);
            if (response != null) {
                if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                    console.log('Refund Successfull!');
                    const refundTransactionId = apiResponse.transactionResponse.transID;
                    sendOrderCancelledMail(userEmail, refundTransactionId, true); //false for void transaction and true for refund to mention in mail
                    await orders.update({
                        refund_transaction_id: refundTransactionId,
                        status: 'Cancelled'
                    }, {
                        where: {
                            user_id: userId,
                            transaction_id: transactionId
                        }
                    })
                    res.redirect('/profile/track_orders');
                } else {
                    console.log('Refund Failed!');
                    const errorMessage = response.getMessages().getMessage();
                    console.log(errorMessage);
                    console.log(apiResponse.transactionResponse.errors);
                    req.flash('error', 'Order Cancellation Failed!');
                    res.redirect('/profile/track_orders');
                }
            } else {
                console.log('No Response');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    chargeCustomerProfile,
    getTransactionDetails,
    voidTransaction,
    refundPayment
};
