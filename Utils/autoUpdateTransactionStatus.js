const cron = require('node-cron');
const orders = require('../models/ordersModel');
const { getTransactionDetails } = require('../controllers/paymentController');

const autoUpdateTransactionStatus = cron.schedule('*/15 * * * *', async () => {
    try {
        const transactionIdArray = await orders.findAll({
            attributes: ['transaction_id']
        });
        for (let i = 0; i < transactionIdArray.length; i++) {
            let transactionId = transactionIdArray[i].dataValues.transaction_id;
            const transactionDetails = await getTransactionDetails(transactionId);
            const transactionStatus = transactionDetails.transaction.transactionStatus;
            await orders.update({
                transaction_status: transactionStatus
            },{
                where:{
                    transaction_id: transactionId
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = {autoUpdateTransactionStatus};