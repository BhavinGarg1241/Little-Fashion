const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index.route');
const authRoutes = require('./routes/auth.route');
const cartRoutes = require('./routes/cart.route');
const checkoutRoutes = require('./routes/checkout.route');
const profileRoutes = require('./routes/profile.route');
const adminRoutes = require('./routes/admin.route');
const paymentRoutes = require('./routes/payment.route');
const customerProfileRoutes = require('./routes/customerProfile.route');
const { autoUpdateTransactionStatus } = require('./Utils/autoUpdateTransactionStatus');
const app = express();
require('dotenv').config();
const flash = require('express-flash');
const passport = require('passport');
const { initializePassport } = require('./config/passport');
initializePassport();
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname + '/public')));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);
app.use('/payment', paymentRoutes);
app.use('/customer', customerProfileRoutes);

autoUpdateTransactionStatus.start();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})

module.exports = app;