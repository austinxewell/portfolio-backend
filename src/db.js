import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.NODE_ENV === 'production' 
        ? process.env.MYSQLHOST 
        : process.env.DB_HOST || 'localhost',
  port: process.env.NODE_ENV === 'production' 
        ? process.env.MYSQLPORT 
        : process.env.DB_PORT || 3306,
  user: process.env.NODE_ENV === 'production' 
        ? process.env.MYSQLUSER 
        : process.env.DB_USER || 'root',
  password: process.env.NODE_ENV === 'production' 
        ? process.env.MYSQLPASSWORD 
        : process.env.DB_PASSWORD || '',
  database: process.env.NODE_ENV === 'production' 
        ? process.env.MYSQLDATABASE 
        : process.env.DB_NAME || 'portfolio',
})

export default pool
