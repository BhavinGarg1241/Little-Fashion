const bcrypt = require('bcrypt');
const uuid = require('uuid');
const User = require('../models/userModel');
const userRoles = require('../models/roleModel');
const resetTokens = require('../models/resetTokenModel');
const passport = require('passport');
const { sendMail } = require('../services/email');
const { sendResetMail } = require('../services/resetPasswordEmail');
const { sendPasswordUpdateMail } = require('../services/passwordUpdateEmail')

//To get ser by email
const getUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
}
//To get user by id
const getUserById = async (id) => {
    return await User.findOne({
        where: { id },
        include: [{
            model: userRoles,
            where: { user_id: id }
        }]
    });
}
//To et User Role
const getUserRole = async (id) => {
    const role = await userRoles.findOne({ where: { user_id: id } });
    return role.role;
}

//To register user
const registerUser = async (req, res, done) => {
    try {
        const email = req.body.email;
        const existingUser = await getUserByEmail(email);
        //If user exists already then dont create new user and redirect signup page
        if (existingUser) {
            req.flash('error', 'User already exists.');
            res.redirect('/signup');1
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = await User.create({
                id: uuid.v4(),
                email,
                password: hashedPassword
            });
            await userRoles.create({
                user_id: newUser.id,
                role: 3
            })
            sendMail(newUser.email);
            //Authenticate after registeration to login automatically
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            })(req, res);
        }
    } catch (error) {
        console.log(error);
    }
}

//To authenticate user
const authenticateUser = async (email, password, done) => {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Invalid Email' })
        }
        if (user.status === false) {
            return done(null, false, { message: 'Your Account has been temporarily blocked by Admin!' })
        }
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid Password' })
        }
    } catch (error) {
        return done(error)
    }
}

//To change password
const changePassword = async (req, res) => {
    try {
        const loggedUser = await req.user;
        const userId = loggedUser.id;
        const userEmail = loggedUser.email;
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await User.update({
            password: hashedPassword
        }, {
            where: { id: userId }
        })
        sendPasswordUpdateMail(userEmail)
        return res.redirect('/profile')
    } catch (error) {
        console.log(error);
        res.redirect('/change_password');
    }
}

//To initiate reset password
const initiateResetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const existingUser = await getUserByEmail(email);
        //If user exists already then dont create new user and redirect signup page
        if (existingUser) {
            const token = uuid.v4();
            const existingToken = await resetTokens.findOne({
                where: {
                    user_id: existingUser.id
                }
            })
            if (existingToken) {
                await resetTokens.destroy({
                    where: { token: existingToken.token }
                })
            }
            await resetTokens.create({
                user_id: existingUser.id,
                token,
                expire_by: Date.now() + (1000 * 60 * 5) //5 minutes
            })
            sendResetMail(email, token);
            req.flash('error', 'Check your mail to reset password')
            return res.redirect('/login');
        }
        req.flash('error', 'User does not exists. Please create a new account.');
        return res.redirect('/signup');
        // return res.redirect('/login')    
    } catch (error) {
        console.log(error);
        res.redirect('/login');
    }
}

//To reset password
const resetPassword = async (req, res) => {
    try {
        const token = req.body.token;
        const newPassword = req.body.newPassword;
        const user = await resetTokens.findOne({ where: { token: token } });
        const userId = user.user_id;
        const email = await User.findOne({ where: { id: userId } }).then((email) => email.email);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update({
            password: hashedPassword
        }, {
            where: { id: userId }
        })
        await resetTokens.destroy({
            where: { token: token }
        })
        sendPasswordUpdateMail(email);
        req.flash('error', 'Successful Password Reset')
        return res.redirect('/login');
    } catch (error) {
        console.log(error);
        // res.redirect('/login');
    }
}

module.exports = { registerUser, authenticateUser, getUserById, getUserRole, changePassword, initiateResetPassword, resetPassword };