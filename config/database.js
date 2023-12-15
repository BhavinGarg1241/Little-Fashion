//Creating a connection with Database using sequelize ORM

const Sequelize = require('sequelize');
const sequelize = new Sequelize('little_fashion','root','',{
    host:'localhost',
    dialect:'mysql'
});
sequelize.authenticate().then(()=>{
    console.log('Database connection established');
}).catch(err => console.log(err));
module.exports = sequelize;