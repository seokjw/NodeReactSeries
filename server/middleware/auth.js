const { User } = require('../models/User');

let auth = (req, res, next) => {

    // 인증 처리를 하는 곳
    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    // 토큰을 복호화한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        // 유저가 있으면 인증 OK
        // 유저가 없으면 인증 NO
        req.token = token;
        req.user = user;
        next(); // 미들웨어이기 때문에 다음으로 넘어갈 수 있게 설정
    })
}

module.exports = { auth };