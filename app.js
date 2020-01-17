const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const UserRoute = require('./routes/controller/user');
const UtilsRoute = require('./routes/controller/utils');
const debug = require('debug')('SERVER:');
const app = express();
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const csrfMiddleware = csurf({
  cookie: true
});

mongoose.connect(process.env.DB,{ 
  useNewUrlParser: true ,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err) => {
  if(err) {
    debug('DB is not connected error = '+err);
  } else{
    debug('DB is connected');
  }
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

const conditionalCSRF =  (req, res, next) => {
  csrfMiddleware(req, res, next);
}

app.use(conditionalCSRF);
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/api/utils', UtilsRoute);
app.use('/api', UserRoute);

app.get('/getCsrfToken',(req,res)=>{
    return res.json({'_csrf': req.csrfToken()}).status(200);
});

app.listen(process.env.PORT,() => {
  debug("listening at PORT = "+process.env.PORT);
});