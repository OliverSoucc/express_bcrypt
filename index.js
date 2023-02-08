
///////////
// this index.js file is for pure demostration of bcrypt package from npm and si completely separated from the rest of the code
//////////


//package from npm
const bcrypt = require('bcrypt');

const hashPassword = async (password) =>{
    //in this variable is stored our salt, in parameters is how long should it take to generate salt (12 is recommended minimum in bcrypt docs)
    // const salt = await bcrypt.genSalt(12);
    // const hash = await bcrypt.hash(password, salt);

    //faster way of creating salt and hash in one function
    const hash = await bcrypt.hash(password, 13)
    // console.log(salt);
    console.log(hash);
}

const login = async (pw, hashedPw) =>{
    const result = await bcrypt.compare(pw, hashedPw);
    if (result){
        console.log('Successfully logged in');
    }else {
        console.log('Incorrect');
    }
}

//hashPassword('monkey');

login('monkey', '$2b$12$5g.28zFxJKsrTAHGZXevpOycAT73QkpxEbvGgDI95mPnYR/yaxDD2')