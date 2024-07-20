const { Sequelize } = require('sequelize');
require('dotenv').config(); 


const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST } = process.env;


const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: 'postgres' 
});


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Veritabanı bağlantısı başarıyla sağlandı.');
  } catch (error) {
    console.error('Veritabanı bağlantısı sağlanamadı:', error);
  }
}


testConnection();

module.exports = sequelize;
