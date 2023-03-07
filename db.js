const mysql = require('mysql2/promise')
require('dotenv').config()
const { RDS_HOST, RDS_USER, RDS_PASSWORD, RDS_PORT } = process.env

async function getConnection() {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    user: RDS_USER,
    database: 'Products',
    password: RDS_PASSWORD,
  })
  return connection
}

async function searchDB() {
  const connection = await getConnection()
  const sql = await connection.query('SELECT * FROM P_Products')
  connection.end()
  return sql[0]
}

async function insertDB(values) {
  const statement = `INSERT INTO P_Products (name, price, url, date, vendor) VALUES ${values}`
  const connection = await getConnection()
  const sql = await connection.query(statement)
  return sql
}

exports.searchDB = searchDB
exports.insertDB = insertDB 
