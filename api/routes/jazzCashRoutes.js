import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from 'cors';

 
dotenv.config();
 // Call config to load environment variables

const router = express.Router();



const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID;
const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD;
const JAZZCASH_HASH_KEY = process.env.JAZZCASH_HASH_KEY;
const JAZZCASH_RETURN_URL = process.env.JAZZCASH_RETURN_URL;
const JAZZCASH_URL = process.env.JAZZCASH_SANDBOX_URL;

function getFormattedDate() {
  const now = new Date();
  return now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

function getExpiryDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30); 
  return now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

router.post("/initiate", async (req, res) => {
  const order = req.body;

  const txnRefNo = `T${Date.now()}`;
  const txnDateTime = getFormattedDate();
  const expiryDateTime = getExpiryDate();

  const pp_Amount = Math.round(order.total * 100).toString().padStart(12, "0");

  const fields = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: JAZZCASH_MERCHANT_ID,
    pp_Password: JAZZCASH_PASSWORD,
    pp_TxnRefNo: txnRefNo,
    pp_Amount,
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: txnDateTime,
    pp_BillReference: "billRef",
    pp_Description: "Online shopping checkout",
    pp_TxnExpiryDateTime: expiryDateTime,
    pp_ReturnURL: JAZZCASH_RETURN_URL,
    pp_SecureHash: "", 
    ppmpf_1: order.customerName,
    ppmpf_2: order.email,
    ppmpf_3: order.phoneNumber,
    ppmpf_4: order.buyerId,
    ppmpf_5: "ExtraData",
  };

  const sortedString = Object.keys(fields)
    .filter(k => k !== "pp_SecureHash")
    .sort()
    .map(k => `${k}=${fields[k]}`)
    .join("&");

  const hash = crypto
    .createHmac("sha256", JAZZCASH_HASH_KEY)
    .update(sortedString)
    .digest("hex")
    .toUpperCase();

  fields.pp_SecureHash = hash;

  console.log("String to hash:", sortedString);
  console.log("SecureHash:", hash);

  res.json({
    paymentURL: JAZZCASH_URL,
    fields,
  });
});
// router.post('/initiate-payment', async (req, res) => {
//   const { amount, phoneNumber } = req.body;
  
//   const params = {
//     pp_Version: '1.1',
//     pp_TxnType: 'MWALLET',
//     pp_Language: 'EN',
//     pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
//     pp_Password: process.env.JAZZCASH_PASSWORD,
//     pp_SubMerchantID: '',
//     pp_TxnRefNo: 'T' + Date.now(),
//     pp_Amount: amount * 100,
//     pp_DiscountedAmount: '',
//     pp_DiscountBank: '',
//     pp_TxnCurrency: 'PKR',
//     pp_TxnDateTime: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14),
//     pp_BillReference: 'billRef',
//     pp_Description: 'Payment',
//     pp_ReturnURL: `${process.env.BASE_URL}/api/payment/callback`,
//     ppmpf_1: phoneNumber,
//     ppmpf_2: '',
//     ppmpf_3: '',
//     ppmpf_4: '',
//     ppmpf_5: ''
//   };

//   // CORRECT HASH GENERATION
//   const hashParams = [
//     params.pp_Version,
//     params.pp_TxnType,
//     params.pp_Language,
//     params.pp_MerchantID,
//     params.pp_Password,
//     params.pp_SubMerchantID,
//     params.pp_TxnRefNo,
//     params.pp_Amount,
//     params.pp_DiscountedAmount,
//     params.pp_DiscountBank,
//     params.pp_TxnCurrency,
//     params.pp_TxnDateTime,
//     params.pp_BillReference,
//     params.pp_Description,
//     params.pp_ReturnURL,
//     params.ppmpf_1,
//     params.ppmpf_2,
//     params.ppmpf_3,
//     params.ppmpf_4,
//     params.ppmpf_5
//   ].join('&');

//   params.pp_SecureHash = crypto
//     .createHash('sha256')
//     .update(hashParams + process.env.JAZZCASH_HASH_KEY)
//     .digest('hex');

//   res.json({ 
//     paymentUrl: 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction',
//     params 
//   });
// });

router.post('/payment/callback', (req, res) => {
  // Verify response hash
  const responseHash = req.body.pp_SecureHash;
  // Process payment response and update DB
  // Redirect to frontend status page
  res.redirect(`${process.env.FRONTEND_URL}/payment-status?status=${req.body.pp_ResponseCode}`);
});

export default router; // Use `export default` to export the router
