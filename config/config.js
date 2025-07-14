// config/config.js
const mysql = require('mysql2');







// const Pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'phdashboard',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   multipleStatements: true 
// });





const Pool = mysql.createPool({
    host: '68.178.145.55',
    user: 'CREDITKLICK_CRM',
    password: 'CREDITKLICK_CRM',
    database: 'CRM_IMS',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


Pool.promise().getConnection()
  .then(conn => {
    console.log('✅ MySQL Pool connected successfully');
    conn.release(); // release the connection back to pool
  })
  .catch(err => {
    console.error('❌ MySQL Pool connection failed:', err);
  });


module.exports = Pool;
