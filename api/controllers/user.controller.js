const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const {validationResult} = require('express-validator');
const config = require('config');
const jwtsecret = config.get('jwtsecret');
const dotenv = require('dotenv');
dotenv.config();

console.log('api-key', process.env.SENDGRID_API_KEY);

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    //check if the user is already in the date base
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('email already exists');

    const usernameExist = await User.findOne({username: req.body.username});
    if (usernameExist) return res.status(400).send('username already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user 
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
    });
    try {
        const savedUser = await user.save();
        return res.send({
            "status": "success",
            "data": savedUser
        });
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.updateProfile = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    //check if the user is already in the date base
    await User.findOne({_id: req.body._id}, function (err, results) {
        if (err)
            return res.status(400).send('user does not exists');
    });

    //Hash passwords
    // const salt = await bcrypt.genSalt(10);
    // const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new User({
        _id: req.body._id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
    });

    try {
        const savedUser = await User.findByIdAndUpdate(req.body._id, user);

        return res.send({
            "status": "success",
            "data": savedUser
        });
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.login = async function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    //check if the user is already in the date base
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('email does not exists');

    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({msg: 'Invalid password'});

    //create and assign a token 
    const token = jwt.sign({_id: user._id}, jwtsecret);
    return res.send({
        "status": "success",
        "data": token
    })
};

exports.forgotPassword = async function (req, res) {

    console.log('api-key', process.env.SENDGRID_API_KEY);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const email = req.body.email;

    const checkemail = await User.findOne({email: email});

    console.log('checkemail', checkemail);

    if (checkemail) {

        const token = jwt.sign({_id: checkemail._id}, jwtsecret)
        var link = 'https://falcons-event-management.herokuapp.com/resetpassword/' + token;
        const msg = {
            to: checkemail.email,
            from: config.get('myEmail'),
            subject: 'Reset Password Link',
            html: `<strong>Please click this link to reset your password: ${link}</strong>`
        };

        (async () => {
            try {
                console.log('msg',msg)
                await sgMail.send(msg);
                return res.send('Mail sent successfully!')
            } catch (err) {
                console.error(err.toString());
            }
        })();
    } else {
        return res.send('Error: No user exists on this email');
    }
};

exports.resetPassword = async function (req, res) {
    const token = req.params.token;
    const newPassword = req.body.newPassword;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    const decoded = jwt.verify(token, config.get('jwtsecret'));

    const userId = decoded._id;

    const userdata = await User.findOne({_id: userId});

    userdata.password = hashPassword;
    userdata.save(function (err, data) {
        if (err) {
            return res.status(500).send({Error: err});
        } else {
            return res.send('Your password has been reset successfully!');
        }
    })
};

exports.updatePassword = async function (req, res) {
    const userId = req.user;

    const newPassword = req.body.newPassword;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    const userdata = await User.findOne({_id: userId});

    userdata.password = hashPassword;
    userdata.save(function (err, data) {
        if (err) {
            return res.status(500).send({message: err});
        } else {
            return res.send({message: 'Your password has been updated successfully!'});
        }
    });
};

exports.getUser = async function (req, res) {
    const token = req.params.token;

    const decoded = jwt.verify(token, config.get('jwtsecret'));

    const userId = decoded._id;

    const userdata = await User.findOne({_id: userId});

    if (userdata) {
        return res.json(userdata);
    } else {
        return res.status(500).send({Error: err});
    }
};
