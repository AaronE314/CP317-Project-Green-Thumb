/**
 * @desc The Database Interface, used for all interaction with the GreenThumb Database
 * @author Saad Ansari
 * @author Luke Turnbull
 * @author Austin Bursey
 * @author Nicolas Ross
 */

// Imports
var sql = require("mssql");
var Ban = require("../Ban.js");
var Photo = require("../Photo.js");
var PhotoReport = require("../PhotoReport.js");
var Plant = require("../Plant.js");
var Admin = require("../Admin.js");

// Configuration for database
var config = {
    user: 'greenthumbadmin',
    password: 'thumbgreen',
    server: 'greenthumbdb.cn0ybdo6z84o.us-east-2.rds.amazonaws.com',
    database: 'projectgreenthumb'
};
///////////////////////////Error Functions////////////////////////////
function DBIRecordNotFound(element) {
    const error = new Error(`The ${element} you are looking for is not in our records`);
    return error;
}
function DBIDuplicate(element) {
    const error = new Error(`The ${element} object you are attempting to save already exists.`);
    return error;
}
DBIDuplicate.prototype = Object.create(Error.prototype);
DBIRecordNotFound.prototype = Object.create(Error.prototype);
///////////////////////////Insertion Functions////////////////////////////
/**
 * @desc Add the ban to the database
 * @author Austin Bursey
 * @param {Number} Ban a Ban object.
 * @returns nothing
*/
async function addBan(ban) {
    let new_Ban = await getBan(ban.getId()).catch(function (err) { throw err });
    if (new_Ban != null) {
        throw new DBIDuplicate("Ban");
    }
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.Int, ban.getUserId());
            req.input('adminId', sql.Int, ban.getAdminId());
            req.input('expiration', sql.DateTime, ban.getExpirationDate());
            return await req.query("Insert into [ban] (userId, adminId, expiration) Values (@userId, @adminId, @expiration)")

                .then(function (recordset) {

                    ban = new Ban(recordset.recordset[0].ban_id, recordset.recordset[0].user_id, recordset.recordset[0].admin_id, recordset.recordset[0].expiration_date);
                    sql.close();
                    return ban;
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}
/**
 * @desc Add a Photo to the database
 * @author Austin Bursey
 * @param {Number} Photo a Photo object.
 * @returns nothing
*/
async function addPhoto(photo) {
    let new_photo = await getPhoto(photo.getId()).catch(function (err) { throw err });
    if (new_photo != null) {
        throw new DBIDuplicate("Photo");
    }
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input("plantId", sql.Int, photo.getPlantId());
            req.input("image", sql.Binary, photo.getImage());
            req.input("tfrecord", sql.VarChar, photo.getTfRecord());
            req.input("userId", sql.int, photo.getUserId());
            return await req.query(" insert into [post] (user_id , photo_id) values (@userId, (Select photo_id from [photo] where photo_id = SCOPE_IDENTITY()));")

                .then(function (recordset) {
                    sql.close();
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}
/**
 * @desc Add a PhotoReport to the database
 * @author Austin Bursey
 * @param {Number} pReport a PhotoReport object.
 * @returns nothing
*/
async function addPhotoReport(pReport) {
    let new_photoReport = await getPhotoReport(pReport.getId()).catch(function (err) { throw err });
    if (new_photoReport != null) {
        throw new DBIDuplicate("PhotoReport");
    }
    return await sql.connect(config)
        .then(async function () {
            req.input("photoId", sql.Int, pReport.getPhotoId());
            req.input("rDate", sql.Date, pReport.getReportDate());
            req.input("rText", sql.VarChar, pReport.getReportText());
            req.input("userId", sql.Int, pReport.getUserId());
            let req = new sql.Request();
            return await req.query("Insert into [report] (post_id, report_date , report_details) " +
                "Values((SELECT post_id from [post] where user_id = @userID AND photo_id = phoroID)" +
                ", @reportDate , @reportDetails); Insert into [admin_report] (report_id , admin_id , admin_action) " +
                "Values (SELECT report_id from [report] where report_id = SCOPE_IDENTITY(), @photoReport, @admin_Action)")

                .then(function (recordset) {
                    sql.close();

                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}
/**
 * @desc Add a Plant to the database
 * @author Austin Bursey
 * @param {Number} plant a Plant object.
 * @returns nothing
*/
async function addPlant(plant) {
    let new_plant = await getPlant(plant.getId()).catch(function (err) { throw err });
    if (new_plant != null) {
        throw new DBIDuplicate("Plant");
    }
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('plantName', sql.VarChar, plant.getName());
            req.input('plantBio', sql.VarChar, plant.getBio());
            req.input('plantId', sql.Int, plant.getId());
            return await req.query("Insert into [plant](plant_name , plant_bio) Values (@plantName, @plantBio) ")
                .then(function (recordset) {
                    sql.close();
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}
/**
 * @desc Add a User to the database
 * @author Austin Bursey
 * @param {Number} User a User object.
 * @returns nothing
*/
async function addUser(user) {
    let new_User = await getUser(user.getId()).catch(function (err) { throw err });
    if (new_User != null) {
        throw new DBIDuplicate("User");
    }
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.Int, user.getId());
            return await req.query("SELECT userID from [projectgreenthumb].[dbo].[user] where user_id = @userId;  Insert into [user] DEFAULT VALUES  ")
                .then(function (recordset) {
                    sql.close();
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}


/**
 * @desc Add an Admin to the database
 * @author Saad Ansari
 * @param {Admin} Admin an Admin object.
 * @returns nothing
*/
async function addAdmin(Admin) {
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();

            return await req.query("Insert into [admin] DEFAULT VALUES  ")
                .then(function (recordset) {
                    sql.close();
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

///////////////////////////Removal Functions////////////////////////////
/**
 * @desc Removes the photo from the database
 * @author Saad Ansari
 * @param {Number} photoID The primary key of the photo
 * @returns nothing
*/
async function removePhoto(photoID) {
    // Connect to database
    sql.connect(config, function (err) {
        if (err) { console.log(err); }

        var request = new sql.Request(); // create Request object
        req.input('photoId', sql.Int, photoID);
        var sqlQuery = 'DELETE FROM photo WHERE photo_id = photoId'; // Create SQL Query

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
async function removePhotoReport(photoReportID) {
    // Connect to database
    sql.connect(config, function (err) {
        if (err) { console.log(err); }

        var request = new sql.Request(); // create Request object
        req.input('photoReportId', sql.Int, photoReportID);
        var sqlQuery = 'DELETE FROM report WHERE report_id = photoReportId'; // Create SQL Query

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
async function removePlant(plantID) {
    // Connect to database
    sql.connect(config, function (err) {
        if (err) { console.log(err); }

        var request = new sql.Request(); // create Request object
        req.input('plantId', sql.Int, plantID);
        var sqlQuery = // Create SQL Query
            // Delete all associated reports
            'DELETE FROM report WHERE' +
            '(SELECT pl.plant_id FROM plant pl ' +
            'JOIN photo ph ON ph.plant_id = pl.plant_id ' +
            ' JOIN post po ON ph.photo_id = po.photo_id ' +
            'JOIN report r ON r.post_id = po.post_id) = plantId;' +

            // Delete all associated posts
            'DELETE FROM post WHERE ' +
            '(SELECT pl.plant_id FROM plant pl ' +
            'JOIN photo ph ON ph.plant_id = pl.plant_id ' +
            'JOIN post po ON ph.photo_id = po.photo_id) = plantId;' +

            // Delete all associated photos
            'DELETE FROM photo WHERE plant_id = plantId;' +

            // Delete all assocaited votes
            'DELETE FROM voting WHERE ' +
            '(SELECT pl.[plant_id] FROM plant pl ' +
            'JOIN photo ph ON ph.plant_id = pl.plant_id ' +
            'JOIN voting v ON v.photo_id = ph.photo_id) = plantId;' +

            // Delete the plant
            'DELETE FROM plant WHERE plant_id = plantId;'

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
async function removeUser(UserID) {
    // Connect to database
    sql.connect(config, function (err) {
        if (err) { console.log(err); }

        var request = new sql.Request(); // create Request object
        req.input('userId', sql.Int, userID);
        var sqlQuery = // Create SQL Query
            // Delete all associated reports
            'DELETE FROM report WHERE ' +
            '(SELECT u.[user_id] FROM[user] u ' +
            'JOIN post po ON u.[user_id] = po.[user_id] ' +
            'JOIN report r ON r.post_id = po.post_id) = userId;' +

            // Delete all associated posts
            'DELETE FROM post WHERE ' +
            '(SELECT u.[user_id] FROM[user] u ' +
            'JOIN post po ON u.[user_id] = po.[user_id]) = userId;' +

            // Delete all assocaited votes
            'DELETE FROM voting WHERE ' +
            '(SELECT[user_id] FROM voting) = userId;' +

            // Delete the user
            'DELETE FROM[user] WHERE[user_id] = userId;'

        // Query the database and remove the user
        request.query(sqlQuery, function (err, recordset) {
            if (err) { console.log(err); }

            sql.close(); //Close connection
        });
    });
}

///////////////////////////Retrieval Functions////////////////////////////
/**
 * @desc Returns a Ban object from the Database
 * @author Austin Bursey
 * @param {Int} BanId The primary key of the Ban table
 * @returns {result} A Ban object
*/

async function getBan(banID) {
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('banId', sql.Int, banID);
            return await req.query("Select * from [projectgreenthumb].[dbo].[plant] where ban_id = @banId ")
                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        ban = new Ban(recordset.recordset[0].ban_id, recordset.recordset[0].user_id, recordset.recordset[0].admin_id, recordset.recordset[0].expiration_date);
                        sql.close();
                        return ban;
                    } else {
                        throw new DBIRecordNotFound("banId");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}
/**
 * @desc Returns a Photo object from the Database
 * @author Austin Bursey
 * @param {Number} photoId The primary key of the Photo table
 * @returns {photo} A Photo object
*/

async function getPhoto(photoId) {

    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('photoId', sql.Int, photoId);
            return await req.query("SELECT PHOTO.photo_id, plant_id, image , tf_record , post_id , user_id , upload_date FROM [projectgreenthumb].[dbo].[photo] INNER JOIN [projectgreenthumb].[dbo].[post] ON (post.photo_id = photo.photo_id)  where photo.photo_id = @photoId;            ")
                .then(function (recordset) {
                    if (recordset.recordset[0] !== null) {
                        photo = new Photo(recordset.recordset[0].photo_id, recordset.recordset[0].plant_id, recordset.recordset[0].user_id, recordset.recordset[0].image, recordset.recordset[0].upload_date, async function () {
                            req.input('photoId', sql.Int, photoId);
                            return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where photo_id = @photoId and vote = 1 ").then(function (recordset) {
                                return recordset.recordset;
                            }).catch(function (err) {
                                console.log(err);
                            })
                        }, async function () {
                            req.input('photoId', sql.Int, photoId);
                            return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where photo_id = @photoId and vote = 0").then(function (recordset) {
                                return recordset.recordset;
                            }).catch(function (err) {
                                console.log(err);
                            })
                        });

                        sql.close();
                        return photo;
                    } else {
                        throw new DBIRecordNotFound("photoId");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

/**
 * @desc Returns a PhotoReport object from the Database
 * @author Nicolas Ross
 * @param {Number} photoReportId The primary key of the PhotoReport table
 * @returns {photoReport} A PhotoReport object
 */

async function getPhotoReport(photoReportId) {
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('photoReportId', sql.Int, photoReportId);
            return await req.query("SELECT * FROM [projectgreenthumb].[dbo].[report] INNER JOIN [projectgreenthumb].[dbo].[post] ON (post.post_id = report.post_id) where report.report_id = @photoReportId;")
                .then(function (recordset) {
                    report = new PhotoReport(recordset.recordset[0].report_id, recordset.recordset[0].photo_id, recordset.recordset[0].user_id, recordset.recordset[0].report_details, recordset.recordset[0].report_date);
                    sql.close();
                    return report;

                }).catch(function (err) {
                    console.log(err);
                });

        }).catch(function (err) {
            console.log(err);
        });
}

/**
 * @desc [WORK IN PROGRESS] Returns a PhotoReport array from the Database
 * @author Nicolas Ross
 * @param {Number} adminId The primary key of the PhotoReport table
 * @returns {photoReport} A report array
 */

async function getPhotoReportsByAdmin(adminId) {
    reports = [];
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('adminId', sql.Int, adminId);
            return await req.query("SELECT * FROM [projectgreenthumb].[dbo].[admin_report] INNER JOIN [projectgreenthumb].[dbo].[report] ON (report.report_id = admin_report.report_id) where admin_report.admin_id = @adminId;")
                .then(function (recordset) {
                    ind = 0;
                    while (recordset[ind] != null) {
                        reports.push(PhotoReport(recordset.recordset[ind].report_id, async function () {
                            req.input('postId', sql.Int, recordset[ind].post_id);
                            return await req.query("SELECT photo_id FROM [projectgreenthumb].[dbo].[post] where post.post_id = @postId").then(function (recordset) {
                                return recordset;

                            }).catch(function (err) {
                                console.log(err);
                            })
                        }, async function () {
                            req.input('postId', sql.Int, recordset[ind].post_id);
                            return await req.query("SELECT user_id FROM [projectgreenthumb].[dbo].[post] where post.post_id = @postId").then(function (recordset) {
                                return recordset;

                            }).catch(function (err) {
                                console.log(err);
                            })

                        }, recordset.recordset[ind].report_details, recordset.recordset[ind].report_date));
                        ind = ind + 1;
                    }
                    sql.close();

                }).catch(function (err) {
                    console.log(err);
                });

        }).catch(function (err) {
            console.log(err);
        });

    return reports;
}

/**
 * @desc Returns a Plant object from the Database
 * @author Austin Bursey
 * @param {Number} plantId The primary key of the Plant table
 * @returns {plant} A Plant object
*/

async function getPlant(plantID) {
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('plantId', sql.Int, plantID);
            return await req.query("SELECT * FROM [projectgreenthumb].[dbo].[plant] where plant_id = @plantId;")
                .then(function (recordset) {
                    plant = new Plant(recordset.recordset[0].plant_id, recordset.recordset[0].plant_name, recordset.recordset[0].plant_bio);
                    sql.close();
                    return plant;
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });

}
/**
 * @desc Returns an array of most recent plant photos
 * @author Saad Ansari
 * @param {Number} plantID The primary key of the plant
 * @param {Number} startIndex The starting of the most recent count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

async function getNewestPlantPhotos(plantID, startIndex, max) {
    photos = [];
    await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('plantId', sql.Int, plantId);
            sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ' +
                'ph.tf_record, po.post_id, po.[user_id], po.upload_date ' +
                'FROM photo ph ' +
                'LEFT OUTER JOIN post po ON po.photo_id = ph.photo_id ' +
                'WHERE ph.plant_id = @plantId ORDER BY po.upload_date DESC'
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                if (recordset.recordset[0] == null) {
                    while (recordset[ind] != null) {
                        photos.push(Photo(recordset.recordset[ind].photo_id, recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image, recordset.recordset[ind].upload_date, async function () {
                            req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                            return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 1 ").then(function (recordset) {
                                return recordset;
                            }).catch(function (err) {
                                console.log(err);
                            })
                        }, async function () {
                            req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                            return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 0").then(function (recordset) {
                                return recordset;
                            }).catch(function (err) {
                                console.log(err);
                            })
                        }));
                        ind = ind + 1;
                    }
                    sql.close();
                } else {
                    sql.close();
                    throw new DBIRecordNotFound("plant photos");

                }
            })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
    return photos.slice(startIndex, startIndex + max);
}

/**
 * @desc Returns a number of most recent photos uploaded by a user
 * @author Saad Ansari
 * @param {Number} userID The primary key of the user
 * @param {Number} startIndex The starting of the most recent count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

async function getNewestUserPhotos(userID, startIndex, max) {
    photos = [];
    await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.Int, userId);
            sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ' +
                'ph.tf_record, po.post_id, po.[user_id], po.upload_date ' +
                'FROM photo ph ' +
                'LEFT OUTER JOIN post po ON po.photo_id = ph.photo_id ' +
                'WHERE po.[user_id] = @userId ORDER BY po.upload_date DESC'
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                while (recordset[ind] != null) {
                    photos.push(Photo(recordset.recordset[ind].photo_id, recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image, recordset.recordset[ind].upload_date, async function () {
                        req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                        return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 1 ").then(function (recordset) {
                            return recordset;
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }, async function () {
                        req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                        return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 0").then(function (recordset) {
                            return recordset;
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }));
                    ind = ind + 1;
                }
                sql.close();
            })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
    return photos.slice(startIndex, startIndex + max);
}

/**
 * @desc Returns a number of the highest rated photos in the database
 * @author Saad Ansari
 * @param {Number} startIndex The starting of the most recent count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

async function getTopPhotos(startIndex, max) {
    photos = [];
    await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            // Potentially req.input('startindex', sql.Int, startIndex);
            // Potentially req.input('count', sql.Int, max);
            sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ' +
                'ph.tf_record, po.post_id, po.[user_id], po.upload_date ' +
                ', SUM(v.vote) FROM photo ph ' +
                'LEFT OUTER JOIN post po ON po.photo_id = ph.photo_id ' +
                'LEFT OUTER JOIN voting v ON v.photo_id = ph.photo_id' +
                'GROUP BY ph.photo_id, ph.plant_id, ph.[image], ' +
                'ph.tf_record, po.post_id, po.[user_id], po.upload_date ' +
                'ORDER BY SUM(v.vote) DESC'
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                while (recordset[ind] != null) {
                    photos.push(Photo(recordset.recordset[ind].photo_id, recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image, recordset.recordset[ind].upload_date, async function () {
                        req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                        return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 1 ").then(function (recordset) {
                            return recordset;
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }, async function () {
                        req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                        return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 0").then(function (recordset) {
                            return recordset;
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }));
                    ind = ind + 1;
                }
                sql.close();
            })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
    return photos.slice(startIndex, startIndex + max);
}

/**
 * @desc Returns an array of the top rated photos of a specific plant
 * @author Saad Ansari
 * @param {Number} startIndex The starting of the top count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

async function getTopPlantPhotos(plantID, startIndex, max) {
    photos = [];
    await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('plantId', sql.Int, plantId);
            sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id ' +
                ', po.[user_id], po.upload_date, SUM(v.vote) FROM photo ph ' +
                'LEFT OUTER JOIN post po ON po.photo_id = ph.photo_id ' +
                'LEFT OUTER JOIN voting v ON v.photo_id = ph.photo_id ' +
                'WHERE ph.plant_id = @plantTopId ' +
                'GROUP BY ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, ' +
                'po.[user_id], po.upload_date ORDER BY SUM(v.vote) DESC'
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                while (recordset[ind] != null) {
                    photos.push(Photo(recordset.recordset[ind].photo_id, recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image, recordset.recordset[ind].upload_date, async function () {
                        req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                        return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 1 ").then(function (recordset) {
                            return recordset;
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }, async function () {
                        req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                        return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 0").then(function (recordset) {
                            return recordset;
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }));
                    ind = ind + 1;
                }
                sql.close();
            })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
    return photos.slice(startIndex, startIndex + max);
}

/**
 * @desc Returns an array of the top rated photos of a specific user
 * @author Luke Turnbull
 * @param {Number} startIndex The starting of the top count
 * @param {Number} max The maximum number of photos to return
 * @returns {Photo[]} An array of photo objects
*/

function getTopUserPhotos(userID, startIndex, max) {
    var photos = [];
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('userId', sql.Int, userID);
            sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id ' +
                ', po.[user_id], po.upload_date, SUM(v.vote) FROM photo ph ' +
                'LEFT OUTER JOIN post po ON po.photo_id = ph.photo_id ' +
                'LEFT OUTER JOIN voting v ON v.photo_id = ph.photo_id ' +
                'WHERE po.user_id = @userId ' +
                'GROUP BY ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, ' +
                'po.[user_id], po.upload_date ORDER BY SUM(v.vote) DESC'
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                while (recordset.recordset[ind] != null) {
                    photos.push(new Photo(recordset.recordset[ind].photo_id, recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image, recordset.recordset[ind].upload_date, async function () {
                        req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                        return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 1 ").then(function (recordset) {
                            return recordset;
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }, async function () {
                        req.input('photoId', sql.Int, recordset.recordset[ind].photo_id);
                        return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where voting.photo_id = @photoId and vote = 0").then(function (recordset) {
                            return recordset;
                        }).catch(function (err) {
                            console.log(err);
                        })
                    }));
                    ind = ind + 1;
                }
                sql.close();
                return photos.slice(startIndex, startIndex + max);
            })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

/**
 * @desc Returns an array of photo reports by priority
 * @author Luke Turnbull
 * @param {Number} startIndex The starting of the top count
 * @param {Number} max The maximum number of photoReports to return
 * @returns {Photo[]} An array of photoReport objects
*/

function getUnhandeledPhotoReportsByPriority(startIndex, max) {
    var photoReports = [];
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            sqlQuery = 'SELECT r.report_id,r.report_date, r.report_details,p.photo_id,p.user_id FROM report r' +
                'LEFT OUTER JOIN post p ON p.post_id = r.post_id' +
                'GROUP BY r.report_id,r.report_date, r.report_details,p.photo_id,p.user_id ORDER BY SUM(r.post_id)';
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                while (recordset.recordset[ind] != null) {
                    photoReports.push(new PhotoReport(recordset.recordset[ind].report_id, recordset.recordset[ind].photo_id, recordset.recordset[ind].user_id, recordset.recordset[ind].report_details, recordset.recordset[ind].report_date));
                    ind = ind + 1;
                }
                sql.close();
                return photoReports.slice(startIndex, startIndex + max);
            })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}


/**
 * @desc Returns an array of photo reports by Date
 * @author Luke Turnbull
 * @param {Number} startIndex The starting of the top count
 * @param {Number} max The maximum number of photoReports to return
 * @returns {Photo[]} An array of photoReport objects
*/

function getUnhandeledPhotoReportsByDate(startIndex, max) {
    var photoReports = [];
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            sqlQuery = 'SELECT r.report_id,r.report_date, r.report_details,p.photo_id,p.user_id FROM report r' +
                'LEFT OUTER JOIN post p ON p.post_id = r.post_id' +
                'GROUP BY r.report_id,r.report_date, r.report_details,p.photo_id,p.user_id ORDER BY r.upload_date';
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                while (recordset.recordset[ind] != null) {
                    photoReports.push(new PhotoReport(recordset.recordset[ind].report_id, recordset.recordset[ind].photo_id, recordset.recordset[ind].user_id, recordset.recordset[ind].report_details, recordset.recordset[ind].report_date));
                    ind = ind + 1;
                }
                sql.close();
                return photoReports.slice(startIndex, startIndex + max);
            })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

/**
 * @desc Returns a User object from the Database
 * @author Luke Turnbull
 * @param {Number} userId The primary key of the User table
 * @returns {user} A User object
*/

async function getUser(userId) {

    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.Int, userId);
            return await req.query("SELECT user_id FROM [projectgreenthumb].[dbo].[user] where user.user_id = userId ")
                .then(function (recordset) {
                    if (recordset.recordset[0] !== null) {
                        user = new User(recordset.recordset[0].user_id, async function () {
                            req.input('userId', sql.Int, userId);
                            return await req.query("Select user_id from [projectgreenthumb].[dbo].[ban] where ban.user_id = @userId").then(function (recordset) {
                                return recordset;
                            }).catch(function (err) {
                                console.log(err);
                            })
                        });

                        sql.close();
                        return user;
                    } else {
                        throw new DBIRecordNotFound("userId");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

///////////////////////////Update Functions////////////////////////////

/**
 * @desc Updates a photo object in database
 * @author Luke Turnbull
 * @param {Number} Photo 
 * @returns nothing
*/

function updatePhoto(photo) {
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('plantId', sql.Int, photo.getPlantId());
            req.input('image', sql.VarChar, photo.getImage());
            req.input('tf_record', sql.VarChar, photo.getTfRecord());
            return await req.query("UPDATE [photo] SET [plant_id] = @plantId, [image] = @image, [tf_record] = @tfrecord")
                .then(function (recordset) {
                    return user;
                    sql.close();
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

/**
 * @desc Update a Photo Report object in database
 * @author Luke Turnbull
 * @param {Number} PhotoReport
 * @returns nothing
*/
function updatePhotoReport(pReport) {
    return await sql.connect(config)
        .then(async function () {
            req.input("reportId", sql.Int, pReport.getPhotoId());
            req.input("rDate", sql.Date, pReport.getReportDate());
            req.input("rText", sql.VarChar, pReport.getReportText());
            let req = new sql.Request();
            return await req.query("UPDATE [report] SET report_date = @rDate, report_details = rText WHERE report_id = @reportId")
                .then(function (recordset) {
                    sql.close();

                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

/**
 * @desc Update a Plant object in database
 * @author Luke Turnbull
 * @param {Number} Plant
 * @returns nothing
*/
function updatePlant(plant) {
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('plantName', sql.VarChar, plant.getName());
            req.input('plantBio', sql.VarChar, plant.getBio());
            return await req.query("UPDATE [plant] SET [plant_name] = @plantName, plant_bio = @plantBio ")
                .then(function (recordset) {
                    sql.close();
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

module.exports = {
    addBan, addPhoto, addPhotoReport, addPlant, addUser, addAdmin,
    removePhoto, removePhotoReport, removePlant, removeUser,
    getBan, getPhoto, getPhotoReport, getPlant, getPhotoReportsByAdmin,
    getNewestPlantPhotos, getNewestUserPhotos, getTopPhotos, getTopPlantPhotos,
    getTopUserPhotos, getUnhandeledPhotoReportsByDate, getUnhandeledPhotoReportsByPriority,
    getUser, updatePlant, updatePhoto, updatePhotoReport
}