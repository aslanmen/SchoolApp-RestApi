
'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Manager extends Model {
    static associate(models) {
    }
  }

  Manager.init({
    accessToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    tel:{
      type: DataTypes.STRING,
      allowNull: false,
   
      validate: {
        isNumeric: true,
        len: [11, 11]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
   
  }, {
    sequelize,
    modelName: 'Manager',
  });

  return Manager;
};
