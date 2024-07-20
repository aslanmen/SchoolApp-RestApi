const JWT = require('jsonwebtoken');
const { Student } = require('../models');

const studentAuth = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            success: -1,
            data: [],
            message: "Tekrar giriş yapınız"
        }) 
    }

    const currentUser = await Student.findOne({where: {accessToken: token}});

    if(currentUser) {
        JWT.verify(token, process.env.JWT_KEY_STUDENT, (err, user) => {

            if (err) {
                return res.status(401).json({
                    success: -1,
                    data: [],
                    message: "Tekrar giriş yapınız"
                })
            }

            req.student = user;
            next();

        });

    }
    else {
        return res.status(401).json({
            success: -1,
            data: [],
            message: "Tekrar giriş yapınız"
        }) 
    }

}

module.exports = studentAuth;