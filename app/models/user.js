const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'invalid email format'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },

    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

//prehookk
userSchema.pre('save', function (next) {
    const user = this
    if (user.isNew) {
        bcryptjs.genSalt(10)
            .then(function (salt) {
                bcryptjs.hash(user.password, salt)
                    .then(function (encryptedpassword) {
                        user.password = encryptedpassword
                        next()
                    })
            })

    } else {
        next()
    }
})


userSchema.statics.findByCredentials = function (email, password) {
    const User = this
    return User.findOne({ email })
        .then(function (user) {
            if (!user) {
                return Promise.reject('invalid email/password')
            }
            return bcryptjs.compare(password, user.password)
                .then(function (result) {
                    if (result) {
                        return Promise.resolve(user)
                    } else {
                        return Promise.reject('invalid email/password')
                    }
                })
        })
        .catch(function (err) {
            return Promise.reject(err)
        })
}


userSchema.statics.findByToken=function(token){
    const User=this
    let tokenData
    try{
        tokenData=jwt.verify(token,'jwt@123')

    }catch(err){
        return Promise.reject(err)
    }
    return User.findOne({
         _id:tokenData._id,                // token: token._id,
        'tokens.token':token

    })


}


userSchema.methods.generateToken = function () {
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.firstName, //`${user.firstName} ${user.lastName}`,
        createdAt: Number(new Date())
    }

    const token = jwt.sign(tokenData, 'jwt@123')
    user.tokens.push({
        token    //concise property //or we can write it as token:token
    })

    return user.save()
        .then(function (user) {
            return Promise.resolve({token,user})
        })
        .catch(function (err) {
            return Promise.reject(err)
        })
}






const User = mongoose.model('User', userSchema)
module.exports = User