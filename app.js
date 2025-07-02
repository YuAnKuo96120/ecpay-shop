const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const orderRouter = require('./routes/order');
app.use('/', orderRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`伺服器啟動於 http://localhost:${port}`);
}); 