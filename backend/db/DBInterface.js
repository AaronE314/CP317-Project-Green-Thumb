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

}

/**
 * @desc Removes the plant from the database
 * @author Saad Ansari
 * @param {Number} plantID The primary key of the plant
 * @returns nothing
*/
function removePlant(plantID) {

}

/**
 * @desc Removes the user from the database
 * @author Saad Ansari
 * @param {Number} UserID The primary key of the user
 * @returns nothing
*/
function removeUser(UserID) {

}

/**
 * @desc Returns a number of most recent plant photos
 * @author Saad Ansari
 * @param {Number} plantID The primary key of the plant
 * @param {Number} startIndex The starting of the most recent count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

///////////////////////////Retrieval Functions////////////////////////////

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
