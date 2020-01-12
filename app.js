const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const UserRoute = require('./routes/user');
const debug = require('debug')('SERVER:');
const app = express();
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const csrfMiddleware = csurf({
  cookie: true
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

const conditionalCSRF =  (req, res, next) => {
    csrfMiddleware(req, res, next);
}

app.use(conditionalCSRF);
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/api',UserRoute);

app.get('/test',(req,res)=>{
    return res.json({'msg': 'working'}).status(202);
});

app.listen(process.env.PORT,() => {
  debug("listening at PORT = "+process.env.PORT);
});