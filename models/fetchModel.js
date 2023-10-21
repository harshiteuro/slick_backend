const mysql = require('mysql2');

function fetchModel(table_name, callback) {

  const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'changemeplease',
    database: 'slick_backend',
  });
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }

    console.log('Connected to the database as ID ' + connection.threadId);

    // Define your SQL query here
    const query = `SELECT * FROM ${table_name}`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ' + error);
        connection.end();
        callback(error, null); // Pass the error to the callback
        return;
      }

      // Close the database connection
      connection.end();

      // Process the results here (e.g., send them to the client)
      callback(null, results); // Pass the results to the callback
    });
  });
}

module.exports=fetchModel;