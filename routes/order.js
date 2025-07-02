const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const orders = {};

const {
  MerchantID,
  HASHKEY,
  HASHIV,
  Version,
  PayGateWay,
  NotifyUrl,
  ReturnUrl,
} = process.env;
const RespondType = 'JSON';

// 建立訂單首頁
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 建立訂單
router.post('/createOrder', (req, res) => {
  const data = req.body;
  console.log('收到前端 data:', data);
  
  // 檢查金額格式
  let amt = parseInt(data.Amt, 10);
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).send('金額格式錯誤，請確認金額欄位有正確填寫且為正整數');
  }

  // 使用 Unix Timestamp 作為訂單編號（金流也需要加入時間戳記）
  const TimeStamp = Math.round(new Date().getTime() / 1000);
  const order = {
    ...data,
    TimeStamp,
    Amt: amt,
    MerchantOrderNo: TimeStamp,
  };

  // 進行訂單加密
  const aesEncrypt = createSesEncrypt(order);
  console.log('aesEncrypt:', aesEncrypt);

  // 使用 HASH 再次 SHA 加密字串，作為驗證使用
  const shaEncrypt = createShaEncrypt(aesEncrypt);
  console.log('shaEncrypt:', shaEncrypt);
  order.aesEncrypt = aesEncrypt;
  order.shaEncrypt = shaEncrypt;

  orders[TimeStamp] = order;
  console.log(orders[TimeStamp]);

  res.redirect(`/check/${TimeStamp}`);
});

router.get('/check/:id', (req, res, next) => {
  const { id } = req.params;
  const order = orders[id];
  console.log(order);
  res.render('check', {
    title: 'Express',
    PayGateWay,
    Version,
    order,
    MerchantID,
    NotifyUrl,
    ReturnUrl,
  });
});

// 交易成功：Return
router.post('/newebpay_return', function (req, res, next) {
  console.log('req.body return data', req.body);
  res.render('success', { title: 'Express' });
});

// 確認交易：Notify
router.post('/newebpay_notify', function (req, res, next) {
  console.log('req.body notify data', req.body);
  const response = req.body;

  // 解密交易內容
  const data = createSesDecrypt(response.TradeInfo);
  console.log('data:', data);

  // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
  console.log(orders[data?.Result?.MerchantOrderNo]);
  if (!orders[data?.Result?.MerchantOrderNo]) {
    console.log('找不到訂單');
    return res.end();
  }

  // 使用 HASH 再次 SHA 加密字串，確保比對一致
  const thisShaEncrypt = createShaEncrypt(response.TradeInfo);
  if (!thisShaEncrypt === response.TradeSha) {
    console.log('付款失敗：TradeSha 不一致');
    return res.end();
  }

  // 交易完成，將成功資訊儲存於資料庫
  console.log('付款完成，訂單：', orders[data?.Result?.MerchantOrderNo]);

  return res.end();
});

// 字串組合
function genDataChain(order) {
  return `MerchantID=${MerchantID}&TimeStamp=${
    order.TimeStamp
  }&Version=${Version}&RespondType=${RespondType}&MerchantOrderNo=${
    order.MerchantOrderNo
  }&Amt=${order.Amt}&NotifyURL=${encodeURIComponent(
    NotifyUrl,
  )}&ReturnURL=${encodeURIComponent(ReturnUrl)}&ItemDesc=${encodeURIComponent(
    order.ItemDesc,
  )}&Email=${encodeURIComponent(order.Email)}`;
}

// AES 加密
function createSesEncrypt(TradeInfo) {
  const encrypt = crypto.createCipheriv('aes-256-cbc', HASHKEY, HASHIV);
  const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

// SHA256 加密
function createShaEncrypt(aesEncrypt) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;
  return sha.update(plainText).digest('hex').toUpperCase();
}

// AES 解密
function createSesDecrypt(TradeInfo) {
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  return JSON.parse(result);
}

module.exports = router; 