const bodyParser = require('body-parser');
const random = require('crypto-string-module');

/**
 * Created by ying.wu on 2017/6/27.
 */
const ecpay_payment = require('./../lib/index');
//參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
//若要測試非必帶參數請將base_param內註解的參數依需求取消註解 //
let base_param = {};
// 若要測試開立電子發票，請將inv_params內的"所有"參數取消註解 //
let inv_params = {};

const initParm = (total, item) => {
  base_param = {
    MerchantTradeNo: random.RandomChar(20), //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: '2018/02/13 15:45:30', //ex: 2018/02/13 15:45:30
    TotalAmount: total,
    TradeDesc: 'Quapni前打輪系列',
    ItemName: item,
    ReturnURL: 'https://55e9298f.ngrok.io/result',
    InvoiceMark: 'Y',
    // ChooseSubPayment: '',
    //OrderResultURL: 'https://f7d2cb15.ngrok.io/payment_result',
    // NeedExtraPaidInfo: '1',
    // ClientBackURL: 'https://www.google.com',
    // ItemURL: 'http://item.test.tw',
    Remark: '交易備註',
    // HoldTradeAMT: '1',
    // StoreID: '',
    CustomField1: '紅色一',
    // CustomField2: '',
    // CustomField3: '',
    // CustomField4: ''
  };
}


const express = require('express');
const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  initParm(req.query.total, req.query.item);
  let create = new ecpay_payment();
  let htm = create.payment_client.aio_check_out_all(parameters = base_param, invoice = inv_params);
  //console.log(htm)
  res.send(htm)
})

app.listen('1337', function () {
  console.log('success on 1337');
})


app.post('/result', function (req, res) {
  console.log('付款完成！')
})

app.post('/payment_result', function (req, res) {
  console.log('完成')
  res.send('done')
})
