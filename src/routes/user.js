import express from "express";
import session from 'express-session';
import passport from "passport";
import { User } from "../modules/user.modules.js";

const router = express.Router();

router.get('/login', async(req, res) => {
    if (req.session.login) {
        res.redirect('/')
    } else {
        res.render('pages/login', {status: false})
    }
    
})

router.post('/login', passport.authenticate("login", { failureRedirect: "/loginError" }), async(req, res) => {
    const {username, password} = req.body;
    req.session.username = username;
    req.session.login = true;
    console.log('Login successful');
    res.redirect("/");
})

router.get('/', async(req, res) => {
    res.render('pages/form', {status: req.session.login, username: req.session.username})
})

router.get('/logout', async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.json(err);
        } else {
            res.render('pages/logout', {status: false});
        }
    })
})

router.get('/register', async(req, res) => {
    res.render('pages/register')
})

router.post('/register', passport.authenticate("register", {failureRedirect: "/registerError"}), async (req, res) => res.redirect("/"))

router.get('/registerError', async(req, res) => {
  res.render('pages/registerError')
})

router.get('/loginError', async(req, res) => {
  res.render('pages/loginError')
})

export default router;