/**
 * Module: api.js
 * ------------------------------------------------------------------
 * Authors: Nathaniel Carr, Aaron Exley, Adam Cassidy
 * ------------------------------------------------------------------
 * Last Update: 2018/11/17
 * -------------------------------------------------------------------
 * Description:
 * Runs backend API.
 * -------------------------------------------------------------------
 * References:
 * - express.js docs: https://expressjs.com/en/4x/api.html
 */

// Imports.
const Admin = require("../Admin.js");
const Ban = require("../Ban.js");
const Photo = require("../Photo.js");
const PhotoReport = require("../PhotoReport.js");
const Plant = require("../Plant.js");
const User = require("../User.js");
const DBInterface = require("../db/DBInterface.js");
const MLIdentifier = require("../machineLearning/MLIdentifier.js");
const MLTrainer = require("../machineLearning/MLTrainer.js");

const assert = require("assert");

// Constants.
const API_PORT = 2500;
const DEFAULTS = Object.freeze({
    plantsMaxPhotos: 3,
});
const ERROR_MSG = Object.freeze({
    missingParam: (param) => { return `Missing required '${param}' parameter in request body.`; },
    missingObject: (param) => { return `The requested ${param} object could not be found in the database.`; },
    invalidParam: (param) => { return `Parameter '${param}' is invalid.`; },
    unauthorized: () => { return `User is not authorized to perform this action.`; },
    missingText: (param) => { return `Parameter '${param}' must be a non-empty String.`; },
    noNeg: (param) => { return `Parameter '${param}' may not be negative.`; },
    noPos: (param) => { return `Parameter '${param}' may not be positive.`; },
    onlyNeg: (param) => { return `Parameter '${param}' must be negative.`; },
    onlyPos: (param) => { return `Parameter '${param}' must be positive.`; },
});
const ERROR_CODE = Object.freeze({
    badRequest: 400,
    unauthorized: 401,
    internalError: 500
});
const ADMIN_ACTION = Object.freeze({
    Accept: 0,
    AcceptBan: 1,
    Reject: 2
});

// Create API.
const express = require("express");
const api = express();

// Use middleware to properly parse incoming requests.
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

/**
 * @desc Check the existence and validity of the parameters in the request body.
 * @author Nathaniel Carr
 * @param {*} body The request body.
 * @param {function(body)} checkFunc A function containing assert statements and the appropriate error messages.
 * @returns {boolean} True iff all params were validated.
 */
async function validateParams(req, res, checkFunc) {
    try {
        if (req.body !== undefined && checkFunc !== undefined) {
            await checkFunc(req.body);
        }
        return true;
    } catch (err) {
        if (err instanceof (assert.AssertionError)) { // If an internal error, don't say it was a bad request.
            res.send(ERROR_CODE.badRequest, err.message ? { message: err.message } : null);
        } else {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
        return false;
    }
}

api.post("/photos/add",
    /**
     * @author Nathaniel Carr
     * @author Noah Nichols
     * @desc Add and return the submitted Photo to the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
                assert(body.plantId !== undefined, ERROR_MSG.missingParam("plantId"));
                assert(body.image !== undefined, ERROR_MSG.missingParam("image"));
            })) { return; }

            res.send({
                photoId: (await DBInterface.addPhoto(new Photo(req.body.plantId, req.body.userId, req.body.image))).getId()
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photos/byId",
    /**
     * @author Nathaniel Carr
     * @author Noah Nichols
     * 
     * @desc Return the Photo with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.photoId !== undefined, ERROR_MSG.missingParam("photoId"));
            })) { return; }

            res.send({
                photo: (await DBInterface.getPhoto(req.body.photoId)).toJSON()
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photos/list/byDate",
    /**
     * @author Nathaniel Carr
     * @author Noah Nichols
     * @desc Return the requested number of Photos (desc. sorted by date) from the database, including options for Photos from a specific User or Photos of a specifid Plant.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.startIndex !== undefined, ERROR_MSG.missingParam("startIndex"));
                assert(body.max !== undefined, ERROR_MSG.missingParam("max"));
                assert(body.startIndex >= 0, ERROR_MSG.noNeg("startIndex"));
                assert(body.max > 0, ERROR_MSG.onlyPos("max"));
                assert(body.userId !== undefined || body.plantId !== undefined, "One of \"userId\" and \"plantId\" must be provided.");
            })) { return; }

            let photos = [];
            if (req.body.userId !== undefined) {
                photos = await DBInterface.getNewestUserPhotos(req.body.userId, req.body.startIndex, req.body.max);
            } else {
                photos = await DBInterface.getNewestPlantPhotos(req.body.plantId, req.body.startIndex, req.body.max);
            }

            for (let i = 0; i < photos.length; i++) {
                photos[i] = photos[i].toJSON();
            }

            res.send({
                photos: photos
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photos/list/byRating",
    /**
     * @author Nathaniel Carr
     * @author Noah Nichols
     * @desc Return the requested number of Photos (desc. sorted by rating) from the database, including options for Photos from a specific User or Photos of a specifid Plant.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.startIndex !== undefined, ERROR_MSG.missingParam("startIndex"));
                assert(body.max !== undefined, ERROR_MSG.missingParam("max"));
                assert(body.startIndex >= 0, ERROR_MSG.noNeg("startIndex"));
                assert(body.max > 0, ERROR_MSG.onlyPos("max"));
                assert(body.userId !== undefined || body.plantId !== undefined, "One of \"userId\" and \"plantId\" must be provided.");
            })) { return; }

            let photos = [];
            if (req.body.userId !== undefined) {
                photos = await DBInterface.getTopUserPhotos(req.body.userId, req.body.startIndex, req.body.max);
            } else {
                photos = await DBInterface.getTopPlantPhotos(req.body.plantId, req.body.startIndex, req.body.max);
            }

            for (let i = 0; i < photos.length; i++) {
                photos[i] = photos[i].toJSON();
            }

            res.send({
                photos: photos
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photos/remove",
    /**
     * @author Nathaniel Carr
     * @author Noah Nichols
     * @desc Remove the Photo with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.photoId !== undefined, ERROR_MSG.missingParam("photoId"));
            })) { return; }

            await DBInterface.removePhoto(req.body.photoId);
            res.send({});

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photos/vote",
    /**
     * @author Nathaniel Carr
     * @desc Vote on the Photo with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.photoId !== undefined, ERROR_MSG.missingParam("photoId"));
                assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            })) { return; }

            await DBInterface.vote(req.body.photoId, req.body.userId, req.body.up);
            res.send({});

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photoReports/add",
    /**
     * @author Nathaniel Carr
     * @author Scott Peebles
     * @desc Add and return the submitted PhotoReport to the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
                assert(body.photoId !== undefined, ERROR_MSG.missingParam("photoId"));
                assert(body.reportText !== undefined, ERROR_MSG.missingParam("reportText"));
            })) { return; }

            res.send({
                photoReportId: (await DBInterface.addPhotoReport(new PhotoReport(req.body.photoId, req.body.userId, req.body.reportText))).getId()
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photoReports/byId",
    /**
     * @author Nathaniel Carr
     * @author Scott Peebles
     * @desc Return the PhotoReport with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.photoReportId !== undefined, ERROR_MSG.missingParam("photoReportId"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            res.send({
                report: (await DBInterface.getPhotoReport(req.body.photoReportID)).toJSON()
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photoReports/handle",
    /**
     * @author Nathaniel Carr
     * @author Scott Peebles
     * @desc Handle the PhotoReport with the corresponding ID.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
                assert(body.photoReportId !== undefined, ERROR_MSG.missingParam("photoReportId"));
                assert(body.adminAction !== undefined, ERROR_MSG.missingParam("adminAction"));
                assert(ADMIN_ACTION[body.adminAction] !== undefined, ERROR_MSG.invalidParam("adminAction"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            if (req.body.adminAction === ADMIN_ACTION.Accept) {
                await DBInterface.removePhoto(photoReport.getPhotoID());
            } else if (req.body.adminAction === ADMIN_ACTION.AcceptBan) {
                let photo = await DBInterface.getPhoto(req.body.photoReportId);
                let user = await DBInterface.getUser(photo.getUserId());
                await DBInterface.addBan(new Ban(user.getId(), req.body.adminId, user.nextBanExpirationDate()));
                await DBInterface.removePhoto(req.body.photoReportId);
                await DBInterface.removePhotoReport(req.body.photoReportId);
            }

            res.send({});

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });


api.post("/photoReports/list/byDate",
    /**
     * @author Nathaniel Carr
     * @author Scott Peebles
     * @desc Return the requested number of PhotoReports (asc. sorted by date) from the database, including options for PhotoReports judged by a specific Admin or unhandled PhotoReports.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.startIndex !== undefined, ERROR_MSG.missingParam("startIndex"));
                assert(body.max !== undefined, ERROR_MSG.missingParam("max"));
                assert(body.startIndex >= 0, ERROR_MSG.noNeg("startIndex"));
                assert(body.max > 0, ERROR_MSG.onlyPos("max"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            let photoReports = await DBInterface.getUnhandledPhotoReportsByDate(req.body.startIndex, req.body.max);

            for (let i = req.body.startIndex; i < req.body.max; i++) {
                photoReports[i] = photoReports[i].toJSON();
            }

            res.send({
                photoReports: photoReports
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/photoReports/remove",
    /**
     * @author Nathaniel Carr
     * @author Scott Peebles
     * @desc Remove the PhotoReport with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.photoReportId !== undefined, ERROR_MSG.missingParam("photoReportId"));
                assert(body.photoReportId >= 0, ERROR_MSG.noNeg("photoReportId"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            await DBInterface.removePhotoReport(req.body.photoReportId);

            res.send({});

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/plants/add",
    /**
     * @author Nathaniel Carr
     * @desc Add and return the submitted Plant to the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
                assert(body.name !== undefined, ERROR_MSG.missingParam("name"));
                assert(body.bio !== undefined, ERROR_MSG.missingParam("bio"));
                assert(body.name !== "", ERROR_MSG.missingText("name"));
                assert(body.bio !== "", ERROR_MSG.missingText("bio"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            res.send({
                plantId: await DBInterface.addPlant(new Plant(req.body.name, req.body.bio)).getId()
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/plants/byId",
    /**
     * @author Nathaniel Carr
     * @desc Return the Plant with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.plantId !== undefined, ERROR_MSG.missingParam("plantId"));
                assert(body.maxPhotos === undefined || body.maxPhotos >= 0), ERROR_MSG.noNeg("maxPhotos");
            })) { return; }

            req.body.maxPhotos = req.body.maxPhotos !== undefined ? req.body.maxPhotos : DEFAULTS.plantsMaxPhotos;

            let plant = await DBInterface.getPlant(req.body.plantId);
            let photos = await DBInterface.getTopPlantPhotos(plant.getId());
            for (let i = 0; i < photos.length; i++) {
                photos[i] = photos[i].toJSON();
            }

            res.send({
                plant: plant.toJSON(),
                photos: photos
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });


api.post("/plants/byImage",
    /**
     * @author Nathaniel Carr
     * @author Aaron Exley
     * @desc Return the Plants that best match the included image.
     * @returns {*}
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.image !== undefined, ERROR_MSG.missingParam("image"));
                assert(body.height !== undefined, ERROR_MSG.missingParam("height"));
                assert(body.width !== undefined, ERROR_MSG.missingParam("width"));
                assert(body.height > 0, ERROR_MSG.noNeg("height"));
                assert(body.width > 0, ERROR_MSG.noNeg("width"));
                assert(body.maxPhotos === undefined || body.maxPhotos >= 0), ERROR_MSG.noNeg("maxPhotos");
                // TODO check that image is valid base-64.
            })) { return; }

            req.body.maxPhotos = req.body.maxPhotos !== undefined ? req.body.maxPhotos : DEFAULTS.plantsMaxPhotos;

            let TFResults = MLIdentifier.predict(req.body.image);

            let results = [];
            for (let i = 0; i < TFResults.count; i++) {
                if (TFResults.scores[i] >= 0.3) {
                    let plant = await DBInterface.getPlant(TFResults.classes[i]);
                    let photos = await DBInterface.getTopPlantPhotos(TFResults.classes[i], 0, req.body.maxPhotos);
                    for (let j = 0; j < photos.length; j++) {
                        photos[j] = photos[j].toJSON();
                    }

                    // TODO: Verify that req.body.image has a height and width property
                    let min_y = TFResults.boxes[i][0] * req.body.height;
                    let min_x = TFResults.boxes[i][1] * req.body.width
                    let max_y = TFResults.boxes[i][2] * req.body.height;
                    let max_x = TFResults.boxes[i][3] * req.body.width;

                    results.push({
                        plant: plant,
                        photos: photos,
                        score: TFResults.scores[i],
                        topLeft: {
                            x: min_x,
                            y: min_y
                        },
                        bottomRight: {
                            x: max_x,
                            y: max_y
                        }
                    });
                }
            }

            res.send({ results: results });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/plants/byQuery",
    /**
     * @author Nathaniel Carr
     * @desc Return the Plants that best match the included query.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.query !== undefined, ERROR_MSG.missingParam("query"));
                assert(body.query !== "", ERROR_MSG.missingText("query"));
                assert(body.maxPhotos === undefined || body.maxPhotos >= 0), ERROR_MSG.noNeg("maxPhotos");
            })) { return; }

            req.body.maxPhotos = req.body.maxPhotos !== undefined ? req.body.maxPhotos : DEFAULTS.plantsMaxPhotos;

            let plants = await DBInterface.getPlantByQuery(req.body.query);
            let results = [];
            for (let i = 0; i < plants.length; i++) {
                let photos = await DBInterface.getTopPlantPhotos(plants[i].getId(), 0, req.body.maxPhotos);
                for (let j = 0; j < photos.length; j++) {
                    photos[i] = photos[i].toJSON();
                }
                results.push({
                    plant: plants[i].toJSON(),
                    photos: photos
                })
            }

            res.send({ results: results });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/plants/remove",
    /**
     * @author Nathaniel Carr
     * @desc Remove the Plant with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
                assert(body.plantId !== undefined, ERROR_MSG.missingParam("plantId"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            await DBInterface.removePlant(req.body.plantId);

            res.send({});

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/plants/update",
    /**
     * @author Nathaniel Carr
     * @desc Update the Plant with the corresponding ID.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
                assert(body.plantId !== undefined, ERROR_MSG.missingParam("plantId"));
                assert(body.bio !== undefined, ERROR_MSG.missingParam("bio"));
                assert(body.bio !== "", ERROR_MSG.missingText("bio"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            let plant = await DBInterface.getPlant(req.body.plantId);
            plant.setBio(req.body.bio);

            res.send({
                plant: await DBInterface.updatePlant(plant)
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/users/add",
    /**
     * @author Nathaniel Carr
     * @author Adam Cassidy
     * @desc Add and return the submitted User to the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
                assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            })) { return; }

            res.send({
                userId: (await DBInterface.addUser(new User(req.body.userId))).getId()
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/users/ban",
    /**
     * @author Nathaniel Carr
     * @author Adam Cassidy
     * @desc Add a new Ban to the User with the corresponding ID.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
                assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            let user = DBInterface.getUser(req.body.userId);
            await DBInterface.addBan(new Ban(user.getId(), req.body.adminId, user.nextBanExpirationDate()));

            res.send({});

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/users/byId",
    /**
     * @author Nathaniel Carr
     * @author Adam Cassidy
     * @desc Return the User with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            })) { return; }

            let user = await DBInterface.getUser(req.body.userId);

            res.send({
                user: user
            });

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/users/makeAdmin",
    /**
     * @author Nathaniel Carr
     * @author Adam Cassidy
     * @desc Make the User with the corresponding ID an Admin in the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
                assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            let user = await DBInterface.getUser(req.body.userId);
            await DBInterface.addAdmin(new Admin(user.getId(), user.getBans()));

            res.send({});

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

api.post("/users/remove",
    /**
     * @author Nathaniel Carr
     * @author Adam Cassidy
     * @desc Remove the User with the corresponding ID from the database.
     */
    async (req, res) => {
        try {
            if (!await validateParams(req, res, async (body) => {
                assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
                assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));

                assert(await DBInterface.isValidAdminId(body.adminId), ERROR_MSG.unauthorized());
            })) { return; }

            await DBInterface.removeUser(req.body.userId);

            res.send({});

        } catch (err) {
            res.send(ERROR_CODE.internalError, { message: err.message });
            console.error(err);
        }
    });

// Start running the API.
api.listen(API_PORT, () => {
    console.log(`GreenThumb API listening on port ${API_PORT}`);
});
