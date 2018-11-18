/**
 * Module: api.js
 * ------------------------------------------------------------------
 * Authors: Nathaniel Carr, Aaron Exley
 * ------------------------------------------------------------------
 * Last Update: 2018/11/17
 * -------------------------------------------------------------------
 * Description:
 * Runs backend API.
 * -------------------------------------------------------------------
 * References:
 * - express.js docs: https://expressjs.com/en/4x/api.html
 */

// Constants.
const assert = require("assert");
const API_PORT = 2500;
const DEFAULTS = {
    plantsMaxPhotos: 3,
};
const STUB_HELPER = {
    images: [
        "https://www.catster.com/wp-content/uploads/2017/12/A-gray-kitten-meowing.jpg",
        "https://d3pz1jifuab5zg.cloudfront.net/2015/09/04194922/kitten-walking-150904.jpg",
        "https://www.dejohnpetservices.com/wp-content/uploads/cats-animals-kittens-background.jpg",
        "https://www.petwave.com/-/media/Images/Center/Care-and-Nutrition/Cat/Kittensv2/Kitten-2.ashx?w=450&hash=1D0CFABF4758BB624425C9102B8209CCF8233880",
        "http://static1.squarespace.com/static/54e8ba93e4b07c3f655b452e/589b53f917bffcb8cefc8eef/5ab090f48a922d6ee3b9b805/1523848316782/Kitten.jpg?format=1000w",
        "https://www.puppyleaks.com/wp-content/uploads/2017/09/puppysmile.png",
        "https://www.petmd.com/sites/default/files/petmd-shaking-puppy.jpg",
        "https://images.mentalfloss.com/sites/default/files/styles/mf_image_16x9/public/istock-598825938.png?itok=yAcHEsp2&resize=1100x1100",
        "http://2.bp.blogspot.com/-RUkL7sMWo5I/TaYPRpEbM-I/AAAAAAAAKNk/LIqHQwGZyJc/s1600/cutest%2Bpuppy.jpg",
        "https://cdn2-www.dogtime.com/assets/uploads/2015/05/file_21702_impossibly-cute-puppy-30.jpg",
        "http://eskipaper.com/images/small-cute-bunny-1.jpg",
        "http://www.cutestpaw.com/wp-content/uploads/2015/05/Cute-a-bunny.jpg",
        "https://netherlanddwarfbunny.com/wp-content/uploads/2017/09/netherland-dwarf-bunny-cute-and-irresistible.jpg",
        "https://specieslove.files.wordpress.com/2011/08/owl_duck1.jpg",
    ],
    randImage: () => { // select random image.
        return STUB_HELPER.images[parseInt((Math.random() * (STUB_HELPER.images.length)))];
    },
    randVoteArr: (up) => { // generate random vote array.
        let arr = [];
        let num = parseInt(Math.random() * 100);
        for (let i = 0; i < num; i++) {
            arr[arr.length] = parseInt(parseInt(Math.random() * 10000)) * 2 + (up ? 1 : 0);
        }
        return arr.sort((a, b) => a - b);
    },
    reportText: [
        "delet this.",
        "ANGERY.",
        "Sample text.",
        "WAHHHH!!!"
    ],
    randReportText: () => {
        return STUB_HELPER.reportText[parseInt((Math.random() * (STUB_HELPER.reportText.length)))]
    },
    plantBios: [
        "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father paid good money for those. Sorry. I'm excited. Here's the graduate. We're very proud of you, son. A perfect report card, all B's. Very proud. Ma! I got a thing going here. - You got lint on your fuzz. - Ow! That's me! - Wave to us! We'll be in row 118,000. - Bye! Barry, I told you, stop flying in the house! - Hey, Adam. - Hey, Barry...",
        "What do you get if you divide the circumference of a pumpkin by its diameter? / Pumpkin pi.",
        "What do you call a stolen yam? / A hot potato.",
        '"Bulb: potential flower buried in Autumn, never to be seen again." -  Henry Beard',
        '"I have a rock garden.  Last week three of them died." -  Richard Diran'
    ],
    randPlantBio: () => {
        return STUB_HELPER.plantBios[parseInt(Math.random() * (STUB_HELPER.plantBios.length))];
    }
};
const ERROR_MSG = {
    missingParam: (param) => { return `Missing required '${param}' parameter in request body.`; },
    invalidParam: (param) => { return `Parameter '${param}' is invalid.`; },
    unauthorized: () => { return `User is not authorized to perform this action.`; },
    missingText: (param) => { return `Parameter '${param}' must be a non-empty String.`; },
    noNeg: (param) => { return `Parameter '${param}' may not be negative.`; },
    noPos: (param) => { return `Parameter '${param}' may not be positive.`; },
    onlyNeg: (param) => { return `Parameter '${param}' must be negative.`; },
    onlyPos: (param) => { return `Parameter '${param}' must be positive.`; },
};
const ERROR_CODE = {
    badRequest: 400,
    unauthorized: 401,
    internalError: 500
};

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
function validateParams(req, res, checkFunc) {
    try {
        if (req.body !== undefined && checkFunc !== undefined) {
            checkFunc(req.body);
        }
        return true;
    } catch (err) {
        if (err instanceof (assert.AssertionError)) { // If an internal error, don't say it was a bad request.
            res.send(ERROR_CODE.badRequest, err.message ? { message: err.message } : null);
        } else {
            res.send(ERROR_CODE.internalError);
            console.error(err.message);
        }
        return false;
    }
}

/**
 * @author Nathaniel Carr
 * @desc Add and return the submitted Photo to the database.
 */
api.post("/photos/add", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            assert(body.plantId !== undefined, ERROR_MSG.missingParam("plantId"));
            assert(body.image !== undefined, ERROR_MSG.missingParam("image"));
            assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            assert(body.plantId >= 0, ERROR_MSG.noNeg("plantId"));
            // TODO check that the userId is valid.
            // TODO check that the plantId is valid.
            // TODO check that the image is valid.
        })) { return; }

        res.send({
            photo: {
                id: parseInt(Math.random() * 10000),
                plantId: req.body.photoId,
                userId: req.body.userId,
                upvoteIds: [],
                downvoteIds: [],
                uploadDate: new Date(),
                image: req.body.image
            }
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Return the Photo with the corresponding ID from the database.
 */
api.post("/photos/byId", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.photoId !== undefined, ERROR_MSG.missingParam("photoId"));
            assert(body.photoId >= 0, ERROR_MSG.noNeg("photoId"));
            // TODO check that the photoId is valid.
        })) { return; }

        res.send({
            photo: {
                id: req.body.photoId,
                plantId: parseInt(Math.random() * 10000),
                userId: parseInt(Math.random() * 10000),
                upvoteIds: STUB_HELPER.randVoteArr(true),
                downvoteIds: STUB_HELPER.randVoteArr(false),
                uploadDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 1),
                image: STUB_HELPER.randImage()
            }
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
        return;
    }
});

/**
 * @author Nathaniel Carr
 * @desc Return the requested number of Photos (desc. sorted by date) from the database, including options for Photos from a specific User or Photos of a specifid Plant.
 */
api.post("/photos/list/byDate", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.startIndex !== undefined, ERROR_MSG.missingParam("startIndex"));
            assert(body.max !== undefined, ERROR_MSG.missingParam("max"));
            assert(body.startIndex >= 0, ERROR_MSG.noNeg("startIndex"));
            assert(body.max > 0, ERROR_MSG.onlyPos("max"));
            assert(body.plantId === undefined || body.plantId >= 0, ERROR_MSG.noNeg("plantId"));
            assert(body.userId === undefined || body.userId >= 0, ERROR_MSG.noNeg("userId"));
            // TODO check that the plantId is valid if given.
            // TODO check that the userId is valid if given.
        })) { return; }

        let photos = [];
        for (let i = req.body.startIndex; i < STUB_HELPER.images.length && photos.length < req.body.max; i++) {
            photos[photos.length] = {
                id: parseInt(Math.random() * 10000),
                plantId: req.body.plantId !== undefined ? req.body.plantId : parseInt(Math.random() * 10000),
                userId: req.body.userId !== undefined ? req.body.userId : parseInt(Math.random() * 10000),
                upvoteIds: STUB_HELPER.randVoteArr(true),
                downvoteIds: STUB_HELPER.randVoteArr(false),
                uploadDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 1),
                image: STUB_HELPER.images[(req.body.startIndex + i)]
            }
        }
        photos.sort((a, b) => { return b.uploadDate.getTime() - a.uploadDate.getTime(); });

        res.send({
            photos: photos
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Return the requested number of Photos (desc. sorted by rating) from the database, including options for Photos from a specific User or Photos of a specifid Plant.
 */
api.post("/photos/list/byRating", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.startIndex !== undefined, ERROR_MSG.missingParam("startIndex"));
            assert(body.max !== undefined, ERROR_MSG.missingParam("max"));
            assert(body.startIndex >= 0, ERROR_MSG.noNeg("startIndex"));
            assert(body.max > 0, ERROR_MSG.onlyPos("max"));
            assert(body.plantId === undefined || body.plantId >= 0, ERROR_MSG.noNeg("plantId"));
            assert(body.userId === undefined || body.userId >= 0, ERROR_MSG.noNeg("userId"));
            // TODO check that the plantId is valid if given.
            // TODO check that the userId is valid if given.
        })) { return; }

        let photos = [];
        for (let i = req.body.startIndex; i < STUB_HELPER.images.length && photos.length < req.body.max; i++) {
            photos[photos.length] = {
                id: parseInt(Math.random() * 10000),
                plantId: req.body.plantId !== undefined ? req.body.plantId : parseInt(Math.random() * 10000),
                userId: req.body.userId !== undefined ? req.body.userId : parseInt(Math.random() * 10000),
                upvoteIds: STUB_HELPER.randVoteArr(true),
                downvoteIds: STUB_HELPER.randVoteArr(false),
                uploadDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 1),
                image: STUB_HELPER.images[(req.body.startIndex + i)]
            }
        }
        photos.sort((a, b) => { return (a.upvoteIds.length - a.downvoteIds.length) - (b.upvoteIds.length - b.downvoteIds.length); });

        res.send({
            photos: photos.sort()
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Remove the Photo with the corresponding ID from the database.
 */
api.post("/photos/remove", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            assert(body.photoId !== undefined, ERROR_MSG.missingParam("photoId"));
            assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            assert(body.photoId >= 0, ERROR_MSG.noNeg("photoId"));
            // TODO check that the userId is valid.
            // TODO check that the plantId is valid.
            // TODO check that the specified Photo belongs to the specified User.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Add and return the submitted PhotoReport to the database.
 */
api.post("/photoReports/add", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            assert(body.photoId !== undefined, ERROR_MSG.missingParam("photoId"));
            assert(body.reportText !== undefined, ERROR_MSG.missingParam("reportText"));
            assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            assert(body.photoId >= 0, ERROR_MSG.noNeg("photoId"));
            // TODO check that the userId is valid.
            // TODO check that the photoId is valid.
        })) { return; }

        res.send({
            photoReport: {
                id: parseInt(Math.random() * 2),
                adminAction: undefined,
                adminId: undefined,
                userId: req.body.userId,
                reportText: req.body.reportText,
                handleDate: undefined,
                reportDate: new Date()
            }
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Return the PhotoReport with the corresponding ID from the database.
 */
api.post("/photoReports/byId", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.photoReportId !== undefined, ERROR_MSG.missingParam("photoReportId"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.photoReportId >= 0, ERROR_MSG.noNeg("photoReportId"));
            // TODO check that the adminId belongs to an admin.
            // TODO check that the photoReportId is valid.
        })) { return; }

        if (parseInt(Math.random() * 2)) { // Some reports will not have been handled.
            res.send({
                photoReport: {
                    id: req.body.photoReportId,
                    adminAction: parseInt(Math.random() * 2),
                    adminId: parseInt(Math.random() * 10000),
                    userId: parseInt(Math.random() * 10000),
                    reportText: STUB_HELPER.randReportText(),
                    handleDate: new Date(new Date().getTime() - 1),
                    reportDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 2),
                }
            });
        } else {
            res.send({
                photoReport: {
                    id: req.body.photoReportId,
                    adminAction: undefined,
                    adminId: undefined,
                    userId: parseInt(Math.random() * 10000),
                    reportText: STUB_HELPER.randReportText(),
                    handleDate: undefined,
                    reportDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 2),
                }
            });
        }
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Handle the PhotoReport with the corresponding ID.
 */
api.post("/photoReports/handle", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.photoReportId !== undefined, ERROR_MSG.missingParam("photoReportId"));
            assert(body.adminAction !== undefined, ERROR_MSG.missingParam("adminAction"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.adminAction >= 0, ERROR_MSG.noNeg("adminAction"));
            assert(body.adminAction >= 0 && req.body.adminAction <= 2, ERROR_MSG.invalidParam("adminAction"));
            // TODO check if adminAction valid properly (right now, just checks if between 0 and 2 - the enum range).
            // TODO check that adminId belongs to an admin.
            // TODO check that photoReportId is valid.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Return the requested number of PhotoReports (asc. sorted by date) from the database, including options for PhotoReports judged by a specific Admin or unhandled PhotoReports.
 */
api.post("/photoReports/list/byDate", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.startIndex !== undefined, ERROR_MSG.missingParam("startIndex"));
            assert(body.max !== undefined, ERROR_MSG.missingParam("max"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.handledBy === undefined || body.handledBy >= 0, ERROR_MSG.noNeg("handledBy"));
            assert(body.startIndex >= 0, ERROR_MSG.noNeg("startIndex"));
            assert(body.max > 0, ERROR_MSG.onlyPos("max"));
            assert(!(body.handledBy !== undefined && body.unhandledOnly === true), `Parameter 'unhandledOnly' must be false if parameter 'handledBy' is not undefined.`);
            // TODO check that adminId belongs to an admin.
        })) { return; }

        req.body.unhandledOnly = req.body.unhandledOnly || false;

        let photoReports = [];
        let maxNumReports = parseInt(Math.random() * 14) + 6;
        for (let i = req.body.startIndex; i < maxNumReports && photoReports.length < req.body.max; i++) {
            let handled = !req.body.unhandledOnly && parseInt(Math.random() * 2);
            photoReports[photoReports.length] = {
                id: parseInt(Math.random() * 10000),
                adminAction: handled ? parseInt(Math.random() * 2) : undefined,
                adminId: handled ? (req.body.handledBy !== undefined ? req.body.handledBy : parseInt(Math.random() * 10000)) : undefined,
                userId: parseInt(Math.random() * 10000),
                reportText: STUB_HELPER.randReportText(),
                handleDate: handled ? new Date(new Date().getTime() - 1) : undefined,
                reportDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 2),
            }
        }
        photoReports.sort((a, b) => { return a.reportDate.getTime() - b.reportDate.getTime(); });

        res.send({
            photoReports: photoReports
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Remove the PhotoReport with the corresponding ID from the database.
 */
api.post("/photoReports/remove", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.photoReportId !== undefined, ERROR_MSG.missingParam("photoReportId"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.photoReportId >= 0, ERROR_MSG.noNeg("photoReportId"));
            // TODO check that adminId belongs to an admin.
            // TODO check that photoReportId is valid.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Add and return the submitted Plant to the database.
 */
api.post("/plants/add", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.name !== undefined, ERROR_MSG.missingParam("name"));
            assert(body.bio !== undefined, ERROR_MSG.missingParam("bio"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.name !== "", ERROR_MSG.missingText("name"));
            assert(body.bio !== "", ERROR_MSG.missingText("bio"));
            // TODO check that adminId belongs to an admin.
            // TODO check that no plant with the same name exists.
        })) { return; }

        res.send({
            plant: {
                id: parseInt(Math.random() * 10000),
                name: req.body.name,
                bio: req.body.bio,
                photos: []
            }
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Return the Plant with the corresponding ID from the database.
 */
api.post("/plants/byId", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.plantId !== undefined, ERROR_MSG.missingParam("plantId"));
            assert(body.plantId >= 0, ERROR_MSG.noNeg("plantId"));
            assert(body.maxPhotos === undefined || body.maxPhotos >= 0), ERROR_MSG.noNeg("maxPhotos");
            // TODO check that the plantId is valid.
        })) { return; }

        req.body.maxPhotos = req.body.maxPhotos !== undefined ? req.body.maxPhotos : DEFAULTS.plantsMaxPhotos;
        let photos = [];
        for (let i = 0; photos.length < req.body.maxPhotos && i < STUB_HELPER.images.length; i++) {
            photos[photos.length] = {
                id: parseInt(Math.random() * 10000),
                plantId: req.body.plantId,
                userId: parseInt(Math.random() * 10000),
                upvoteIds: STUB_HELPER.randVoteArr(true),
                downvoteIds: STUB_HELPER.randVoteArr(false),
                uploadDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 1),
                image: STUB_HELPER.images[i]
            }
        }
        photos.sort((a, b) => { return (a.upvoteIds.length - a.downvoteIds.length) - (b.upvoteIds.length - b.downvoteIds.length); });

        res.send({
            plant: {
                id: req.body.plantId,
                name: "Sample text",
                bio: STUB_HELPER.randPlantBio(),
                photos: photos
            }
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @author Aaron Exley
 * @desc Return the Plants that best match the included image.
 * 
 * @returns return results in the form
 *          results [
 *              plant: Plant,
 *              photos: Photos[3],
 *              score: flaot,
 *              topLeft: {x, y},
 *              bottomRight: {x, y}
 *          ]
 */
api.post("/plants/byImage", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.image !== undefined, ERROR_MSG.missingParam("image"));
            assert(body.maxPhotos === undefined || body.maxPhotos >= 0), ERROR_MSG.noNeg("maxPhotos");
            // TODO check that image is valid.
        })) { return; }

        req.body.maxPhotos = req.body.maxPhotos !== undefined ? req.body.maxPhotos : DEFAULTS.plantsMaxPhotos;

        const MLIdentifier = require('../machineLearning/MLIdentifier.js');

        const TFResults = await MLIdentifier.predict(req.body.image);

        let plants = [];

        for (let i = 0; i < TFResults.numResults; i++) {
            plants.push(DBInterface.getPhoto(TFResults.classes[i]));
        }

        let photos = [];
        for (let i = 0; i < plants.length; i++) {
            photos.push(DBInterface.getTopPlantPhotos(plants[i].getID(), 0, 2));
        }

        let results = [];

        for (let i = 0; i < TFResults.numResults; i++) {

            const min_y = TFResults.boxes[i * 4] * req.body.image.height; //dont know if this property exists, hopefully it does
            const min_x = TFResults.boxes[i * 4 + 1] * req.body.image.width
            const max_y = TFResults.boxes[i * 4 + 2] * req.body.image.height;
            const max_x = TFResults.boxes[i * 4 + 3] * req.body.image.width;

            let result = {
                plant: plants[i],
                photos: photos[i],
                score: TFResults.scores[i],
                topLeft: {x: min_x, y: min_y},
                bottomRight: {x: max_x, y: max_y}
            };

            results.push(result);
        }

        // let plants = [];
        // let numPlants = parseInt(Math.random() * 10);
        // for (let i = 0; i < numPlants; i++) {
        //     let photos = [];
        //     let plantId = parseInt(Math.random() * 10000);
        //     for (let j = 0; photos.length < req.body.maxPhotos && j < STUB_HELPER.images.length; j++) {
        //         photos[photos.length] = {
        //             id: parseInt(Math.random() * 10000),
        //             plantId: plantId,
        //             userId: parseInt(Math.random() * 10000),
        //             upvoteIds: STUB_HELPER.randVoteArr(true),
        //             downvoteIds: STUB_HELPER.randVoteArr(false),
        //             uploadDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 1),
        //             image: STUB_HELPER.images[i]
        //         }
        //     }
        //     photos.sort((a, b) => { return (a.upvoteIds.length - a.downvoteIds.length) - (b.upvoteIds.length - b.downvoteIds.length); });
        //     plants[i] = {
        //         id: parseInt(Math.random() * 10000),
        //         name: "Sample text",
        //         bio: STUB_HELPER.randPlantBio(),
        //         photos: photos

        //     }
        // }

        res.send({results: results});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Return the Plants that best match the included query.
 */
api.post("/plants/byQuery", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.query !== undefined, ERROR_MSG.missingParam("query"));
            assert(body.query !== "", ERROR_MSG.missingText("query"));
            assert(body.maxPhotos === undefined || body.maxPhotos >= 0), ERROR_MSG.noNeg("maxPhotos");
        })) { return; }

        req.body.maxPhotos = req.body.maxPhotos !== undefined ? req.body.maxPhotos : DEFAULTS.plantsMaxPhotos;

        let plants = [];
        let numPlants = parseInt(Math.random() * 10);
        for (let i = 0; i < numPlants; i++) {
            let photos = [];
            let plantId = parseInt(Math.random() * 10000);
            for (let j = 0; photos.length < req.body.maxPhotos && j < STUB_HELPER.images.length; j++) {
                photos[photos.length] = {
                    id: parseInt(Math.random() * 10000),
                    plantId: plantId,
                    userId: parseInt(Math.random() * 10000),
                    upvoteIds: STUB_HELPER.randVoteArr(true),
                    downvoteIds: STUB_HELPER.randVoteArr(false),
                    uploadDate: new Date(new Date().getTime() - parseInt(Math.random() * 365 * 24 * 60 * 60 * 1000) - 1),
                    image: STUB_HELPER.images[i]
                }
            }
            photos.sort((a, b) => { return (a.upvoteIds.length - a.downvoteIds.length) - (b.upvoteIds.length - b.downvoteIds.length); });
            plants[i] = {
                id: parseInt(Math.random() * 10000),
                name: "Sample text",
                bio: STUB_HELPER.randPlantBio(),
                photos: photos

            }
        }

        res.send({
            plants: plants
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Remove the Plant with the corresponding ID from the database.
 */
api.post("/plants/remove", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.plantId !== undefined, ERROR_MSG.missingParam("plantId"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.plantId >= 0, ERROR_MSG.noNeg("plantId"));
            // TODO check that the adminId belongs to an admin.
            // TODO check that the plantId is valid.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Update the Plant with the corresponding ID.
 */
api.post("/plants/update", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.plantId !== undefined, ERROR_MSG.missingParam("plantId"));
            assert(body.bio !== undefined, ERROR_MSG.missingParam("bio"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.plantId >= 0, ERROR_MSG.noNeg("plantId"));
            assert(body.bio !== "", ERROR_MSG.missingText("bio"));
            // TODO check that the adminId belongs to an admin.
            // TODO check that the plantId is valid.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Retrain the machine learning model immediately.
 */
api.post("/mlModel/training/immediate", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            // TODO check that the adminId belongs to an admin.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Add and return the submitted User to the database.
 */
api.post("/users/add", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            // TODO check that no user with the given userId exists.
        })) { return; }

        res.send({
            user: {
                admin: false,
                bans: [],
                id: parseInt(Math.random() * 10000)
            }
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Add a new ban to the User with the corresponding ID.
 */
api.post("/users/ban", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            // TODO check that the adminId belongs to an admin.
            // TODO check that the userId is valid.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Return the User with the corresponding ID from the database.
 */
api.post("/users/byId", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            // TODO check that the userId is valid.
        })) { return; }

        let bans = [];
        if (parseInt(Math.random() * 2)) {
            let num = parseInt(Math.random() * 3);
            for (let i = 0; i < num; i++) {
                bans[bans.length] = {
                    adminId: parseInt(Math.random() * 10000),
                    expiration: new Date(new Date().getTime() + parseInt(Math.random() * 1000 * 60 * 60 * 24 * 365))
                }
            }
        }

        res.send({
            user: {
                admin: parseInt(Math.random() * 25) == 0,
                bans: bans,
                id: req.body.userId
            }
        });
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Make the User with the corresponding ID an Admin in the database.
 */
api.post("/users/makeAdmin", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            // TODO check that the adminId belongs to an admin.
            // TODO check that the userId is valid.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

/**
 * @author Nathaniel Carr
 * @desc Remove the User with the corresponding ID from the database.
 */
api.post("/users/remove", (req, res) => {
    try {
        if (!validateParams(req, res, (body) => {
            assert(body.adminId !== undefined, ERROR_MSG.missingParam("adminId"));
            assert(body.userId !== undefined, ERROR_MSG.missingParam("userId"));
            assert(body.adminId >= 0, ERROR_MSG.noNeg("adminId"));
            assert(body.userId >= 0, ERROR_MSG.noNeg("userId"));
            // TODO check that the adminId belongs to an admin.
            // TODO check that the userId is valid.
        })) { return; }

        res.send({});
    } catch (err) {
        res.send(ERROR_CODE.internalError);
        console.error(err.message);
    }
});

// Start running the API.
api.listen(API_PORT, () => {
    console.log(`GreenThumb API listening on port ${API_PORT}`);
});