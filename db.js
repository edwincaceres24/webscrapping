const mysql = require('mysql2')
require('dotenv').config()
const { RDS_HOST, RDS_USER, RDS_PASSWORD, RDS_PORT } = process.env

const connection = mysql.createConnection({
  host: RDS_HOST,
  user: RDS_USER,
  database:'Products',
  password: RDS_PASSWORD
})

connection.query(
  'SELECT name,price FROM P_Products', 
  function (error, results, fields) {
    if (error) throw error;
    console.table(results)
});
 
