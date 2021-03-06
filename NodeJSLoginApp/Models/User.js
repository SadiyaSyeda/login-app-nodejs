var  mongoose=require('mongoose');
var bcrypt=require('bcryptjs');

var UserSchema=mongoose.Schema({
Username:{
    type:String,
    index:true
},
    Password:{
    type:String
    },
    Password2:{
        type:String
    },
    Name:{
    type:String
    },
    Email:{
    type:String
    }

});

var User=module.exports=mongoose.model('User',UserSchema);

module.exports.createUser=function (newUser,callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password=hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUserName=function (username,callback) {
    var query={Username:username};
    User.findOne(query,callback);
}

module.exports.getUserById=function (id,callback) {
    User.findById(id,callback);
}
module.exports.comparePassword=function (candidatePassword,hash,callback) {
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
        if(err)
            throw err;
        callback(null,isMatch);
    });
}