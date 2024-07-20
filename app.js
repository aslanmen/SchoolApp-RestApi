
const express = require('express');
const dotenv = require('dotenv');
const { Sequelize ,DataTypes} = require('sequelize');
const manager=require('./src/routes/manager')
const student=require('./src/routes/students')
const teacher=require('./src/routes/teachers')
const clas=require('./src/routes/clas')
const lesson=require('./src/routes/lesson')
dotenv.config();
const {syncModels}=require('./src/models/index')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//const port = process.env.PORT || 3000;


app.use('/',manager)
app.use('/',student)
app.use('/',teacher)
app.use('/',clas)
app.use('/',lesson)

// app.listen(port, () => {
//     console.log(`Sunucu ${port} portunda çalışıyor`);
// });


syncModels().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Unable to sync database:", err);
});

module.exports =app