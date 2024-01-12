const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next) {
    var user = this;

    // isModified - mongoose 모듈 내장함수
    if(user.isModified('password')) {
        // 비밀번호 암호화 - Salt 이용
        bcrypt.genSalt(saltRounds, function (err, salt) {
            // 에러 경우 - save의 err 처리로 넘겨줌
            if(err) return next(err)

            //해시 처리
            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (plainPW, cb) {

    bcrypt.compare(plainPW, this.password, function (err, isMatch) {
        if(err) return cb(err)
      	cb(null, isMatch) // isMatch == true
    })
}

userSchema.methods.generateToken = function (callback) {
    var user = this;

    // jsonwebToken을 이용해서 token을 생성하기
    // user id를 넣어줘서 생성할 것 (데이터베이스의 id 부분)
    // 뒤엔 아무거나 넣어주면 됨
    // 나중에 토큰을 해석하면 userId가 나옴
    // 즉, 이 토큰을 가지고 이 사람이 누군지 알 수 있는 것
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // 만든 토큰을 userSchema의 token 필드에 넣어주자
    user.token = token;
    user.save(function (err, user) {
        if(err) return callback(err)
        callback(null, user);
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}