module.exports = {
    conn: async () => {
        try{
            const mysql = require('mysql2/promise');
            const { DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME } = process.env;
            
            const connection = await mysql.createConnection({ 
                host: DATABASE_HOST,
                user: DATABASE_USER,
                password: DATABASE_PASS,
                database: DATABASE_NAME
            });
            return connection;
        }catch(er){
            console.log("DATABASE ERROR", er.message);
        }
    }

}