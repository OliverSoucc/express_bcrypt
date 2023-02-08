const express = require('express');
const app = express();
const User = require('./models/user')
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const session = require('express-session')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'notagoodsecret', resave: false, saveUninitialized: true}));

//MONGO
main().catch(err => console.log('Mongo CANNOT START'));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/authDemo').then(() => {
        console.log('MONGO Connected')
    });
}
////////////////////////

//middleware to reduce code, in every API you can use this to protect routes that can only be access if you are signed in
const requireLogin = (req, res, next) =>{
    if (!req.session.user_id){
        res.redirect('/login');
    }
    next();
}

app.get('/',(req, res) => {
    res.send('This is the home page')
});

app.get('/register',(req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) =>{
    const {username, password} = req.body;
    //there is middleware in user model that salt and hash the password
    const user = new User({username, password});
    await user.save();
    //we expect that nothing wrong happens during creating a new user, so right after user is creating (hopefully), we set his Id in session cookie
    req.session.user_id = user._id
    res.redirect('/secret');
})

app.get('/login',(req, res) => {
    res.render('login')
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    //findAndValidate is function that we created, you can take look at it in user model
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser){
        //if user successfully sign in we store his Id in session
        req.session.user_id = foundUser._id
        res.redirect('/secret')
    }else{
        res.redirect('/login');
    }
});

app.post('/logout', (req, res) =>{
    //when you log out we set user_id in cookie to null, so you are no longer able to access the secret template
    req.session.user_id = null;
    //this is another option to destroy whole session, makes sense if you're storing more info about sign user
    // req.session.destroy();
    res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
    //if user id is in session cookie then show this template
    res.render('secret');
});

app.listen(3000, () => {
    console.log("ON PORT 3000");
});