/**
 * @desc The Database Interface, used for all interaction with the GreenThumb Database
 * @author Saad Ansari
 * @author Saje Bailey
 * @author Austin Bursey
 * @author Nicolas Ross
 * @author Luke Turnbull
 */

// Imports
const sql = require("mssql");

const Admin = require("../Admin.js");
const Ban = require("../Ban.js");
const Photo = require("../Photo.js");
const PhotoReport = require("../PhotoReport.js");
const Plant = require("../Plant.js");
const User = require("../User.js");

// Configuration for database
const config = {
    user: 'greenthumbadmin',
    password: 'thumbgreen',
    server: 'greenthumbdb.cn0ybdo6z84o.us-east-2.rds.amazonaws.com',
    database: 'projectgreenthumb'
};

///////////////////////////Error Functions////////////////////////////
function DBIRecordNotFound(element) {
    const error = new Error(`The ${element} you are looking for cannot be found in our records`);
    return error;
}

function DBIDuplicate(element) {
    const error = new Error(`The ${element} object(s) you are attempting to save already exist(s).`);
    return error;
}
DBIDuplicate.prototype = Object.create(Error.prototype);
DBIRecordNotFound.prototype = Object.create(Error.prototype);

///////////////////////////Helper Functions////////////////////////////
/**
 * @desc Checks if the Ban exists under another ID.
 * @author Austin Bursey
 * @param {Ban} ban a Ban object.
 * @returns true iff the object exists. 
*/
async function ban_exists(ban) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.VarChar, ban.getuserId());
            req.input('adminId', sql.VarChar, ban.getAdminId());
            req.input('exp', sql.Date, ban.getExpirationDate());
            return await req.query("Select * from [projectgreenthumb].[dbo].[ban] where user_id = @userId AND admin_id = @adminId AND expiration_date = @exp")

                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Checks if the Photo exists under another ID.
 * @author Austin Bursey
 * @param {Photo} photo A Photo.
 * @returns True iff the object exists.
*/
async function photo_exists(photo) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('plantId', sql.Int, photo.getPlantId());
            req.input('img', sql.Int, photo.getImage());
            return await req.query("Select * from [projectgreenthumb].[dbo].[photo] where plant_id = @plantId AND image = @img")

                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Checks if the Photo exists under another ID.
 * @author Austin Bursey
 * @param {PhotoReport} photoReport A PhotoReport object.
 * @returns True iff the object exists.
*/
async function photo_report_exists(photoReport) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.VarChar, photoReport.getuserId());
            req.input('photo', sql.Int, photoReport.getPhotoId());
            req.input('date', sql.Date, photoReport.getReportDate());
            return await req.query("Select * from report r JOIN post p ON p.post_id = r.post_id " + 
            "WHERE report_date = @date and p.[user_id] = @userId AND p.photo_id = @photo")

                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Checks if the Plant exists under another ID.
 * @author Austin Bursey
 * @param {Plant} plant The Plant.
 * @returns True iff the object exists.
*/
async function plant_exists(plant) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('plantName', sql.VarChar, plant.getName());
            return await req.query("Select * from [projectgreenthumb].[dbo].[plant] where plant_name= @plantName")

                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Checks if the User exists under another ID.
 * @author Austin Bursey
 * @param {plant} user The User.
 * @returns True iff the object exists.
*/
async function user_exists(user) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.VarChar, user.getId() );
            return await req.query("Select * from [projectgreenthumb].[dbo].[user] where user_id LIKE  @userId")

                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc make an array of bans object
 * @author Austin Bursey
 * @param {userId} userId a userId Int.
 * @returns {Bans} an array of ban  objects
*/
async function create_bans(userId) {
    let bans = [];
    sql.close() // CLose any existing connections
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.VarChar, userId);
            return await req.query("Select * from [projectgreenthumb].[dbo].[ban] where user_id = @userId")

                .then(function (recordset) {
                    let i = 0;

                    while (recordset.recordset[i] != null) {
                        bans.push(new Ban(recordset.recordset[i].user_id, recordset.recordset[i].admin_id, recordset.recordset[i].expiration_date, recordset.recordset[i].ban_id));
                        i++;
                    }
                    return votes;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc make an array of votesbased on 'direction' 0 for downvotes. 1 for upvotes.
 * @author Austin Bursey
 * @param {userId} userId a userId Int.
 * @returns {Votes} an array of votes  objects
*/
async function create_votes(photoId, direction) {
    let votes = [];
    sql.close() // CLose any existing connections
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('photoId', sql.Int, photoId);
            req.input('direction', sql.Int, direction);
            return await req.query("Select * from [projectgreenthumb].[dbo].[voting] where photo_id = @photoId and vote = @direction")

                .then(function (recordset) {
                    let i = 0;

                    while (recordset.recordset[i] != null) {
                        votes.push(recordset.recordset[i].user_id);
                        i++;
                    }
                    return votes;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Adds a vote to the database
 * @author Saad Ansari
 * @param {photoId} photoId a plantId Int.
 * @param {userId} userId a userId Int.
 * @param {direction} direction of the vote Int.
*/
async function add_vote(photoId, userId, direction) {
    sql.close() // CLose any existing connections
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('photoId', sql.Int, photoId);
            req.input('userId', sql.Int, userId);
            req.input('direction', sql.Int, direction);
            return await req.query("INSERT INTO voting ([user_id], [photo_id], vote) VALUES (@userId, @photoId, @direction)")
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc removes a vote from the database
 * @author Saad Ansari
 * @param {photoId} photoId a plantId Int.
 * @param {userId} userId a userId Int.
*/
async function remove_vote(vote_id) {
    sql.close() // CLose any existing connections
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('voteId', sql.Int, vote_Id);
            return await req.query("DELETE FROM voting WHERE [vote_id] = @voteId")
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Change the direction of a vote
 * @author Saad Ansari
 * @param {voteId} voteId a voteId Int.
*/
async function change_vote_direction(voteId, direction) {
    sql.close() // CLose any existing connections
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('voteId', sql.Int, voteId);
            req.input('direction', sql.Int, direction);
            return await req.query("UPDATE voting SET vote = @direction  WHERE [vote_id] = @voteId")
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Finds and returns a single vote
 * @author Saad Ansari
 * @param {userId} userId a userId Int.
 * @param {photoId} photoId a photoId Int.
*/
async function get_vote(photoId, userId) {
    sql.close() // CLose any existing connections
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('photoId', sql.Int, photoId);
            req.input('userId', sql.Int, userId);
            req.input('direction', sql.Int, direction);
            return await req.query("SELECT vote_id FROM voting WHERE [user_id] = @userId AND [photo_id] = @photoId AND vote = @direction")
        })
        .then(function (recordset) {
            if (recordset.recordset[0] != undefined) {
                return recordset.recordset[0].vote_id;
            } else {
                return null;
            }
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Manages the votes 
 * @author Saad Ansari
 * @param {userId} userId a userId Int.
 * @param {photoId} photoId a photoId Int.
 * @param {direction} direction the direction of the vote.
*/
async function vote(photoId, userId, direction) {

    opp_direction = 0;
    if (direction = 0) {
        opp_direction = 1;
    }

    current_vote = await get_vote(photoId, userId, direction); // If cancelling out existing vote
    if (current_vote != null) {
        await remove_vote(current_vote);
    }
    else {
        add_vote(photoId, userId, direction); // Adding the new vote if doesnt already exist
        opp_vote = await get_vote(photoId, userId, opp_direction); // Remove the opposite vote if it exists
        if (opp_vote != null) {
            await remove_vote(opp_vote);
        }
    }
}

///////////////////////////Insertion Functions////////////////////////////
/**
 * @desc Add a Ban to the database.
 * @author Austin Bursey
 * @param {ban}  The new Ban object.
 * @return {ban} The orginal ban object with an initialized Id 
*/ 
async function addBan(ban) {
    let new_Ban = await ban_exists(ban);
    if (new_Ban == true) {
        throw new DBIDuplicate("Ban");
    }
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.VarChar, ban.getuserId());
            req.input('adminId', sql.VarChar, ban.getAdminId());
            req.input('expiration', sql.DateTime, ban.getExpirationDate());
            return await req.query("Insert into [projectgreenthumb].[dbo].[ban] (user_id, admin_id, expiration_date) Values (@userId, @adminId, @expiration);Select * from [projectgreenthumb].[dbo].[ban] where ban_id = SCOPE_IDENTITY()")

                .then(function (recordset) {

                    ban = new Ban(recordset.recordset[0].user_id, recordset.recordset[0].admin_id, recordset.recordset[0].expiration_date, recordset.recordset[0].ban_id);
                    sql.close();
                    return ban;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}
/**
 * @desc Add a Photo to the database.
 * @author Austin Bursey
 * @param {Photo} photo The new Photo object.
 * @return {photo} The orginal Photo object with an initialized Id 
*/
async function addPhoto(photo) {
    if (photo.getId() !== undefined) {
        let new_photo = await photo_exists(photo);

        if (new_photo == true) {
            throw new DBIDuplicate("Photo");
        }
    }
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input("plantId", sql.Int, photo.getPlantId());
            req.input("image_ref", sql.VarChar, photo.getImage());
            req.input("userId", sql.VarChar, photo.getUserId());
            req.input("uploadDate",sql.DateTime, photo.getUploadDate());
            return await req.query("insert into [photo] (plant_id , image, tf_record) Values(@plantId, convert(VarBinary(max),@image_ref) , 0); insert into [post] (user_id , photo_id,upload_date) values (@userId, (Select photo_id from [photo] where photo_id = SCOPE_IDENTITY()),@uploadDate);" +
                "SELECT PHOTO.photo_id, plant_id, image , tf_record , post_id , user_id , upload_date FROM [projectgreenthumb].[dbo].[photo] INNER JOIN [projectgreenthumb].[dbo].[post] ON (post.photo_id = photo.photo_id)  where photo.photo_id = SCOPE_IDENTITY();")
                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        photo = new Photo(recordset.recordset[0].plant_id, recordset.recordset[0].user_id, recordset.recordset[0].image.toString('base64'), recordset.recordset[0].photo_id, recordset.recordset[0].upload_date, async function () {

                            return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where photo_id = SCOPE_IDENTITY() and vote = 1 order by user_id").then(function (recordset) {
                                return recordset.recordset;
                            }).catch(function (err) {
                                throw err;
                            })
                        }, async function () {

                            return await req.query("Select user_id from [projectgreenthumb].[dbo].[voting] where photo_id =SCOPE_IDENTITY() and vote = 0 order by user_id").then(function (recordset) {
                                return recordset.recordset;
                            }).catch(function (err) {
                                throw err;
                            })
                        });

                        sql.close();
                        return photo;
                    } else {
                        throw new DBIRecordNotFound("photoId");
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Add a PhotoReport to the database.
 * @author Austin Bursey
 * @param {PhotoReport} photoReport The new PhotoReport.
 * @return {report} The orginal PhotoReport object with an initialized Id 
*/
async function addPhotoReport(photoReport) {
    let new_photoReport = await photo_report_exists(photoReport);
    if (new_photoReport == true) {
        throw new DBIDuplicate("PhotoReport");
    }
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input("photoId", sql.Int, photoReport.getPhotoId());
            req.input("rDate", sql.Date, photoReport.getReportDate());
            req.input("rText", sql.VarChar, photoReport.getReportText());
            req.input("userId", sql.VarChar, photoReport.getuserId());
            return await req.query("Insert into [projectgreenthumb].[dbo].[report] (post_id, report_date , report_details, user_id) " +
                "Values((SELECT post_id from [post] where photo_id = photoId)" +
                ", @reportDate , @reportDetails); Insert into [admin_report] (report_id , admin_id , admin_action) " +
                "Values (SELECT report_id from [report] where report_id = SCOPE_IDENTITY(), @photoReport, @admin_Action, @userId);Select * from [projectgreenthumb].[dbo].[report] INNER JOIN [post] ON [post].post_id = [report].post_id  where report_id = SCOPE_IDENTITY() ")

                .then(function (rset) {
                    let report = new PhotoReport(rset.recordset[0].photo_id, rset.recordset[0].user_id, rset.recordset[0].report_details, rset.recordset[0].report_id, rset.recordset[0].report_date);
                    sql.close();
                    return report;

                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Add a Plant to the database.
 * @author Austin Bursey
 * @param {Plant} plant The new Plant.
 * @return {plant} The orginal Plant object with an initialized Id 
*/
async function addPlant(plant) {
    let new_plant = await plant_exists(plant);
    if (new_plant == true) {
        throw new DBIDuplicate("Plant");
    }
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('plantName', sql.VarChar, plant.getName());
            req.input('plantBio', sql.VarChar, plant.getBio());
            return await req.query("Insert into [plant] (plant_name, plant_bio) Values (@plantName, @plantBio); Select * from [projectgreenthumb].[dbo].[plant] where plant_id = SCOPE_IDENTITY()")
                .then(function (rset) {
                    let plant= new Plant(rset.recordset[0].plant_name, rset.recordset[0].plant_bio, rset.recordset[0].plant_id);
                    sql.close();
                    return plant;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Add a User to the database
 * @author Austin Bursey
 * @param {User} user a User object.
 * @return {user} The orginal user object with an initialized Id 
*/
async function addUser(user) {
    let new_User = await user_exists(user);
    if (new_User == true) {
        throw new DBIDuplicate("User");
    }
    sql.close() // Close any existing connections.
     await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.VarChar, user.getId());
            return await req.query("  Insert into [user] values(@userId); ")
                .then(async function (rset) {
                sql.close();
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
    return user;
}


/**
 * @desc Add an Admin to the database.
 * @author Saad Ansari
 * @param {Admin} admin An Admin object.
 * @return {admin} original admin object with ID initialized
*/
async function addAdmin(admin) {
    sql.close() // Close any existing connections.
    await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();

            return await req.query("Insert into [projectgreenthumb].[dbo].[admin] DEFAULT VALUES  ")
                .then(function (recordset) {
                    sql.close();
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
    return admin; 
}

///////////////////////////Removal Functions////////////////////////////
/**
 * @desc Removes the Photo from the database.
 * @author Saad Ansari
 * @param {Number} photoId The primary key of the Photo.
*/
async function removePhoto(photoId) {
    sql.close() // Close any existing connections.
    // Connect to database.
    sql.connect(config, function (err) {
        if (err) { throw err; }

        let request = new sql.Request(); // Create Request object.
        request.input('photoId', sql.Int, photoId);
        let sqlQuery = 'DELETE FROM photo WHERE photo_id = @photoId'; // Create SQL Query.

        // Query the database and remove Photo.
        request.query(sqlQuery, function (err, recordset) {
            if (err) { throw err; }

            sql.close(); //Close connection
        });
    });
}

/**
 * @desc Removes the report from the database.
 * @author Saad Ansari
 * @param {Number} photoReportId The primary key of the PhotoReport.
*/
async function removePhotoReport(photoReportId) {
    sql.close() // Close any existing connections.
    // Connect to database.
    sql.connect(config, function (err) {
        if (err) { throw err; }

        let request = new sql.Request(); // Create Request object.
        request.input('photoReportId', sql.Int, photoReportId);
        let sqlQuery = 'DELETE FROM report WHERE report_id = @photoReportId'; // Create SQL Query

        // Query the database and remove photo.
        request.query(sqlQuery, function (err, recordset) {
            if (err) { throw err; }
            sql.close(); // Close connection.
        });
    });
}

/**
 * @desc Removes the Plant and associated records from the database.
 * @author Saad Ansari
 * @param {Number} plantId The primary key of the Plant.
*/
async function removePlant(plantId) {
    sql.close() // Close any existing connections.
    // Connect to database.
    sql.connect(config, function (err) {
        if (err) { throw err; }
        let request = new sql.Request(); // Create Request object.
        request.input('plantId', sql.Int, plantId);
        let sqlQuery = // Create SQL Query.
            // Delete all associated reports.
            'DELETE FROM report WHERE' +
            '(SELECT pl.plant_id FROM plant pl ' +
            'JOIN photo ph ON ph.plant_id = pl.plant_id ' +
            ' JOIN post po ON ph.photo_id = po.photo_id ' +
            'JOIN report r ON r.post_id = po.post_id) = @plantId;' +

            // Delete all associated posts.
            'DELETE FROM post WHERE ' +
            '(SELECT pl.plant_id FROM plant pl ' +
            'JOIN photo ph ON ph.plant_id = pl.plant_id ' +
            'JOIN post po ON ph.photo_id = po.photo_id) = @plantId;' +

            // Delete all associated photos.
            'DELETE FROM photo WHERE plant_id = @plantId;' +

            // Delete all assocaited votes.
            'DELETE FROM voting WHERE ' +
            '(SELECT pl.[plant_id] FROM plant pl ' +
            'JOIN photo ph ON ph.plant_id = pl.plant_id ' +
            'JOIN voting v ON v.photo_id = ph.photo_id) = @plantId;' +

            // Delete the plant.
            'DELETE FROM plant WHERE plant_id = @plantId;'

        // Query the database and remove the Plant.
        request.query(sqlQuery, function (err, recordset) {
            if (err) { throw err; }

            sql.close(); // Close connection.
        });
    });
}

/**
 * @desc Removes the specified User from the database.
 * @author Saad Ansari
 * @param {Number} userId The primary key of the User.
*/
async function removeUser(userId) {
    sql.close() // Close any existing connections.
    // Connect to database.
    sql.connect(config, function (err) {
        if (err) { throw err; }
        let request = new sql.Request(); // create Request object
        request.input('userId', sql.VarChar, userId);
        let sqlQuery = // Create SQL Query.
            // Delete all associated reports.
            'DELETE FROM ban WHERE ' +
            'user_id = @userId;' +

            // Delete all associated reports.
            'DELETE FROM report WHERE ' +
            'user_id = @userId;' +

            // Delete all associated posts.
            'DELETE FROM post WHERE ' +
            'user_id = @userId;' +

            // Delete all assocaited votes.
            'DELETE FROM voting WHERE ' +
            'user_id = @userId;' +

            // Delete the user.
            'DELETE FROM[user] WHERE [user_id] = @userId;'

        // Query the database and remove the specified User.
        request.query(sqlQuery, function (err, recordset) {
            if (err) { throw err; }

            sql.close(); // Close connection.
        });
    });
}

///////////////////////////Retrieval Functions////////////////////////////
/**
 * @desc Returns the Ban with the specified ID.
 * @author Austin Bursey
 * @param {Number} BanId The primary key of the Ban table.
 * @returns {Ban} The Ban with the specified ID.
*/
async function getBan(banId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('banId', sql.Int, banId);

            return await req.query("Select * from [projectgreenthumb].[dbo].[ban] where ban_id = @banId")

                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        ban = new Ban(recordset.recordset[0].user_id, recordset.recordset[0].admin_id, recordset.recordset[0].expiration_date, recordset.recordset[0].ban_id);
                        sql.close();
                        return ban;
                    } else {
                        throw new DBIRecordNotFound("banId");
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}
/**
 * @desc Returns the Photo with the specified ID.
 * @author Austin Bursey
 * @param {Number} photoId The primary key of the Photo table
 * @returns {Photo} A Photo object
*/
async function getPhoto(photoId) {
    console.log(photoId);
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('photoId', sql.Int, photoId);
            return await req.query("SELECT PHOTO.photo_id, plant_id, image , tf_record , post_id , user_id , upload_date FROM [projectgreenthumb].[dbo].[photo] INNER JOIN [projectgreenthumb].[dbo].[post] ON (post.photo_id = photo.photo_id)  where photo.photo_id = @photoId;")
                .then(async function (recordset) {
                    if (recordset.recordset[0] != null) {
                        console.log(recordset.recordset[0]);
                        photo = new Photo(recordset.recordset[0].plant_id, recordset.recordset[0].user_id, recordset.recordset[0].image.toString('base64'), recordset.recordset[0].photo_id, recordset.recordset[0].upload_date, await create_votes(photoId, 1), await create_votes(photoId, 0));

                        sql.close();
                        return photo;
                    } else {
                        throw new DBIRecordNotFound("photoId");
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns a PhotoReport object from the Database
 * @author Nicolas Ross
 * @param {Number} photoReportId The primary key of the PhotoReport table.
 * @returns {PhotoReport} The PhotoReport with the specified ID.
 */
async function getPhotoReport(photoReportId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('photoReportId', sql.Int, photoReportId);
            return await req.query("SELECT [report].user_id, photo_id, report_details, report_id , report_date FROM [projectgreenthumb].[dbo].[report] INNER JOIN [projectgreenthumb].[dbo].[post] ON (post.post_id = report.post_id) where report.report_id = @photoReportId;")
                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        report = new PhotoReport(recordset.recordset[0].photo_id, recordset.recordset[0].user_id, recordset.recordset[0].report_details, recordset.recordset[0].report_id, recordset.recordset[0].report_date);
                        sql.close();
                        return report;
                    } else {
                        throw new DBIRecordNotFound("PhotoReport");
                    }
                }).catch(function (err) {
                    throw err;
                });

        }).catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns the PhotoReports handled by the specified Admin.
 * @author Nicolas Ross
 * @param {Number} adminId The primary key of the Admin table.
 * @returns {PhotoReport[]} The PhotoReports handled by the specified Admin.
 */
async function getPhotoReportsByAdmin(adminId) {
    reports = [];
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('adminId', sql.VarChar, adminId);
            return await req.query("SELECT * FROM [projectgreenthumb].[dbo].[admin_report] INNER JOIN [projectgreenthumb].[dbo].[report] ON (report.report_id = admin_report.report_id) where admin_report.admin_id = @adminId;")
                .then(function (recordset) {
                    ind = 0;
                    while (recordset[ind] != null) {
                        reports.push(PhotoReport(recordset.recordset[ind].report_id, async function () {
                            req.input('postId', sql.Int, recordset[ind].post_id);
                            return await req.query("SELECT photo_id FROM [projectgreenthumb].[dbo].[post] where post.post_id = @postId").then(function (recordset) {
                                return recordset;

                            }).catch(function (err) {
                                throw err;
                            })
                        }, async function () {
                            req.input('postId', sql.Int, recordset[ind].post_id);
                            return await req.query("SELECT user_id FROM [projectgreenthumb].[dbo].[post] where post.post_id = @postId").then(function (recordset) {
                                return recordset;

                            }).catch(function (err) {
                                throw err;
                            })

                        }, recordset.recordset[ind].report_details, recordset.recordset[ind].report_date));
                        ind = ind + 1;
                    }
                    sql.close();

                }).catch(function (err) {
                    throw err;
                });

        }).catch(function (err) {
            throw err;
        });

    return reports;
}

/**
 * @desc Returns the Admin with the specified ID.
 * @author Austin Bursey
 * @param {Number} adminId The primary key of the Admin table.
 * @returns {Admin} The Admin with the specified ID.
*/
async function getAdmin(adminId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('adminId', sql.VarChar, adminId);

            return await req.query("SELECT * FROM [projectgreenthumb].[dbo].[admin] where admin_id = @adminId ")

                .then(function (recordset) {
                    if (recordset.recordset[0] != undefined) {
                        user = new Admin(recordset.recordset[0].admin_id, async function () {
                            req.input('adminId', sql.Int, adminId);

                            return await req.query("Select * from [projectgreenthumb].[dbo].[ban] where admin_id = @adminId").then(function (recordset) {
                                return recordset;
                            }).catch(function (err) {
                                throw err;
                            })
                        });

                        sql.close();
                        return user;
                    } else {
                        throw new DBIRecordNotFound("adminId");
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}
/**
 * @desc Returns the Plant with the specified ID.
 * @author Austin Bursey
 * @param {Number} plantId The primary key of the Plant table.
 * @returns {Plant} The Plant with the specified ID.
*/
async function getPlant(plantId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('plantId', sql.Int, plantId);
            return await req.query("SELECT * FROM [projectgreenthumb].[dbo].[plant] where plant_id = @plantId;")
                .then(function (recordset) {
                    if (recordset.recordset[0] != null) {
                        plant = new Plant(recordset.recordset[0].plant_name, recordset.recordset[0].plant_bio, recordset.recordset[0].plant_id);
                        sql.close();
                        return plant;
                    } else {
                        throw new DBIRecordNotFound("plantId");
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });

}

/**
 * @desc Returns all Plants that contain the specified query string.
 * @author Saad Ansari
 * @param {String} query The query string.
 * @returns {Plant[]} The matching Plants.
*/
async function getPlantByQuery(query) {
    plants = [];
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('query', sql.NVarChar(40), query);
            return await req.query("SELECT * FROM [plant] WHERE plant_name LIKE ('%' + @query + '%') OR plant_bio LIKE ('%' + @query + '%')")
                .then(function (recordset) {
                    ind = 0;
                    if (recordset.recordset[0] != null) {
                        while (recordset.recordset[ind] != null) {
                            plants.push(new Plant(recordset.recordset[ind].plant_name, recordset.recordset[ind].plant_bio, recordset.recordset[ind].plant_id));
                            ind = ind + 1;
                        }
                        sql.close();
                        return plants;
                    } else {
                        throw new DBIRecordNotFound("query");
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });

}

/**
 * @desc Returns an array of most recent plant photos
 * @author Saad Ansari
 * @param {Number} plantId The primary key of the Plant.
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} The most recent Photos uploaded of the specified Plant.
*/
async function getNewestPlantPhotos(plantId, startIndex, max) {
    photos = [];
    sql.close() // Close any existing connections.
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
                if (recordset.recordset[0] !== null) {
                    while (recordset[ind] !== null) {
                        photos.push(new Photo(recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image.toString('base64'), recordset.recordset[ind].photo_id, recordset.recordset[ind].upload_date, create_votes(recordset.recordset[ind].photo_id,1),create_votes(recordset.recordset[ind].photo_id,0)));
                        ind = ind + 1;
                    }
                    
                    sql.close();
                    return photos;
                } else {
                    sql.close();
                    throw new DBIRecordNotFound("plant photos");

                }
            })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
    return photos.slice(startIndex, startIndex + max);
}

/**
 * @desc Returns a number of most recent Photos uploaded by the specified User.
 * @author Saad Ansari
 * @param {Number} userId The primary key of the User.
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} The most recent Photos uploaded by the specified User.
*/
async function getNewestUserPhotos(userId, startIndex, max) {
    photos = [];
    sql.close() // Close any existing connections.
    await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.VarChar, userId);
            sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ' +
                'ph.tf_record, po.post_id, po.[user_id], po.upload_date ' +
                'FROM photo ph ' +
                'LEFT OUTER JOIN post po ON po.photo_id = ph.photo_id ' +
                'WHERE po.[user_id] = @userId ORDER BY po.upload_date DESC'
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                if (recordset.recordset[0] != null) {
                    while (recordset[ind] != null) {
                        photos.push(new Photo(recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image.toString('base64'), recordset.recordset[ind].photo_id, recordset.recordset[ind].upload_date, create_votes(recordset.recordset[ind].photo_id,1),create_votes(recordset.recordset[ind].photo_id,0)));
                        ind = ind + 1;
                    }
                    sql.close();
                    return photos;
                } else {
                    sql.close();
                    throw new DBIRecordNotFound("user photos");
                }
            })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
    return photos.slice(startIndex, startIndex + max);
}

/**
 * @desc Returns an array of the top rated Photos.
 * @author Saad Ansari
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} An array of Photos with the highest rating.
*/
async function getTopPhotos(startIndex, max) {
    photos = [];
    sql.close() // Close any existing connections.
    await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
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
                if (recordset.recordset[0] == null) {
                    while (recordset[ind] != null) {
                        photos.push(new Photo(recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image.toString('base64'), recordset.recordset[ind].photo_id, recordset.recordset[ind].upload_date, create_votes(recordset.recordset[ind].photo_id,1),create_votes(recordset.recordset[ind].photo_id,0)));
                        ind = ind + 1;
                    }
                    sql.close();
                } else {
                    sql.close();
                    throw new DBIRecordNotFound("photo_id");
                }
            })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
    return photos.slice(startIndex, startIndex + max);
}

/**
 * @desc Returns an array of the top rated Photos of the specified Plant.
 * @author Saad Ansari
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} An array of Photos of the specified Plant.
*/
async function getTopPlantPhotos(plantId, startIndex, max) {
    photos = [];
    sql.close() // Close any existing connections.
    await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('plantId', sql.Int, plantId);
            sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id ' +
                ', po.[user_id], po.upload_date, SUM(v.vote) FROM photo ph ' +
                'LEFT OUTER JOIN post po ON po.photo_id = ph.photo_id ' +
                'LEFT OUTER JOIN voting v ON v.photo_id = ph.photo_id ' +
                'WHERE ph.plant_id = @plantId ' +
                'GROUP BY ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, ' +
                'po.[user_id], po.upload_date ORDER BY SUM(v.vote) DESC'
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0
                if (recordset.recordset[0] == null) {
                    while (recordset[ind] != null) {
                        // ???
                        photos.push(new Photo(recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image.toString('base64'), recordset.recordset[ind].photo_id, recordset.recordset[ind].upload_date, create_votes(recordset.recordset[ind].photo_id,1),create_votes(recordset.recordset[ind].photo_id,0)));
                        ind = ind + 1;
                    }
                    return photos;
                    sql.close();
                } else {
                    sql.close();
                    return [];
                }
            })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
    return photos.slice(startIndex, startIndex + max);
}

/**
 * @desc Returns an array of the top rated Photos from the specified User.
 * @author Luke Turnbull
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} An array of Photos from the specified User.
*/
async function getTopUserPhotos(userId, startIndex, max) {
    let photos = [];
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('userId', sql.VarChar, userId);
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
                    // ???
                    photos.push(new Photo(recordset.recordset[ind].plant_id, recordset.recordset[ind].user_id, recordset.recordset[ind].image.toString('base64'), recordset.recordset[ind].photo_id, recordset.recordset[ind].upload_date, create_votes(recordset.recordset[ind].photo_id,1),create_votes(recordset.recordset[ind].photo_id,0)));
                    ind = ind + 1;
                }
                sql.close();
                return photos.slice(startIndex, startIndex + max);
            })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns an array of PhotoReports, ordered by priority (number of times a Photo was reported).
 * @author Luke Turnbull
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of PhotoReports to return.
 * @returns {Photo[]} Array of unhandled PhotoReports.
*/
async function getUnhandledPhotoReportsByPriority(startIndex, max) {
    let photoReports = [];
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            sqlQuery = 'SELECT r.report_id,r.report_date, r.report_details,p.photo_id,p.user_id FROM report r' +
                'LEFT OUTER JOIN post p ON p.post_id = r.post_id' +
                'GROUP BY r.report_id,r.report_date, r.report_details,p.photo_id,p.user_id ORDER BY SUM(r.post_id)';
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0;
                while (recordset.recordset[ind] != null) {
                    photoReports.push(new PhotoReport(recordset.recordset[ind].photo_id, recordset.recordset[ind].user_id, recordset.recordset[ind].report_details, recordset.recordset[ind].report_id, recordset.recordset[ind].report_date));
                    ind = ind + 1;
                }
                sql.close();
                return photoReports.slice(startIndex, startIndex + max);
            })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns an array of oldest unhandled PhotoReport.
 * @author Luke Turnbull
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of PhotoReports to return.
 * @returns {Photo[]} Array of unhandled PhotoReports.
*/
async function getUnhandledPhotoReportsByDate(startIndex, max) {
    let photoReports = [];
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            sqlQuery = 'SELECT r.report_id,r.report_date, r.report_details,p.photo_id,p.user_id FROM report r' +
                'LEFT OUTER JOIN post p ON p.post_id = r.post_id' +
                'GROUP BY r.report_id,r.report_date, r.report_details,p.photo_id,p.user_id ORDER BY r.upload_date';
            return await req.query(sqlQuery).then(function (recordset) {
                ind = 0;
                while (recordset.recordset[ind] != null) {
                    photoReports.push(new PhotoReport(recordset.recordset[ind].photo_id, recordset.recordset[ind].user_id, recordset.recordset[ind].report_details, recordset.recordset[ind].report_id, recordset.recordset[ind].report_date));
                    ind = ind + 1;
                }
                sql.close();
                return photoReports.slice(startIndex, startIndex + max);
            })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns the requested User object from the DB.
 * @author Luke Turnbull
 * @param {Number} userId The primary key of the User table.
 * @returns {User} The requested User.
*/
async function getUser(userId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {

            let req = new sql.Request();
            req.input('userId', sql.VarChar, userId);
            return await req.query("SELECT [user_id] FROM [user] where [user].[user_id] = @userId ")
                .then(async function (recordset) {
                    if (recordset.recordset[0] != undefined) {
                        user = new User(recordset.recordset[0].user_id, await create_bans(userId));

                        sql.close();
                        return user;
                    } else {
                        throw new DBIRecordNotFound("userId");
                    }
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

///////////////////////////Update Functions////////////////////////////

/**
 * @desc Updates a Photo object in the DB.
 * @author Luke Turnbull
 * @param {Photo} photo The Photo to be updated.
*/
async function updatePhoto(photo) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('photoId', sql.Int, photo.getId());
            req.input('plantId', sql.Int, photo.getPlantId());
            req.input('image', sql.VarChar, photo.getImage());
            req.input('tf_record', sql.VarChar, photo.getTfRecord());
            return await req.query("UPDATE [photo] SET [plant_id] = @plantId, [image] = @image, [tf_record] = @tfrecord WHERE photo_id = @photoId")
                .then(function (recordset) {
                    sql.close();
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Update a PhotoReport object in the DB.
 * @author Luke Turnbull
 * @param {PhotoReport} photoReport The PhotoReport to be updated.
*/
async function updatePhotoReport(photoReport) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            req.input("reportId", sql.Int, photoReport.getId());
            req.input("rDate", sql.Date, photoReport.getReportDate());
            req.input("rText", sql.VarChar, photoReport.getReportText());
            let req = new sql.Request();
            return await req.query("UPDATE [report] SET report_date = @rDate, report_details = @rText WHERE report_id = @reportId")
                .then(function (recordset) {
                    sql.close();

                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Update a Plant object in the DB.
 * @author Luke Turnbull
 * @param {Plant} plant The Plant to be updated.
*/
async function updatePlant(plant) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('plantId', sql.VarChar, plant.getId());
            req.input('plantName', sql.VarChar, plant.getName());
            req.input('plantBio', sql.VarChar, plant.getBio());
            return await req.query("UPDATE [plant] SET [plant_name] = @plantName, plant_bio = @plantBio WHERE plant_id = @plantId ")
                .then(function (recordset) {
                    sql.close();
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns true iff the adminId can be found in the Admin table of the DB.
 * @author Austin Bursey
 * @param {Number} adminId The primary key of the Admin table. Integer.
 * @returns {Boolean} True iff the adminId can be found in the Admin table of the DB.
*/
async function isValidAdminId(adminId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('adminId', sql.VarChar, adminId);
            return await req.query("SELECT admin_id FROM [projectgreenthumb].[dbo].[admin] where admin_id = @adminId ")
                .then(function (recordset) {
                    let bool = false;
                    if (recordset.recordset[0] != undefined) {
                        bool = true;
                    }
                    return bool;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns true iff the banId can be found in the Ban table of the DB.
 * @author Austin Bursey
 * @param {Number} banId The primary key of the Ban table. Integer.
 * @returns {Boolean} True iff the banId can be found in the Ban table of the DB.
*/
async function isValidBanId(banId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('banId', sql.Int, banId);
            return await req.query("SELECT ban_id FROM [projectgreenthumb].[dbo].[ban] where ban_id = @banId ")
                .then(function (recordset) {
                    let bool = false;
                    if (recordset.recordset[0] != undefined) {
                        bool = true;
                    }
                    return bool;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns true iff the photoId can be found in the Photo table of the DB.
 * @author Austin Bursey
 * @param {Number} photoId The primary key of the Photo table. Integer.
 * @returns {Boolean} True iff the photoId can be found in the Photo table of the DB.
*/
async function isValidPhotoId(photoId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('photoId', sql.Int, photoId);
            return await req.query("SELECT photo_id FROM [projectgreenthumb].[dbo].[photo] where photo_id = @photoId ")
                .then(function (recordset) {
                    let bool = false;
                    if (recordset.recordset[0] != undefined) {
                        bool = true;
                    }
                    return bool;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns true iff the plantId can be found in the Plant table of the DB.
 * @author Austin Bursey
 * @param {Number} plantId The primary key of the Plant table. Integer.
 * @returns {Boolean} True iff the plantId can be found in the Plant table of the DB.
*/
async function isValidPlantId(plantId) {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('plantId', sql.Int, plantId);
            return await req.query("SELECT plant_id FROM [projectgreenthumb].[dbo].[plant] where plant_id = @plantId ")
                .then(function (recordset) {
                    let bool = false;
                    if (recordset.recordset[0] != undefined) {
                        bool = true;
                    }
                    return bool;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns true iff the userId can be found in the User table of the DB.
 * @author Austin Bursey
 * @param {Number} userId The primary key of the User table. Integer.
 * @returns {Boolean} True iff the userId can be found in the User table of the DB.
*/
async function isValidUserId() {
    sql.close() // Close any existing connections.
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('userId', sql.VarBinary, userId);
            return await req.query("SELECT user_id FROM [projectgreenthumb].[dbo].[user] where user_id = @userId ")
                .then(function (recordset) {
                    let bool = false;
                    if (recordset.recordset[0] != undefined) {
                        bool = true;
                    }
                    return bool;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

/**
 * @desc Returns true iff the reportId can be found in the Report table of the DB.
 * @author Austin Bursey
 * @param {Number} reportID The primary key of the Report table. Integer.
 * @returns {Boolean} True iff the reportId can be found in the Report table of the DB.
*/
async function isValidReportId(reportId) {
    sql.close() // Close any existing connections
    return await sql.connect(config)
        .then(async function () {
            let req = new sql.Request();
            req.input('reportId', sql.Int, reportId);
            return await req.query("SELECT report_id FROM [projectgreenthumb].[dbo].[report] where report_id = @reportId ")
                .then(function (recordset) {
                    let bool = false;
                    if (recordset.recordset[0] != undefined) {
                        bool = true;
                    }
                    return bool;
                })
                .catch(function (err) {
                    throw err;
                });
        })
        .catch(function (err) {
            throw err;
        });
}

module.exports = {
    addBan, addPhoto, addPhotoReport, addPlant, addUser, addAdmin,
    removePhoto, removePhotoReport, removePlant, removeUser,
    getBan, getPhoto, getPhotoReport, getPlant, getPhotoReportsByAdmin, getAdmin,
    getNewestPlantPhotos, getNewestUserPhotos, getTopPhotos, getTopPlantPhotos,
    getTopUserPhotos, getUnhandledPhotoReportsByDate, getUnhandledPhotoReportsByPriority,
    getUser, updatePlant, updatePhoto, updatePhotoReport, isValidReportId, isValidUserId, isValidPlantId,
    isValidPhotoId, isValidBanId, isValidAdminId, getPlantByQuery, create_votes, add_vote
}
