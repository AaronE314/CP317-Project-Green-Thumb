/**
 * @desc The Database Interface, used for all interaction with the GreenThumb Database
 * @author Saad Ansari
 * @author Luke Turnbull
 * @author Austin Bursey
 */

// Imports
var sql = require("mssql");


// Configuration for database
var config = {
    user: 'greenthumbadmin',
    password: 'thumbgreen',
    server: 'greenthumbdb.cn0ybdo6z84o.us-east-2.rds.amazonaws.com',
    database: 'projectgreenthumb'
};

///////////////////////////Removal Functions////////////////////////////
/**
 * @desc Removes the photo from the database
 * @author Saad Ansari
 * @param {Number} photoID The primary key of the photo
 * @returns nothing
*/
function removePhoto(photoID) {
    // Connect to database
    sql.connect(config, function (err) {
        if (err) { console.log(err); }

        var request = new sql.Request(); // create Request object
        var sqlQuery = 'DELETE FROM photo WHERE photo_id = ' + photoID; // Create SQL Query

        // Query the database and remove photo
        request.query(sqlQuery, function (err, recordset) {
            if (err) { console.log(err); }

            sql.close(); //Close connection
        });
    });
}

/**
 * @desc Removes the report from the database
 * @author Saad Ansari
 * @param {Number} photoReportID The primary key of the photoReport
 * @returns nothing
*/
function removePhotoReport(photoReportID) {
    // Connect to database
    sql.connect(config, function (err) {
        if (err) { console.log(err); }

        var request = new sql.Request(); // create Request object
        var sqlQuery = 'DELETE FROM report WHERE report_id = ' + photoReportID; // Create SQL Query

        // Query the database and remove photo
        request.query(sqlQuery, function (err, recordset) {
            if (err) { console.log(err); }

            sql.close(); //Close connection
        });
    });
}

/**
 * @desc Removes the plant and associated records from the database
 * @author Saad Ansari
 * @param {Number} plantID The primary key of the plant
 * @returns nothing
*/
function removePlant(plantID) {
    // Connect to database
    sql.connect(config, function (err) {
        if (err) { console.log(err); }

        var request = new sql.Request(); // create Request object
        var sqlQuery = // Create SQL Query
            // Delete all associated reports
            'DELETE FROM report WHERE' +
            '(SELECT pl.plant_id FROM plant pl ' +
            'JOIN photo ph ON ph.plant_id = pl.plant_id ' +
            ' JOIN post po ON ph.photo_id = po.photo_id ' +
            'JOIN report r ON r.post_id = po.post_id) = ' + plantID + ';' +

            // Delete all associated posts
            'DELETE FROM post WHERE ' +
            '(SELECT pl.plant_id FROM plant pl ' +
            'JOIN photo ph ON ph.plant_id = pl.plant_id ' +
            'JOIN post po ON ph.photo_id = po.photo_id) = ' + plantID + ';' +

            // Delete all associated photos
            'DELETE FROM photo WHERE plant_id = ' + plantID + ';' +

            // Delete the plant
            'DELETE FROM plant WHERE plant_id = ' + plantID + ';'

        // Query the database and remove plant
        request.query(sqlQuery, function (err, recordset) {
            if (err) { console.log(err); }

            sql.close(); //Close connection
        });
    });
}

/**
 * @desc Removes the user from the database
 * @author Saad Ansari
 * @param {Number} UserID The primary key of the user
 * @returns nothing
*/
function removeUser(UserID) {
    // Connect to database
    sql.connect(config, function (err) {
        if (err) { console.log(err); }

        var request = new sql.Request(); // create Request object
        var sqlQuery = // Create SQL Query
            // Delete all associated reports
            'DELETE FROM report WHERE ' +
            '(SELECT u.[user_id] FROM[user] u ' +
            'JOIN post po ON u.[user_id] = po.[user_id] ' +
            'JOIN report r ON r.post_id = po.post_id) = ' + userID + ';' +

            // Delete all associated posts
            'DELETE FROM post WHERE ' +
            '(SELECT u.[user_id] FROM[user] u ' +
            'JOIN post po ON u.[user_id] = po.[user_id]) = ' + userID + ';' +

            // Delete the user
            'DELETE FROM[user] WHERE[user_id] = ' + userID + ';'

        // Query the database and remove the user
        request.query(sqlQuery, function (err, recordset) {
            if (err) { console.log(err); }

            sql.close(); //Close connection
        });
    });
}

///////////////////////////Retrieval Functions////////////////////////////

/**
 * @desc Returns a number of most recent plant photos
 * @author Saad Ansari
 * @param {Number} plantID The primary key of the plant
 * @param {Number} startIndex The starting of the most recent count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/
function getNewestPlantPhotos(plantID, startIndex, max) {

    //return Photo[]
}

/**
 * @desc Returns a number of most recent photos uploaded by a user
 * @author Saad Ansari
 * @param {Number} userID The primary key of the user
 * @param {Number} startIndex The starting of the most recent count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

function getNewestUserPhotos(userID, startIndex, max) {

    //return Photo[]
}

/**
 * @desc Returns a number of the highest rated photos in the database
 * @author Saad Ansari
 * @param {Number} startIndex The starting of the most recent count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

function getTopPhotos(startIndex, max) {

    //return Photo[]
}

/**
 * @desc Returns an array of the top rated photos of a specific plant
 * @author Saad Ansari
 * @param {Number} startIndex The starting of the top count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

function getTopPlantPhotos(plantID, startIndex, max) {

    //return Photo[]
}
