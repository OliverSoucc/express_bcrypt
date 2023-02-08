const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Username cannot be blank'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password cannot be blank']
    }
});

userSchema.statics.findAndValidate = async function(username, password) {
    //when you log in we need to find user by username because we do not have ID, in real word make sure that the users have unique usernames
    const foundUser = await this.findOne({username});
    //here we compare password from form input and hashed and salt password from DB
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

//here the keyword this refers to particular object made by user model, so for example we can access the password of user like -> this.password
userSchema.pre('save', async function (next) {
    //this middleware will always be called when user is saved, even when he just wants to change username, so this if is here to prevent rehashing the password if password was not modified
    if (!this.isModified('password')) return next();
    //here we set the value of password of user from plain password from form to salted and hashed password (that was created based on the password he entered in form),
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', userSchema);