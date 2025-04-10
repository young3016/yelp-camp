const express = require('express');
const {storeReturnTo} = require('../middleware');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async(req, res, next) => {
    try{
    const {email, username, password} = req.body
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcom to 캠프장~');
        res.redirect('/campgrounds');
    })
    }catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
})

router.get('/login', (req, res) =>{
    res.render('users/login');
})

router.post('/login',storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
    req.flash('success', 'welcom!');
    const redirectUrl = res.locals.returnTo || 'campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "로그아웃 성공~!");
        res.redirect('/campgrounds');
    });
});

module.exports = router;  