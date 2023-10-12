import mysql from 'mysql2/promise';

enum tableName {
    "users" = "users",
    "requests" = "requests",
    "products" = "products",
    "payment_status" = "payment_status",
}

async function dbConnect (): Promise<mysql.Connection> {
    const conn = await mysql.createConnection({
        uri: process.env.DATABASE_URL!,
        multipleStatements: true
    });
    try {
        conn.connect();
        console.log("Database connected!");

    } catch (error) {
        console.log(String(error));
    }

    return conn;
}

async function query(sql: string, values?: (string | number)[]) {
    const db = await dbConnect();
    const [rows] = await db.execute(sql, values);
    db.end();
        
    return rows;
}

export default { query, tableName };