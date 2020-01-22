const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path')

const hpp = require('hpp')
const helmet = require('helmet')

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const roomAPIRouter = require('./routes/room');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');
//multer는 여기들어가지 않고 post rout에 바로 들어간다. 
const prod = process.env.NODE_ENV === 'production'
const fs = require('fs')
var certsPath = path.join(__dirname, 'path', 'to');


const options ={
    key: fs.readFileSync(path.join(certsPath, 'api_sumontee_com_key.txt')),
   
    cert: fs.readFileSync(path.join(certsPath, 'api.sumontee.com.crt')),
   
    ca: fs.readFileSync(path.join(certsPath, 'api.sumontee.com.ca-bundle'))
}



dotenv.config(); //실행
//////////////////////소켓아이오 묶는 부분 
const app = express();
const https = require('https').Server(options, app)
const http = require('http').Server(app)
const server = process.env.NODE_ENV === "production" ? https : http
const io = require('socket.io')(server) //socket.io에 http를 다시 넘겨셔 연결해 준다. 
const PORT = 3065
////////////////////////////////////////////

io.on('connection', function (socket) { //internal message. connection
    socket.on("NewClient", function () { //커낵팅된 클라이언트를 socket에 연결하는 거다. 
        //각각의 socket이 "NewClint" 메시지를 보낼 떼, 
        if (clients < 2) {  //check the client number 
            if (clients == 1) {
                this.emit('CreatePeer') // 이경우 CreatePee를 송출한다. 
                //이거 받아서  MakePeer를 만든다. 처음 들어온 사람에게 적용. 
            }
        }
        else 
            this.emit('SessionActive') //두명이면 session active
        clients++; //client nubmer to be increased  //이거는 셋을 해놔야 할듯. 
    })
    // socket.on('Offer', SendOffer)
    // socket.on('Answer', SendAnswer)
    // socket.on('disconnect', Disconnect)

//     msg from client { message: 'adsasdf',
//   nickName: 'aoiwoi',
//   room: '27room',
//   signalRoom: '27signalRoom' }

// socket.to(req.room).emit('signaling_message', {

    socket.on('messageToServer', (msg)=>{
        console.log('msg from client', msg);
        socket.to(msg.room).emit('messageFromServer', msg)
        // socket.emit('messageToClient') 
        //다른 유저들에게 보내는 걸로 충분하다 여기서는. 
        // socket.to()
    })

    
   

    socket.on('ready', function(req) {
        // console.log('this is req', req);
        socket.join(req.chat_room); //will be postId
        socket.join(req.signal_room); //다시 조인하는 이유는 뭐지? for sdp?
        // io.of('/').to(req.chat_room).emit('announce', { //이건 socket.to(room name) 이어야 할듯?  예를들어 req.room 같이. 
        //     message: 'New client in the ' + req.data + ' room.'
        // })
        console.log('shake socketid', socket.id);
    })
    socket.on('send', function(req) {
        socket.to(req.room).emit('message', {
            message: req.message,
            author: req.author
        });
    })
    
    socket.on('signal', function(req) {
        //Note the use of req here for broadcasting so only the sender doesn't receive their own messages
        socket.to(req.room).emit('signaling_message', {
            type: req.type,
            message: req.message
        });
    })
    socket.on('close', (data)=>{
        console.log('before leave room', data);
        socket.leave(data.signalRoom)
        socket.leave(data.room)
        //rejoin이 현재는 문제. 방이 열려있는 상태에서 다시 들어가면 에러 발생. 다시 offer를 안하기 때문. 
        //처음 sdp를 저장해 뒀다가 재방문 시에 쏴 주도록 하는 식으로 가자. 
    })
})

///////////////////////////////////소켓아이오 묶는 부분 


db.sequelize.sync();
passportConfig();  // 실행

if(prod){
    app.use(hpp()) //이게 뭐지?
    app.use(helmet());
    app.use(morgan('combined'))
    app.use(cors({
        origin: 'https://sumontee.com',
        credentials: true,
      }));
}else{

    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials: true,
      }));
}


app.get('/', (req, res)=>{
    res.send('test server working')
})


app.use('/', express.static('uploads')); //지정해준 폴더에 있는 파일들을 다른 서버에서 가져갈 수 있게 해 준다. 
//앞에 '/' 이거는 업로드를 루트 폴더 쳐럼 클라이언트 사이트에서 보이게 해 준다. 


app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for formdata 처리
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV ==="production" ? false : false , 
    domain: prod && '.sumontee.com' //.이 중요하다 '.' 없이 그냥 가면 api.sumotee에서 작동을 안한다. 섭도메인드 까지 하기 위해 .
  },
  name: 'sumontee',  //cookie name to change. Browser에서 보는 쿠키 이름 
}));
app.use(passport.initialize()); //위에서 실행 이후에, 매 요청마다 실행 되어야 함.  실제 서비스에ㅅ는 캐싱ㅇ을 한다. 
app.use(passport.session());

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/room', roomAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);



server.listen(prod ? 443 : 3065 ,
 () => console.log(`Active on ${process.env.PORT}`))
