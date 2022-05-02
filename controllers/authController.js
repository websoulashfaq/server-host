import { User } from "../models/User.js";
import nodemailer from 'nodemailer';

//Login Router
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'form feids are required' })
    }

    try {
        //checking user Existed
        let user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(404).json({ success: false, error: 'Invalid Credentials' })
        }

        //compeare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Password is not match' })
        }
        sendToten(user, 200, res)

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internel server error' })
    }

}

//Register Router
export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(401).json({ success: false, error: 'form feids are required' })
    }
    try {
        const user = await User.create({
            fullname,
            email,
            password
        })
        sendToten(user, 200, res)
    } catch (error) {
        res.status(401).json({
            success: false,
            error: "Server Error or Duplicate Email"
        })
    }
}

//Home Page Router
export const privet = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Inavalid credentials' })
    }
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.fullname,
            email: req.user.email
        }
    })
}

export const sendOTPToMail = async (req, res) => {
    const sendingEmail = req.body.email;
    const data = await User.findOne({ email: sendingEmail });
    if (data) {
        var transpoter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD
            }
        });

        var mailOptions = {
            from: "ashfaqmohammedcv@gmail.com",
            to: sendingEmail,
            subject: 'Forgot Password Response',
            html: `<p>Your forgot password link :<a href="http://localhost:3000/reset-password/${data._id}" style="margin-left:5px; color:blue; fontSize:19px; font-weight:bold ;" >Go this link and Reset your Password</a> </p>`,
        };

        transpoter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("nodemailler error is :-", err)
            } else {
                res.status(200).json({ success: true, message: "Please check your email ID" })
            }
        })
    } else {
        res.status(404).json({ success: false, message: "Email ID not existed" })
    }
}

export const ResetPassword = async (req, res) => {
    let userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    user.password = req.body.newPassword;
    user.save();
    res.status(200).json({ success: true, message: 'Password cheanged successfully' })

}

const sendToten = (user, statusCode, res) => {
    const token = user.getJwtToken();
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.fullname,
            email: user.email,
        }
    })
}