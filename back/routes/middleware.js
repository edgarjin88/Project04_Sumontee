exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();  //error를 넣으며 바로 에러처리 미들웨어로 가고, 없으면 다음으로 간다. 즉, 로그인이 필요합니다 메시지가 나온다. 
  } else {
    res.status(401).send('You need to log in.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('You already logged in.');
  }
};
