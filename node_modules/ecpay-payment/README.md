[![NPM version][npm-image]][npm-url] 
[![GitHub license][license-image]][license-url]
# 綠界全方位(All In One)金流介接模組

## Module Usage

### Installation
Install the project dependencies.You can use npm or yarn(recommended) for dependency management。

```bash
## npm
npm install ecpay-payment --save
```

### Usage

```js
const ecpay_payment = require('ecpay-payment');

// 結帳資訊
let base_param = {};
// 電子發票
let inv_params = {};

const initParm = (total, item) => {
  base_param = {
    MerchantTradeNo: 'f0a0d7e9fae1bb72bc93', //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: '2018/02/13 15:45:30', //ex: 2018/02/13 15:45:30
    TotalAmount: total,
    TradeDesc: '交易描述',
    ItemName: item,
    ReturnURL: 'https://55e9298f.ngrok.io/result',
    InvoiceMark: 'Y',
    Remark: '交易備註',
    CustomField1: '紅色*1',
  };
}
initParm(200, 'product');
let create = new ecpay_payment();
let htm = create.payment_client.aio_check_out_all(parameters = base_param, invoice = inv_params);
```

## License
MIT


[npm-image]: https://img.shields.io/badge/npm-v1.1.1-blue.svg
[npm-url]: https://www.npmjs.com/package/imgur-module

[license-image]: https://img.shields.io/npm/l/express.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com
[license-url]: https://github.com/andy6804tw/imgur-module/blob/master/LICENSE
