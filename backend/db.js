import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  multipleStatements: true, // allows multiple SQL statements in one query
};

// This function ensures database and tables exist
export async function initDB() {
  try {
    // Step 1: Connect without selecting a database first
    const connection = await mysql.createConnection(dbConfig);

    // Step 2: Create the database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS cropxpert;`);
    console.log("✅ Database 'cropxpert' checked/created.");

    // Step 3: Switch to cropxpert DB
    await connection.changeUser({ database: "cropxpert" });

    // Step 4: Create required tables if not exists
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        crop_name VARCHAR(100),
        disease VARCHAR(100),
        confidence DECIMAL(5,2),
        yield_kg DECIMAL(10,2),
        price_per_kg DECIMAL(10,2),
        profit DECIMAL(12,2),
        loss_percentage DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createTablesQuery);

    console.log("✅ Tables 'users' and 'crops' checked/created.");

    return connection;
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

