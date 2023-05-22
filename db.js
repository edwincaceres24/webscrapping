const mysql = require('mysql2/promise')
require('dotenv').config()
const { PS_HOST, PS_USER, PS_PASSWORD, PS_PORT, PS_DB } = process.env

async function getConnection() {
  const connection = await mysql.createConnection({
    host: PS_HOST,
    user: PS_USER,
    database: PS_DB,
    password: PS_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  })
  return connection
}

async function searchDB(query) {
  const connection = await getConnection()
  const sql = await connection.query(query)
  console.log('Connecting to DB')
  // console.log(sql[0])
  await connection.end()
  return sql[0]
}

async function insertDB(values) {
  const statement = `INSERT INTO P_Products (name, price, url, date, vendor) VALUES ${values}`
  const connection = await getConnection()
  const sql = await connection.query(statement)
  await connection.end()
  return sql
}

exports.searchDB = searchDB
exports.insertDB = insertDB
