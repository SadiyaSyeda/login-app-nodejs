var express=require('express');
var router=express.Router();
var User=require('../Models/User');
var passport=require('Passport');
var LocalStrategy=require('Passport-Local').Strategy;

//Register
router.get('/Register',function (req,res) {
    res.render('Register');
});

//Post
router.post('/Register',function (req,res) {
var name=req.body.Name;
console.log("Name is "+name);
var userName=req.body.Username;
var email=req.body.Email;
var password=req.body.Password;
var password2=req.body.Password2;

req.checkBody('Name','Name is required').notEmpty();
req.checkBody('Username','Username is required').notEmpty();
req.checkBody('Email','Email is required').notEmpty();
req.checkBody('Email','Email not valid').isEmail();
req.checkBody('Password','Password required').notEmpty();
req.checkBody('Password2','Passwords do not match').equals(req.body.Password);

var errors=req.validationErrors();

if(errors){
    console.log("Entered if "+errors);
    res.render('Register',{
        errors:errors
    });
return;
} else {
    console.log("Entered else");
    var newUser = new User({
        Username: userName,
        Email: email,
        Name: name,
        Password: password,
        Password2: password2
    });
    User.createUser(newUser, function (err, user) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(user);
    });
    console.log("User created");
    req.flash('success_msg', 'You are successfully registered');
    res.redirect('/Users/Login');
}
});

//Login

router.get('/Login',function (req,res) {
    res.render('Login');
});

passport.use(new LocalStrategy(
    function(username, password, done) {
User.getUserByUserName(username,function (err,user) {
if(err)
    throw err;
if(!user) {
    return done(null, false, {message: 'Unknown User'});
}
User.comparePassword(Password,user.Password,function (err,isMatch) {
    if(err)
        throw err;
    if(isMatch){
        return done(null,user);
    }
    else{
        return done(null,false,{message:'Password not matching'});
    }
    
})
})
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/Login',
    passport.authenticate('local',{successRedirect:'/',failureRedirect:'/Users/Login',failureFlash:true}),
    function(req, res) {
        res.redirect('/');
    });
module.exports=router;
