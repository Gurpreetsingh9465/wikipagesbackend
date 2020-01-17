const jwt = require('jsonwebtoken');
const sendMail = require('../../utils/sendMail');

exports.sendConfirmationMail = (userId, email) => {
    const token = jwt.sign({ _id: userId }, process.env.KEY);
    sendMail(email, 'Verify your account', process.env.SERVER_URL+'/api/verify?token='+token);
}

exports.validateUser = (user, password) => {
    if(user) {
        if(user.isGoogleLogin) {
            return [400, {error: 'you are already using google signin'}];
        }
        if(user.isVerified) {
            if(user.validPassword(password)) {
                return [200, {success: 'successfull'}];
            } else {
                return [400, {error: 'wrong password'}];
            }
        } else {
            return [400, {error: 'account not verified'}];
        }
    } else {
        return [404, {error: 'user not found'}]
    }
}