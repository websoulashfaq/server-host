import mongoose from 'mongoose';
import bcrptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Creating Shcema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide email address"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email "
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        maxlength: 20,
        minlength: 8
    }
},
    { collection: "users" }
);

//converting password to bcrpt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrptjs.genSalt(10);
    this.password = await bcrptjs.hash(this.password, salt)
    next();
})

//compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrptjs.compare(password, this.password)
}

//Genarete JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

export const User = mongoose.model('User', userSchema);