/**
 * @desc The Database Interface, used for all interaction with the GreenThumb Database
 * @author Saad Ansari
 * @author Saje Bailey
 * @author Austin Bursey
 * @author Nathaniel Carr
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
const CONFIG = {
    user: 'greenthumbadmin',
    password: 'thumbgreen',
    server: 'greenthumbdb.cn0ybdo6z84o.us-east-2.rds.amazonaws.com',
    database: 'projectgreenthumb'
};

///////////////////////////Error Functions////////////////////////////
function _DBIRecordNotFound(element) {
    return new Error(`The ${element} you are looking for cannot be found in our records`);
}

function _DBIDuplicate(element) {
    return new Error(`The ${element} object(s) you are attempting to save already exist(s).`);
}

///////////////////////////Private Helper Functions////////////////////////////
/**
 * @desc Checks if the Ban exists under another ID.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Ban} ban a Ban object.
 * @returns true iff the object exists. 
*/
async function _banExists(ban) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, ban.getUserId());
                req.input('adminId', sql.VarChar, ban.getAdminId());
                req.input('exp', sql.Date, ban.getExpirationDate());
                return await req.query("Select * from [projectgreenthumb].[dbo].[ban] where user_id = @userId AND admin_id = @adminId AND expiration_date = @exp")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Checks if the Photo exists under another ID.
 * @author Austin Bursey 
 * @author Nathaniel Carr
 * @param {Photo} photo A Photo.
 * @returns True iff the object exists.
*/
async function _photoExists(photo) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantId', sql.Int, photo.getPlantId());
                req.input('img', sql.VarChar, photo.getImage());
                return await req.query("Select * from [projectgreenthumb].[dbo].[photo] where plant_id = @plantId AND image = @img")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Checks if the Photo exists under another ID.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {PhotoReport} photoReport A PhotoReport object.
 * @returns True iff the object exists.
*/
async function _photoReportExists(photoReport) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, photoReport.getUserId());
                req.input('photo', sql.Int, photoReport.getPhotoId());
                req.input('date', sql.Date, photoReport.getReportDate());
                return await req.query("Select * from report r JOIN post p ON p.post_id = r.post_id WHERE report_date = @date and p.[user_id] = @userId AND p.photo_id = @photo")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Checks if the Plant exists under another ID.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Plant} plant The Plant.
 * @returns True iff the object exists.
*/
async function _plantExists(plant) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantName', sql.VarChar, plant.getName());
                return await req.query("Select * from [projectgreenthumb].[dbo].[plant] where plant_name= @plantName")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Checks if the User exists under another ID.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {User} user The User.
 * @returns True iff the object exists.
*/
async function _userExists(user) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, user.getId());
                return await req.query("Select * from [projectgreenthumb].[dbo].[user] where user_id LIKE  @userId")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc make an array of bans object
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {String} userId a userId Int.
 * @returns {Ban[]} an array of ban  objects
*/
async function _createBanArray(userId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, userId);
                return await req.query("Select * from [projectgreenthumb].[dbo].[ban] where user_id = @userId")
                    .then(function (recordset) {
                        let bans = [];
                        for (let i = 0; i < recordset.recordset.length; i++) {
                            bans.push(new Ban(recordset.recordset[i].user_id, recordset.recordset[i].admin_id, recordset.recordset[i].expiration_date, recordset.recordset[i].ban_id));
                        }
                        return bans;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc if upvote is true then return the list of upvotes for photoId
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} photoId
 * @param {Number} direction of the vote Int.
 * @returns {*} an array of votes  objects
*/
async function _createVoteArray(photoId, direction) {
    try {
        direction = direction ? 1 : 0;
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoId', sql.Int, photoId);
                req.input('direction', sql.Int, direction);
                return await req.query("Select * from [projectgreenthumb].[dbo].[voting] where photo_id = @photoId and vote = @direction")
                    .then(function (recordset) {
                        let voteArray = [];
                        for (let i = 0; i < recordset.recordset.length; i++) {
                            voteArray.push(recordset.recordset[i].user_id);
                        }
                        voteArray.sort((a, b) => { return a - b; });
                        return voteArray;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Adds a vote to the database
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} photoId a plantId Int.
 * @param {String} userId a userId Int.
 * @param {Number} direction of the vote Int.
*/
async function _addVote(photoId, userId, direction) {
    try {
        sql.close();
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoId', sql.Int, photoId);
                req.input('userId', sql.Int, userId);
                req.input('direction', sql.Int, direction);
                await req.query("INSERT INTO [projectgreenthumb].[dbo].[voting] ([user_id], [photo_id], vote) VALUES (@userId, @photoId, @direction)")
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc removes a vote from the database
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} voteId a plantId Int.
*/
async function _removeVote(voteId) {
    try {
        sql.close();
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('voteId', sql.Int, voteId);
                await req.query("DELETE FROM [projectgreenthumb].[dbo].[voting] WHERE [vote_id] = @voteId");
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Change the direction of a vote
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} voteId a voteId Int.
 * @param {Number} direction direction vote is going to be changed to
*/
async function _changeVoteDirection(voteId, direction) {
    try {
        sql.close();
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('voteId', sql.Int, voteId);
                req.input('direction', sql.Int, direction);
                await req.query("UPDATE [projectgreenthumb].[dbo].[voting] SET vote = @direction  WHERE [vote_id] = @voteId");
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Finds and returns a single vote
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} photoId a photoId Int.
 * @param {String} userId a userId Int.
 * @return {vote} includes vote_id and direction
*/
async function _getVote(photoId, userId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoId', sql.Int, photoId);
                req.input('userId', sql.Int, userId);
                return await req.query("SELECT * FROM [projectgreenthumb].[dbo].[voting] WHERE [user_id] = @userId AND [photo_id] = @photoId");
            })
            .then(function (recordset) {
                if (recordset.recordset.length) {
                    return { id: recordset.recordset[0].vote_id, direction: recordset.recordset[0].vote };
                } else {
                    return null;
                }
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

///////////////////////////Insertion Functions////////////////////////////
/**
 * @desc Add a Ban to the database.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Ban}  The new Ban object.
 * @return {Ban} The orginal ban object with an initialized Id 
*/
async function addBan(ban) {
    try {
        if (await _banExists(ban)) {
            throw new _DBIDuplicate("Ban");
        }
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, ban.getUserId());
                req.input('adminId', sql.VarChar, ban.getAdminId());
                req.input('expiration', sql.DateTime, ban.getExpirationDate());
                return await req.query("Insert into [projectgreenthumb].[dbo].[ban] (user_id, admin_id, expiration_date) Values (@userId, @adminId, @expiration);Select * from [projectgreenthumb].[dbo].[ban] where ban_id = SCOPE_IDENTITY()")
                    .then(function (recordset) {
                        if (recordset.recordset.length) {
                            ban.setId(recordset.recordset[0].ban_id);
                            return ban;
                        } else {
                            throw new _DBIRecordNotFound("photoId");
                        }
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}
/**
 * @desc Add a Photo to the database.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Photo} photo The new Photo object.
 * @return {Photo} The orginal Photo object with an initialized Id 
*/
async function addPhoto(photo) {
    try {
        if (await _photoExists(photo)) {
            throw new _DBIDuplicate("Photo");
        }
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input("plantId", sql.Int, photo.getPlantId());
                req.input("image_ref", sql.VarChar, photo.getImage());
                req.input("userId", sql.VarChar, photo.getUserId());
                req.input("uploadDate", sql.DateTime, photo.getUploadDate());
                return await req.query("insert into [photo] (plant_id , image, tf_record) Values(@plantId, @image_ref , 0);"
                    + "SELECT PHOTO.photo_id FROM [projectgreenthumb].[dbo].[photo] where photo_id = SCOPE_IDENTITY();"
                    + " insert into [post] (user_id , photo_id,upload_date) values (@userId, (Select photo_id from [photo] where photo_id = SCOPE_IDENTITY()),@uploadDate);")
                    .then(function (recordset) {
                        if (recordset.recordset.length) {
                            photo.setId(recordset.recordset[0].photo_id);
                            return photo;
                        } else {
                            throw new _DBIRecordNotFound("photoId");
                        }
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Add a PhotoReport to the database.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {PhotoReport} photoReport The new PhotoReport.
 * @return {PhotoReport} The orginal PhotoReport object with an initialized Id 
*/
async function addPhotoReport(photoReport) {
    try {
        if (await _photoReportExists(photoReport)) {
            throw new _DBIDuplicate("PhotoReport");
        }
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input("photoId", sql.Int, photoReport.getPhotoId());
                req.input("rDate", sql.DateTime2, photoReport.getReportDate());
                req.input("rText", sql.VarChar, photoReport.getReportText());
                req.input("userId", sql.VarChar, photoReport.getUserId());
                return await req.query("Insert into [projectgreenthumb].[dbo].[report] (post_id, report_date , report_details, user_id) " +
                    "Values((SELECT post_id from [post] where photo_id = @photoId)" +
                    ", @rDate , @rText, @userId) Select report_id from [projectgreenthumb].[dbo].[report] where report_id = SCOPE_IDENTITY(); Insert into [admin_report] (report_id,admin_id) " +
                    "Values ((SELECT report_id from [report] where report_id = SCOPE_IDENTITY()), (SELECT TOP 1 admin_id FROM [projectgreenthumb].[dbo].[admin] ORDER BY newid()));")
                    .then(function (recordset) {
                        if (recordset.recordset.length) {
                            photoReport.setId(recordset.recordset[0].report_id);
                            return photoReport;
                        } else {
                            throw new _DBIRecordNotFound("photoReportId");
                        }
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Add a Plant to the database.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Plant} plant The new Plant.
 * @return {Plant} The orginal Plant object with an initialized Id 
*/
async function addPlant(plant) {
    try {
        if (await _plantExists(plant)) {
            throw new _DBIDuplicate("Plant");
        }
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantName', sql.VarChar, plant.getName());
                req.input('plantBio', sql.VarChar, plant.getBio());
                return await req.query("Insert into [plant] (plant_name, plant_bio) Values (@plantName, @plantBio); Select * from [projectgreenthumb].[dbo].[plant] where plant_id = SCOPE_IDENTITY()")
                    .then(function (recordset) {
                        if (recordset.recordset.length) {
                            plant.setId(recordset.recordset[0].plant_id);
                            return plant;
                        } else {
                            throw new _DBIRecordNotFound("plantId");
                        }
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Add a User to the database
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {User} user a User object.
 * @return {User} The orginal user object with an initialized Id 
*/
async function addUser(user) {
    try {
        if (await _userExists(user)) {
            throw new _DBIDuplicate("User");
        }
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, user.getId());
                return await req.query("Insert into [user] values(@userId);")
                    .then(function () {
                        return user;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Add an Admin to the database.
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Admin} admin An Admin object.
 * @return {Admin} original admin object with ID initialized
*/
async function addAdmin(admin) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                return await req.query("Insert into [projectgreenthumb].[dbo].[admin] values ();")
                    .then(function () {
                        return admin;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

///////////////////////////Removal Functions////////////////////////////
/**
 * @desc Removes the Photo from the database.
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} photoId The primary key of the Photo.
*/
async function removePhoto(photoId) {
    try {
        if (!_photoExists(photoId)) {
            throw new _DBIRecordNotFound("Photo");
        }
        sql.close();
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoId', sql.Int, photoId);
                let sqlQuery =
                    'DELETE FROM voting WHERE photo_id = @photoId;' +
                    'DELETE FROM admin_report WHERE report_id = ANY(SELECT report_id from report r inner join post p ON p.post_id = r.post_id WHERE p.photo_id = @photoId);' +
                    'DELETE FROM report WHERE post_id = ANY(SELECT post_id FROM post WHERE photo_id = @photoId);' +
                    'DELETE FROM post WHERE photo_id = @photoId;' +
                    'DELETE FROM photo WHERE photo_id = @photoId;';
                await req.query(sqlQuery);
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Removes the report from the database.
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} photoReportId The primary key of the PhotoReport.
*/
async function removePhotoReport(photoReportId) {
    try {
        if (!_photoReportExists(photoReportId)) {
            throw new _DBIRecordNotFound("PhotoReport");
        }
        sql.close()
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoReportId', sql.Int, photoReportId);
                let sqlQuery =
                    'DELETE FROM admin_report WHERE report_id = @photoReportId; ' +
                    'DELETE FROM report WHERE report_id = @photoReportId;';
                await req.query(sqlQuery);
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Removes the Plant and associated records from the database.
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} plantId The primary key of the Plant.
*/
async function removePlant(plantId) {
    try {
        if (!_plantExists(plantId)) {
            throw new _DBIRecordNotFound("Plant");
        }
        sql.close();
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantId', sql.Int, plantId);
                let sqlQuery =
                    // Delete associated admin reports.
                    'DELETE FROM [projectgreenthumb].[dbo].[admin_report] WHERE report_id = ANY(SELECT report_id FROM report WHERE post_id = ANY(SELECT post_id FROM post WHERE photo_id = ANY(SELECT plant_id FROM photo WHERE plant_id = @plantId))); ' +
                    // Delete associated reports.
                    'DELETE FROM [projectgreenthumb].[dbo].[report] WHERE post_id = ANY(SELECT post_id FROM post WHERE photo_id = ANY(SELECT plant_id FROM photo WHERE plant_id = @plantId)); ' +
                    // Delete associated votes.
                    'DELETE FROM [projectgreenthumb].[dbo].[voting] WHERE photo_id = ANY(SELECT plant_id FROM photo WHERE plant_id = @plantId); ' +
                    // Delete associated photos.
                    'DELETE FROM [projectgreenthumb].[dbo].[photo] WHERE plant_id = @plantId; ' +
                    // Delete plant.
                    'DELETE FROM [projectgreenthumb].[dbo].[plant] WHERE plant_id = @plantId; ';
                await req.query(sqlQuery);
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Removes the specified User from the database.
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {String} userId The primary key of the User.
*/
async function removeUser(userId) {
    try {
        if (!_userExists(userId)) {
            throw new _DBIRecordNotFound("User");
        }
        sql.close();
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantId', sql.Int, plantId);
                let sqlQuery =
                    "DELETE FROM [projectgreenthumb].[dbo].[ban] WHERE user_id = @userId;" +
                    'DELETE FROM [projectgreenthumb].[dbo].[admin_report] WHERE report_id = ANY(SELECT report_id FROM report WHERE user_id = @userId or post_id = ANY(SELECT post_id from post where user_id = @userId));' +
                    'DELETE FROM [projectgreenthumb].[dbo].[report] WHERE user_id = @userId OR post_id = ANY(SELECT post_id from post where user_id = @userId);' +
                    'DELETE FROM [projectgreenthumb].[dbo].[photo] WHERE photo_id = ANY (SELECT photo_id FROM [projectgreenthumb].[dbo].[post] where user_id = @userId)' +
                    'DELETE FROM [projectgreenthumb].[dbo].[post] WHERE user_id = @userId;' +
                    'DELETE FROM [projectgreenthumb].[dbo].[voting] WHERE user_id = @userId;' +
                    'DELETE FROM [projectgreenthumb].[dbo].[user] WHERE [user_id] = @userId;';
                await req.query(sqlQuery);
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

///////////////////////////Retrieval Functions////////////////////////////
/**
 * @desc Returns the Ban with the specified ID.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} BanId The primary key of the Ban table.
 * @returns {Ban} The Ban with the specified ID.
*/
async function getBan(banId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('banId', sql.Int, banId);
                return await req.query("Select * from [projectgreenthumb].[dbo].[ban] where ban_id = @banId")
                    .then(function (recordset) {
                        if (recordset.recordset.length) {
                            return new Ban(recordset.recordset[0].user_id, recordset.recordset[0].admin_id, recordset.recordset[0].expiration_date, recordset.recordset[0].ban_id);
                        } else {
                            throw new _DBIRecordNotFound("banId");
                        }
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns the Photo with the specified ID.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} photoId The primary key of the Photo table
 * @returns {Photo} A Photo object
*/
async function getPhoto(photoId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoId', sql.Int, photoId);
                return await req.query("SELECT PHOTO.photo_id, plant_id, image , tf_record , post_id , user_id , upload_date FROM [projectgreenthumb].[dbo].[photo] INNER JOIN [projectgreenthumb].[dbo].[post] ON (post.photo_id = photo.photo_id)  where photo.photo_id = @photoId;")
                    .then(async function (recordset) {
                        if (recordset.recordset.length) {
                            return new Photo(recordset.recordset[0].plant_id, recordset.recordset[0].user_id, recordset.recordset[0].image, recordset.recordset[0].photo_id, recordset.recordset[0].upload_date, await _createVoteArray(photoId, 1), await _createVoteArray(photoId, 0));
                        } else {
                            throw new _DBIRecordNotFound("photoId");
                        }
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns a PhotoReport object from the Database
 * @author Nicolas Ross
 * @author Nathaniel Carr
 * @param {Number} photoReportId The primary key of the PhotoReport table.
 * @returns {PhotoReport} The PhotoReport with the specified ID.
 */
async function getPhotoReport(photoReportId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoReportId', sql.Int, photoReportId);
                return await req.query("SELECT [report].user_id, photo_id, report_details, report_id , report_date FROM [projectgreenthumb].[dbo].[report] INNER JOIN [projectgreenthumb].[dbo].[post] ON (post.post_id = report.post_id) where report.report_id = @photoReportId;")
                    .then(function (recordset) {
                        if (recordset.recordset.length) {
                            return new PhotoReport(recordset.recordset[0].photo_id, recordset.recordset[0].user_id, recordset.recordset[0].report_details, recordset.recordset[0].report_id, recordset.recordset[0].report_date);
                        } else {
                            throw new _DBIRecordNotFound("PhotoReport");
                        }
                    }).catch(function (err) {
                        throw err;
                    });
            }).catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns the Plant with the specified ID.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} plantId The primary key of the Plant table.
 * @returns {Plant} The Plant with the specified ID.
*/
async function getPlant(plantId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantId', sql.Int, plantId);
                return await req.query("SELECT * FROM [projectgreenthumb].[dbo].[plant] where plant_id = @plantId;")
                    .then(function (recordset) {
                        if (recordset.recordset.length) {
                            return new Plant(recordset.recordset[0].plant_name, recordset.recordset[0].plant_bio, recordset.recordset[0].plant_id);
                        } else {
                            throw new _DBIRecordNotFound("plantId");
                        }
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns all Plants that contain the specified query string.
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {String} query The query string.
 * @returns {Plant[]} The matching Plants.
*/
async function getPlantByQuery(query) {
    try {
        query = query.toUpperCase();
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('query', sql.NVarChar(40), query);
                return await req.query("SELECT * FROM [plant] WHERE plant_name LIKE ('%' + @query + '%')")
                    .then(function (recordset) {
                        let plants = recordset.recordset.sort((a, b) => { return a.plant_name.toUpperCase().indexOf(query) - b.plant_name.toUpperCase().indexOf(query); });
                        for (let i = 0; i < plants.length; i++) {
                            plants[i] = new Plant(plants[i].plant_name, plants[i].plant_bio, plants[i].plant_id);
                        }
                        return plants;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns an array of most recent plant photos
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} plantId The primary key of the Plant.
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} The most recent Photos uploaded of the specified Plant.
*/
async function getNewestPlantPhotos(plantId, startIndex, max) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantId', sql.Int, plantId);
                let sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, po.[user_id], po.upload_date FROM [photo] ph LEFT OUTER JOIN post po ON po.photo_id = ph.photo_id WHERE ph.plant_id = @plantId ORDER BY po.upload_date DESC'
                return await req.query(sqlQuery).then(async function (recordset) {
                    let photos = [];
                    for (let i = startIndex; i < recordset.recordset.length && photos.length < max; i++) {
                        photos.push(new Photo(recordset.recordset[i].plant_id, recordset.recordset[i].user_id, recordset.recordset[i].image, recordset.recordset[i].photo_id, recordset.recordset[i].upload_date, await _createVoteArray(recordset.recordset[i].photo_id, 1), await _createVoteArray(recordset.recordset[i].photoId, 0)));
                    }
                    return photos;
                })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns a number of most recent Photos uploaded by the specified User.
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {String} userId The primary key of the User.
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} The most recent Photos uploaded by the specified User.
*/
async function getNewestUserPhotos(userId, startIndex, max) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, userId);
                let sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, po.[user_id], po.upload_date FROM [projectgreenthumb].[dbo].[photo] as ph LEFT OUTER JOIN [projectgreenthumb].[dbo].[post] as po ON po.photo_id = ph.photo_id WHERE po.[user_id] = @userId ORDER BY po.upload_date DESC'
                return await req.query(sqlQuery)
                    .then(async function (recordset) {
                        let photos = [];
                        for (let i = startIndex; i < recordset.recordset.length && photos.length < max; i++) {
                            photos.push(new Photo(recordset.recordset[i].plant_id, recordset.recordset[i].user_id, recordset.recordset[i].image, recordset.recordset[i].photo_id, recordset.recordset[i].upload_date, await _createVoteArray(recordset.recordset[i].photo_id, 1), await _createVoteArray(recordset.recordset[i].photoId, 0)));
                        }
                        return photos;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns an array of the top rated Photos of the specified Plant.
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} plantId
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} An array of Photos of the specified Plant.
*/
async function getTopPlantPhotos(plantId, startIndex, max) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantId', sql.Int, plantId);
                let sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, po.[user_id], po.upload_date, SUM(v.vote) as votes FROM [projectgreenthumb].[dbo].[photo] as ph LEFT OUTER JOIN [projectgreenthumb].[dbo].[post] as po ON po.photo_id = ph.photo_id LEFT OUTER JOIN [projectgreenthumb].[dbo].[voting] as v ON v.photo_id = ph.photo_id WHERE ph.plant_id = @plantId GROUP BY ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, po.[user_id], po.upload_date ORDER BY votes DESC'
                return await req.query(sqlQuery)
                    .then(async function (recordset) {
                        let photos = [];
                        for (let i = startIndex; i < recordset.recordset.length && photos.length < max; i++) {
                            photos.push(new Photo(recordset.recordset[i].plant_id, recordset.recordset[i].user_id, recordset.recordset[i].image, recordset.recordset[i].photo_id, recordset.recordset[i].upload_date, await _createVoteArray(recordset.recordset[i].photo_id, 1), await _createVoteArray(recordset.recordset[i].photoId, 0)));
                        }
                        return photos;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns an array of the top rated Photos from the specified User.
 * @author Nathaniel Carr
 * @author Luke Turnbull
 * @param {String} userId
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of Photos to return.
 * @returns {Photo[]} An array of Photos from the specified User.
*/
async function getTopUserPhotos(userId, startIndex, max) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, userId);
                let sqlQuery = 'SELECT ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, po.[user_id], po.upload_date, SUM(v.vote) FROM photo ph LEFT OUTER JOIN [projectgreenthumb].[dbo].[post] po ON po.photo_id = ph.photo_id LEFT OUTER JOIN [projectgreenthumb].[dbo].[voting] v ON v.photo_id = ph.photo_id WHERE po.user_id = @userId GROUP BY ph.photo_id, ph.plant_id, ph.[image], ph.tf_record, po.post_id, po.[user_id], po.upload_date ORDER BY SUM(v.vote) DESC'
                return await req.query(sqlQuery)
                    .then(async function (recordset) {
                        let photos = [];
                        for (let i = startIndex; i < recordset.recordset.length && photos.length < max; i++) {
                            photos.push(new Photo(recordset.recordset[i].plant_id, recordset.recordset[i].user_id, recordset.recordset[i].image, recordset.recordset[i].photo_id, recordset.recordset[i].upload_date, await _createVoteArray(recordset.recordset[i].photo_id, 1), await _createVoteArray(recordset.recordset[i].photoId, 0)));
                        }
                        return photos;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns an array of oldest unhandled PhotoReport.
 * @author Nathaniel Carr
 * @author Luke Turnbull
 * @param {Number} startIndex The index at which to start.
 * @param {Number} max The maximum number of PhotoReports to return.
 * @returns {PhotoReport[]} Array of unhandled PhotoReports.
*/
async function getUnhandledPhotoReportsByDate(startIndex, max) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                let sqlQuery = 'SELECT r.report_id, r.report_date, r.report_details, p.photo_id, p.user_id FROM report r LEFT OUTER JOIN post p ON p.post_id = r.post_id GROUP BY r.report_id, r.report_date, r.report_details, p.photo_id, p.user_id ORDER BY r.report_date DESC';
                return await req.query(sqlQuery).then(function (recordset) {
                    let photoReports = [];
                    for (let i = startIndex; i < recordset.recordset.length && photoReports.length < max; i++) {
                        photoReports.push(new PhotoReport(recordset.recordset[i].photo_id, recordset.recordset[i].user_id, recordset.recordset[i].report_details, recordset.recordset[i].report_id, recordset.recordset[i].report_date));
                    }
                    return photoReports;
                })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns the requested User object from the DB.
 * @author Nathaniel Carr
 * @author Luke Turnbull
 * @param {String} userId The primary key of the User table.
 * @returns {User} The requested User.
*/
async function getUser(userId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, userId);
                return await req.query("SELECT [user_id] FROM [user] where [user].[user_id] = @userId")
                    .then(async function (recordset) {
                        if (recordset.recordset.length) {
                            return new User(recordset.recordset[0].user_id, await _createBanArray(userId));
                        } else {
                            throw new _DBIRecordNotFound("userId");
                        }
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

///////////////////////////Update Functions////////////////////////////
/**
 * @desc Updates a Photo object in the DB.
 * @author Nathaniel Carr
 * @author Luke Turnbull
 * @param {Photo} photo The Photo to be updated.
*/
async function updatePhoto(photo) {
    try {
        if (!(await isValidPhotoId(photo.getId()))) {
            throw new _DBIRecordNotFound("Photo");
        }
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoId', sql.Int, photo.getId());
                req.input('plantId', sql.Int, photo.getPlantId());
                req.input('image', sql.VarChar, photo.getImage());
                req.input('tf_record', sql.VarChar, photo.getTfRecord());
                return await req.query("UPDATE [photo] SET [plant_id] = @plantId, [image] = @image, [tf_record] = @tfrecord WHERE photo_id = @photoId");
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Update a PhotoReport object in the DB.
 * @author Nathaniel Carr
 * @author Luke Turnbull
 * @param {PhotoReport} photoReport The PhotoReport to be updated.
*/
async function updatePhotoReport(photoReport) {
    try {
        if (!(await isValidReportId(photoReport.getId()))) {
            throw new _DBIRecordNotFound("PhotoReport");
        }
        sql.close();
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input("reportId", sql.Int, photoReport.getId());
                req.input("rDate", sql.Date, photoReport.getReportDate());
                req.input("rText", sql.VarChar, photoReport.getReportText());
                await req.query("UPDATE [report] SET report_date = @rDate, report_details = @rText WHERE report_id = @reportId");
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Update a Plant object in the DB.
 * @author Nathaniel Carr
 * @author Luke Turnbull
 * @param {Plant} plant The Plant to be updated.
*/
async function updatePlant(plant) {
    try {
        if (!(await isValidPlantId(plant.getId()))) {
            throw new _DBIRecordNotFound("plant");
        }
        sql.close();
        await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantId', sql.VarChar, plant.getId());
                req.input('plantName', sql.VarChar, plant.getName());
                req.input('plantBio', sql.VarChar, plant.getBio());
                await req.query("UPDATE [plant] SET [plant_name] = @plantName, plant_bio = @plantBio WHERE plant_id = @plantId ");
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns true iff the adminId can be found in the Admin table of the DB.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} adminId The primary key of the Admin table. Integer.
 * @returns {Boolean} True iff the adminId can be found in the Admin table of the DB.
*/
async function isValidAdminId(adminId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('adminId', sql.VarChar, adminId);
                return await req.query("SELECT admin_id FROM [projectgreenthumb].[dbo].[admin] where admin_id = @adminId ")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns true iff the banId can be found in the Ban table of the DB.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} banId The primary key of the Ban table. Integer.
 * @returns {Boolean} True iff the banId can be found in the Ban table of the DB.
*/
async function isValidBanId(banId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('banId', sql.Int, banId);
                return await req.query("SELECT ban_id FROM [projectgreenthumb].[dbo].[ban] where ban_id = @banId ")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns true iff the photoId can be found in the Photo table of the DB.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} photoId The primary key of the Photo table. Integer.
 * @returns {Boolean} True iff the photoId can be found in the Photo table of the DB.
*/
async function isValidPhotoId(photoId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('photoId', sql.Int, photoId);
                return await req.query("SELECT photo_id FROM [projectgreenthumb].[dbo].[photo] where photo_id = @photoId ")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns true iff the plantId can be found in the Plant table of the DB.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} plantId The primary key of the Plant table. Integer.
 * @returns {Boolean} True iff the plantId can be found in the Plant table of the DB.
*/
async function isValidPlantId(plantId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('plantId', sql.Int, plantId);
                return await req.query("SELECT plant_id FROM [projectgreenthumb].[dbo].[plant] where plant_id = @plantId ")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns true iff the userId can be found in the User table of the DB.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {NumbStringer} userId The primary key of the User table. Integer.
 * @returns {Boolean} True iff the userId can be found in the User table of the DB.
*/
async function isValidUserId(userId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('userId', sql.VarChar, userId);
                return await req.query("SELECT user_id FROM [projectgreenthumb].[dbo].[user] where user_id = @userId ")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Returns true iff the reportId can be found in the Report table of the DB.
 * @author Austin Bursey
 * @author Nathaniel Carr
 * @param {Number} reportID The primary key of the Report table. Integer.
 * @returns {Boolean} True iff the reportId can be found in the Report table of the DB.
*/
async function isValidReportId(reportId) {
    try {
        sql.close();
        return await sql.connect(CONFIG)
            .then(async function () {
                let req = new sql.Request();
                req.input('reportId', sql.Int, reportId);
                return await req.query("SELECT report_id FROM [projectgreenthumb].[dbo].[report] where report_id = @reportId ")
                    .then(function (recordset) {
                        return recordset.recordset.length > 0;
                    })
                    .catch(function (err) {
                        throw err;
                    });
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

/**
 * @desc Manages the votes 
 * @author Saad Ansari
 * @author Nathaniel Carr
 * @param {Number} photoId a photoId Int.
 * @param {String} userId a userId Int.
 * @param {Number} direction the direction of the vote.
*/
async function vote(photoId, userId, direction) {
    try {
        if (!(await isValidPhotoId(photoId))) {
            throw _DBIRecordNotFound("photoId");
        }
        if (!(await isValidUserId(userId))) {
            throw _DBIRecordNotFound("userId");
        }
        direction = direction ? 1 : 0;
        let curVote = await _getVote(photoId, userId);
        if (curVote === null) {
            await _addVote(photoId, userId, direction);
        } else if (curVote.direction === direction) {
            await _removeVote(curVote.id);
        } else {
            await _changeVoteDirection(curVote.id, direction);
        }
    } catch (err) {
        throw err;
    } finally {
        sql.close();
    }
}

module.exports = {
    addBan, addPhoto, addPhotoReport, addPlant, addUser, addAdmin,
    removePhoto, removePhotoReport, removePlant, removeUser,
    getBan, getPhoto, getPhotoReport, getPlant, getPlantByQuery,
    getNewestPlantPhotos, getNewestUserPhotos, getTopPlantPhotos,
    getTopUserPhotos, getUnhandledPhotoReportsByDate,
    getUser, updatePhoto, updatePhotoReport, updatePlant,
    isValidAdminId, isValidBanId, isValidPhotoId, isValidPlantId,
    isValidUserId, isValidReportId, vote
}
