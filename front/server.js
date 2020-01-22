const express = require('express');
const next = require('next'); 
const path = require('path')
const fs = require('fs')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
 
const dev = process.env.NODE_ENV !== 'production';  //옵션으로나중에 들어감.// 빌드를 먼저 하라는 컴플레인이 나올 수 있기 때문에 !production  이 방식으로 가자. 
const prod = process.env.NODE_ENV === 'production';


// const path = require('path')
// const fs = require('fs')
var certsPath = path.join(__dirname, 'path', 'to');
const https = require('https')
const http = require('http')

const options ={
    key: fs.readFileSync(path.join(certsPath, 'sumontee_com_key.txt')),
   
    cert: fs.readFileSync(path.join(certsPath, 'sumontee.com.crt')),
   
    ca: fs.readFileSync(path.join(certsPath, 'sumontee.com.ca-bundle'))
}

//  const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
//   cert: fs.readFileSync(path.join(certsPath, 'sumontee.com.crt')),
//   key: fs.readFileSync(path.join(certsPath, 'sumontee_com_key.txt'))
  
// }) not required at the moment

const app = next({ dev });  
const handle = app.getRequestHandler(); // from next. 요청 처리기라고 보면된다. sudo susudo 
dotenv.config();

app.prepare().then(() => {  // 여기까지 next와 연결하는 부분이다. 
  //여기서 부터는 그냥 express
  const server = express();
  

  server.use(morgan('dev'));
  server.use(express.json());
  


  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(expressSession({
    resave: true,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV ==="production" ? false : false ,
    },
  }));

  server.get('/post/:id', (req, res) => {
    return app.render(req, res, '/post', { id: req.params.id }); 
  }); 
  
  server.get('/hashtag/:tag', (req, res) => {
    return app.render(req, res, '/hashtag', { tag: req.params.tag }); 
  });

  server.get('/user/:id', async (req, res) => {
    return app.render(req, res, '/user', { id: req.params.id });
  });

  server.get('*', (req, res) => {
    return handle(req, res); // getRequestHandler from NEXT
    //모든 요청은 어기서 처리하겠다는 말이다. 화면 띄우는 것 까지도
  });

  http.createServer(server).listen(prod ? process.env.PORT : 3000, () => {
    console.log(`next+express running on port ${process.env.PORT}`);
  });

  https.createServer(options, server).listen(prod ? 443 : 3001, () => {
    console.log(`next+express running on port ${process.env.PORT}`);
  });

  // server.listen(prod ? process.env.PORT : 3000, () => {
  //   console.log(`next+express running on port ${process.env.PORT}`);
  // });

  // server.listen(prod ? process.env.PORT : 3000, () => {
  //   console.log(`next+express running on port ${process.env.PORT}`);
  // });
});
// module.exports = httpsAgent
