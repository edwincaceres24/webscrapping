const mysql = require('mysql')
require('dotenv').config()
const { HOST, USER, PASSWORD, PORT } = process.env

const connection = mysql.createConnection({
  host: HOST || 'host',
  user: USER || 'root',
  password: PASSWORD || 'password',
  port: PORT || 'mydatabase',
})

connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();
