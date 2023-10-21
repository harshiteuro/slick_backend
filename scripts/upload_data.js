const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'changemeplease',
  database: 'slick_backend',
});

const fs = require('fs');
const { exit } = require('process');
const kopari_jsonData = JSON.parse(fs.readFileSync('../datasets/kopari_products.json'));
const mcaffeine_jsonData = JSON.parse(fs.readFileSync('../datasets/mcaffeine_products.json'));
const plum_jsonData = JSON.parse(fs.readFileSync('../datasets/plum_products.json'));
const yogabars_jsonData = JSON.parse(fs.readFileSync('../datasets/yogabars_products.json'));

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);

  executeQueries(kopari_jsonData,mcaffeine_jsonData,plum_jsonData,yogabars_jsonData)
 
    
});
async function executeQueries() {
    try {
        // Execute the SQL query to create the table
        kopari_createTableSQL= await getCreateDatabaseQuery(kopari_jsonData,'kopari_products');
        mcaffeine_createTableSQL=await getCreateDatabaseQuery(mcaffeine_jsonData,'mcaffeine_products');
        plum_createTableSQL=await getCreateDatabaseQuery(plum_jsonData,'plum_products');
        yogabars_createTableSQL=await getCreateDatabaseQuery(yogabars_jsonData,'yogabars_products');

        await executeQuery(kopari_createTableSQL,'kopari_products');
        await executeQuery(mcaffeine_createTableSQL,'mcaffeine_products');
        await executeQuery(plum_createTableSQL,'plum_products');
        await executeQuery(yogabars_createTableSQL,'yogabars_products');


        //insert the data
        await getInsertQuery(kopari_jsonData,'kopari_products');
        await getInsertQuery(mcaffeine_jsonData,'mcaffeine_products');
        await getInsertQuery(plum_jsonData,'plum_products');
        await getInsertQuery(yogabars_jsonData,'yogabars_products');
        console.log('success')
        connection.end()
    } catch (error) {
        console.error("Error:", error);
    }
}

async function executeQuery(createTableSQL,tableNameToCheck){
   // Check if the table already exists
   connection.query(`SHOW TABLES LIKE "${tableNameToCheck}"`, (err, results) => {
    if (err) {
        console.log(`Error checking if the table exists:${err}`);
        return{
            msg:`Error checking if the table exists:${err}`,
            status:true
        }
    } else if (results.length === 1) {
        console.log(`Table ${tableNameToCheck} already exists.`);
        return{
            msg:`Table ${tableNameToCheck} already exists.`,
            status:true
        }
    } else {
      // Execute the SQL query to create the table
      connection.query(createTableSQL, (err, results) => {
        if (err) {
            console.log(`Error creating table: ${err}`);
            return{
                msg:`Error creating table: ${err}`,
                status:true
            }
        } else {
          console.log(`Table ${tableNameToCheck} created successfully.`);
          return{
            msg:`Table ${tableNameToCheck} created successfully.`,
            status:true
          }
        }

        // Close the MySQL connection
        // connection.end();
      });
    }
  });
}

async function getCreateDatabaseQuery(json_data,table_name){
    const productsArray = json_data.products;
  
    // If you want to get all unique keys for all products, you can collect them in an array
    const allKeys = [...new Set(productsArray.flatMap(product => Object.keys(product)))];
    
    // console.log('All unique keys:', allKeys);
  
    const createTableSQL = `
    CREATE TABLE ${table_name} (
      ${allKeys.map(column => `${column} ${getColumnType(column)}`).join(',\n    ')}
    );
  `;
  
  // Helper function to determine the column data type
  function getColumnType(column) {
    // Define the data types for specific columns
    const dataTypes = {
      id: 'BIGINT',
      title: 'TEXT',
      handle: 'TEXT',
      body_html: 'TEXT',
      published_at: 'TIMESTAMP',
      created_at: 'TIMESTAMP',
      updated_at: 'TIMESTAMP',
      vendor: 'TEXT',
      product_type: 'TEXT',
      tags: 'TEXT',
      variants: 'JSON',
      images: 'JSON',
      options: 'JSON',
    };
  
    // Use the data type defined in the object, or use a default type if not found
    return dataTypes[column] || 'TEXT';
  }
  return createTableSQL;
}


async function getInsertQuery(json_data,table_name){
    const productsArray = json_data.products;
  
    // If you want to get all unique keys for all products, you can collect them in an array
    const allKeys = [...new Set(productsArray.flatMap(product => Object.keys(product)))];
    
    const insertStatements = productsArray.map(product => {
        const columns = allKeys.join(', ');
        const values = allKeys.map(key => {
          const value = product[key];
          if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`; // Wrap string values in single quotes
          }
          else if (typeof value === 'object') {
            return `'${JSON.stringify(value)}'`; // Convert objects to JSON strings and wrap them in single quotes
          }
          return value; // Keep non-string values as-is
        }).join(', ');
      
        return `INSERT INTO ${table_name} (${columns}) VALUES (${values});`;
      });
      
      for (const insertStatement of insertStatements) {
        connection.query(insertStatement, (err, results) => {
          if (err) {
            console.error('Error executing INSERT statement:', err);
          } else {
            console.log('INSERT statement executed successfully.');
          }
        });
      }
      // Now, insertStatements array contains the SQL INSERT statements for the data
      console.log('done')
}
