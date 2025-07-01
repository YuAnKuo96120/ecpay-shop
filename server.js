const express = require('express');
const bodyParser = require('body-parser');
const ecpay_payment = require('ecpay-payment');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.post('/create-order', (req, res) => {
  function getECPayDateString() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`;
  }
  const orderId = 'Test' + Date.now();
  const options = {
    OperationMode: "Test",
    MercProfile: {
      MerchantID: "2000132",
      HashKey: "5294y06JbISpM5x9",
      HashIV: "v77hoKGq4kWxNNIS"
    }
  };
  const create = new ecpay_payment(options);

  const param = {
    MerchantTradeNo: orderId,
    MerchantTradeDate: getECPayDateString(),
    TotalAmount: "500",
    TradeDesc: "自駕測試商品",
    ItemName: "自駕商品 #1",
    ReturnURL: "https://你的伺服器網址/ecpay-return",
    ClientBackURL: "http://localhost:3000/thankyou",
    ChoosePayment: "ALL",
  };

  const html = create.payment_client.aio_check_out_all(param, {});

  res.send(html);
});

app.post('/ecpay-return', (req, res) => {
  console.log('付款成功回傳：', req.body);
  res.send('1|OK');
});

app.get('/thankyou', (req, res) => {
  res.send('<h1>謝謝購買！付款完成。</h1>');
});

app.listen(port, () => {
  console.log(`伺服器啟動於 http://localhost:${port}`);
});
