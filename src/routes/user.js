import express from "express";
import session from 'express-session';

const router = express.Router();

router.get('/login', async(req, res) => {
    if (req.session.login) {
        res.redirect('/')
    } else {
        res.render('pages/login', {status: false})
    }
    
})

router.post('/login', async(req, res) => {
    const {user, pass} = req.body;
    // Ugly user and pass validation below:
    if (process.env.DUMMYUSER === user && process.env.DUMMYPASS === pass) {
        req.session.login=true;
        res.redirect('/')
    } else {
        req.session.login=false;
        res.redirect('/login')
    }
    
})

router.get('/', async(req, res) => {
    res.render('pages/form', {status: req.session.login})
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

export default router;