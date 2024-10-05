import mysql from 'mysql';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a MySQL connection using environment variables
export const db = mysql.createConnection({
  host: process.env.DB_HOST, // Your DB host from .env
  user: process.env.DB_USER, // Your DB user from .env
  password: process.env.DB_PASSWORD, // Your DB password from .env
  database: process.env.DB_NAME, // Your DB name from .env
  port: process.env.DB_PORT || 3306, // Port, default is 3306
});

// Test the connection
db.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database.');
  }
});
