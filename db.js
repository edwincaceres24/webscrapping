const mysql = require('mysql2')
require('dotenv').config()
const { RDS_HOST, RDS_USER, RDS_PASSWORD, RDS_PORT } = process.env

const connection = mysql.createPool({
  host: RDS_HOST,
  user: RDS_USER,
  database: 'Products',
  password: RDS_PASSWORD,
})

// const sql = connection.query(
//   'SELECT name,price FROM P_Products WHERE ID=?',
//   [1],
//   function (error, results, fields) {
//     if (error) throw error
//     console.table(results)
//   }
// )

const statement = 'INSERT INTO P_Products (name, price, url, date, vendor ?'
const sqlInsert = function (values) {
  connection.query(statement, [values], function (error, results, fields) {
    if (error) throw error
    console.table(results)
  })
}

// exports.sql = sql
exports.sqlInsert = sqlInsert
