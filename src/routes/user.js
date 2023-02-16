import express from "express";
import session from 'express-session';
import passport from "passport";

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

router.get('/info', (_req, res) => {
    let args = process.argv;
    let so = process.platform;
    let nodeVer = process.version;
    let rss = process.memoryUsage.rss();
    let execPath = process.execPath;
    let pId = process.pid;
    let folder = process.cwd();
    res.render("pages/info", {args, so, nodeVer, rss, execPath, pId, folder})
  })

export default router;