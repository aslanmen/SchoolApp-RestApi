// managerController.js


const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Manager} = require('../models')
const {generateAccessTokenManager}=require('../helpers/token')
const sendMail=require('../helpers/mailer')
exports.getAllManagers = (req, res) => {
    Manager.findAll()
        .then(managers => {
            res.status(200).json({ managers });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.signUp = (req, res) => {
    Manager.findOne({ where: { email: req.body.email } }).then(existingManager => {
        if (existingManager) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            var mailPassword=req.body.password
            req.body.password = hash;
            Manager.create(req.body)
                .then(newManager => {
                    const token = generateAccessTokenManager(newManager.id);
                    newManager.update({ accessToken: token }).then(() => {
                        const subject = 'Kayıt Onayı';
                        const text = `Merhaba ${newManager.name},\n\nKayıt işleminiz başarıyla tamamlandı!\n\nE-posta: ${newManager.email}\n\nŞifre: ${mailPassword}\n\nTeşekkürler,\nOkul Yönetimi`;
                        sendMail(newManager.email, subject, text);
                        res.status(201).json({ manager: newManager, token });
                    }).catch(err => {
                        res.status(500).json({ error: err.message });
                    });
                })
                .catch(err => {
                    if (err.name === 'SequelizeValidationError') {
                        const errors = err.errors.map(error => error.message);
                        res.status(400).json({ error: errors });
                    } else {
                        res.status(500).json({ error: err.message });
                    }
                });
        });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
};

exports.signIn = (req, res) => {
    const { email, password } = req.body;

    Manager.findOne({ where: { email } })
        .then(manager => {
            if (!manager) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            return bcrypt.compare(password, manager.password)
                .then(result => {
                    if (!result) {
                        return res.status(401).json({ message: 'Authentication failed' });
                    }

                    const token = generateAccessTokenManager(manager.id);

                    return Manager.update(
                        { accessToken: token },
                        { where: { id: manager.id } }
                    ).then(() => {
                        return Manager.findOne({
                            where: { id: manager.id },
                            attributes: { exclude: ['password'] }
                        });
                    }).then(updatedUser => {
                        res.status(200).json({
                            message: 'Auth successful',
                            user: updatedUser,
                            token: token
                        });
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
};


exports.getManagerById = (req, res) => {
    Manager.findByPk(req.params.id)
        .then(manager => {
            if (!manager) {
                return res.status(404).json({ error: 'Manager not found' });
            }
            res.status(200).json({ manager });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

exports.updateManager = (req, res) => {
    if (req.body.password) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            req.body.password = hash;
            Manager.update(req.body, { where: { id: req.params.id } })
                .then(affectedRows => {
                    if (affectedRows[0] === 0) {
                        return res.status(404).json({ error: 'Manager not found' });
                    }
                    res.status(200).json({ message: 'Manager updated successfully' });
                })
                .catch(err => {
                    res.status(500).json({ error: err.message });
                });
        });
    } else {
        Manager.update(req.body, { where: { id: req.params.id } })
            .then(affectedRows => {
                if (affectedRows[0] === 0) {
                    return res.status(404).json({ error: 'Manager not found' });
                }
                res.status(200).json({ message: 'Manager updated successfully' });
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    }
};

exports.deleteManager = (req, res) => {
    Manager.destroy({ where: { id: req.params.id } })
        .then(affectedRows => {
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Manager not found' });
            }
            res.status(200).json({ message: 'Manager deleted successfully' });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};
