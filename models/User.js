const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

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

const User = mongoose.model('User', userSchema)

module.exports = {User}