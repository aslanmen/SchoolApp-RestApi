const JWT = require('jsonwebtoken');

const generateAccessTokenManager = (user) => {
    return JWT.sign({ result: user }, process.env.JWT_KEY_MANAGER, { expiresIn: '2h' }); // Expires in 2 hours
}

const generateAccessTokenTeacher = (user) => {
    return JWT.sign({ result: user }, process.env.JWT_KEY_TEACHER, { expiresIn: '2h' }); // Expires in 2 hours
}

const generateAccessTokenStudent = (user) => {
    return JWT.sign({ result: user }, process.env.JWT_KEY_STUDENT, { expiresIn: '2h' }); // Expires in 2 hours
}

module.exports = {
    generateAccessTokenManager,
    generateAccessTokenTeacher,
    generateAccessTokenStudent
}
