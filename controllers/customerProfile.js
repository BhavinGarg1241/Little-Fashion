require('dotenv').config();
const { APIContracts, APIControllers } = require('authorizenet');
const customerProfiles = require('../models/customerProfilesModel.js');

//Authorize.net credentials
const apiLoginId = process.env.API_LOGIN_ID;
const transactionKey = process.env.TRANSACTION_KEY;

//Create Customer Profile
const createCustomerProfile = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const { cc, exp } = req.body;

        const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(apiLoginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const payment = new APIContracts.PaymentType();
        payment.setCreditCard({
            cardNumber: cc,
            expirationDate: exp
        })

        const customerPaymentProfileType = new APIContracts.CustomerPaymentProfileType();
        customerPaymentProfileType.setCustomerType(APIContracts.CustomerTypeEnum.INDIVIDUAL);
        customerPaymentProfileType.setPayment(payment);
        // customerPaymentProfileType.setBillTo(customerBillingAddress);

        const paymentProfileList = [];
        paymentProfileList.push(customerPaymentProfileType);

        const customerProfileId = Math.floor(Math.random() * 90000000) + 10000000;

        const customerProfileType = new APIContracts.CustomerProfileType();
        customerProfileType.setMerchantCustomerId(customerProfileId);
        customerProfileType.setDescription('Customer');
        customerProfileType.setEmail(user.email);
        customerProfileType.setPaymentProfiles(paymentProfileList);

        //Creating request to create customer profile
        const createRequest = new APIContracts.CreateCustomerProfileRequest();
        createRequest.setProfile(customerProfileType);
        createRequest.setValidationMode(APIContracts.ValidationModeEnum.TESTMODE);
        createRequest.setMerchantAuthentication(merchantAuthenticationType);

        const controller = new APIControllers.CreateCustomerProfileController(createRequest.getJSON());

        controller.execute(async () => {
            const apiResponse = controller.getResponse();
            const response = new APIContracts.CreateCustomerProfileResponse(apiResponse);
            if (response != null) {
                if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                    await customerProfiles.create({
                        user_id: userId,
                        customer_profile_id: customerProfileId
                    })
                    console.log('Customer Profile Created Successfully!');
                    res.redirect('/profile/saved_cards');
                } else {
                    console.log('Customer Profile Not Created!');
                    res.redirect('/profile/saved_cards');
                }
            }
        })

    } catch (error) {
        console.log(error);
    }
}

//Get Customer Profile
const getCustomerProfile = async (customerProfileId) => {
    try {
        const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(apiLoginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const getRequest = new APIContracts.GetCustomerProfileRequest();
        getRequest.setMerchantCustomerId(customerProfileId);
        getRequest.setMerchantAuthentication(merchantAuthenticationType);

        const controller = new APIControllers.CreateCustomerProfileController(getRequest.getJSON());

        return new Promise((resolve, reject) => {
            controller.execute(() => {
                const apiResponse = controller.getResponse();
                const response = new APIContracts.GetCustomerProfileResponse(apiResponse);
                if (response != null && response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                    console.log('Customer Profile Received Successfully!');
                    resolve(apiResponse.profile);
                } else {
                    console.log('Customer Profile Not Received!');
                    console.log(apiResponse.messages.message);
                    reject(null);
                }
            });
        });

    } catch (error) {
        console.log(error);
    }
}

//Create Customer Payment Profile
const createCustomerPaymentProfile = (req, res, customerProfileId) => {
    try {
        const { cc, exp, customerProfileId } = req.body;

        const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(apiLoginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const payment = new APIContracts.PaymentType();
        payment.setCreditCard({
            cardNumber: cc,
            expirationDate: exp
        })

        const profile = new APIContracts.CustomerPaymentProfileType();
        profile.setPayment(payment);

        //Creating request to create customer profile
        const createRequest = new APIContracts.CreateCustomerPaymentProfileRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setCustomerProfileId(customerProfileId);
        createRequest.setPaymentProfile(profile);

        const controller = new APIControllers.CreateCustomerProfileController(createRequest.getJSON());

        controller.execute(async () => {
            const apiResponse = controller.getResponse();
            const response = new APIContracts.GetCustomerProfileResponse(apiResponse);
            if (response != null) {
                if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                    console.log('Customer Payment Profile Created Successfully!');
                    res.redirect('/profile/saved_cards');
                } else {
                    console.log('Customer Payment Profile Not Created!');
                    console.log(apiResponse.messages.message);
                    req.flash('error', 'Card already exists.');
                    res.redirect('/profile/saved_cards');
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
}

//Delete Customer Payment Profile
const deleteCustomerPaymentProfile = (req,res) => {
    try {
        const {customerProfileId,customerPaymentProfileId} = req.body;

        const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(apiLoginId);
        merchantAuthenticationType.setTransactionKey(transactionKey);

        const deleteRequest = new APIContracts.DeleteCustomerPaymentProfileRequest();
        deleteRequest.setMerchantAuthentication(merchantAuthenticationType);
        deleteRequest.setCustomerProfileId(customerProfileId);
        deleteRequest.setCustomerPaymentProfileId(customerPaymentProfileId);

        const controller = new APIControllers.UpdateCustomerPaymentProfileController(deleteRequest.getJSON());

        controller.execute(() => {
            const apiResponse = controller.getResponse();
            const response = new APIContracts.GetCustomerProfileResponse(apiResponse);
            if (response != null) {
                if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
                    console.log('Customer Payment Profile Deleted Successfully!');
                    req.flash('error', 'Card Deleted Successfully.');
                    res.redirect('/profile/saved_cards');
                } else {
                    console.log('Customer Payment Profile Not Deleted!');
                    res.redirect('/profile/saved_cards');
                }
            }
        })

    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    createCustomerProfile,
    getCustomerProfile,
    createCustomerPaymentProfile,
    deleteCustomerPaymentProfile
};
