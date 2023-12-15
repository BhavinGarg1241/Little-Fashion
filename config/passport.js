//Configuring passport for authentication purposes
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { authenticateUser, getUserById } = require('../controllers/authController');

const initializePassport = () => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
};

module.exports = { initializePassport };