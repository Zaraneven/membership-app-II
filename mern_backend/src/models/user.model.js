import mongoose from "mongoose";
import crypto from 'crypto';

const UserShema = new mongoose.Schema({
    name: {
        type: String, trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: [ true, 'Email already exists!'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address!'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now
    },

    update: Date,
    hashed_password: {
        type: String,
        required: 'Password is required'
    },

    salt: String,
});

UserShema
    .virtual('password')
    .set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function(){return this._password});
UserShema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword : function (password) {
        if(!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            console.log(err);
            return '';
        }
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    }
}    

UserShema.path('hashed_password')
    .validate(function (v){
        if (this._password && this._password.length < 6) {
            this.invalidate('password', 'Password must be at least 6 characters.')
        }
        if (this.isNew && !this._password) {
            this.invalidate('password', 'password is required');
        }
    }, null);

    export default mongoose.model('User', UserShema);