// Imports
const express = require('express');

// Define app as Express object
const app = express();

// Function to execute when app is called
app.use((req, res, next) => {

    // Import MS SQL Server Dependency
    var sql = require("mssql");

    // Configuration for database
    var config = {
        user: 'greenthumbadmin',
        password: 'thumbgreen',
        server: 'greenthumbdb.cn0ybdo6z84o.us-east-2.rds.amazonaws.com',
        database: 'projectgreenthumb'
    };

    // Connect to database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // Query the database and get the records
        request.query('SELECT * from [user]', function (err, recordset) {
            if (err) console.log(err)

            // Send query results as a response
            // var firstName = JSON.stringify(recordset.recordset[0].firstName);
            // var lastName = JSON.stringify(recordset.recordset[0].lastName);
            
            //Send results
            res.send(recordset.recordset);
            res.end();
            sql.close();


        });
    });
});

module.exports = app;