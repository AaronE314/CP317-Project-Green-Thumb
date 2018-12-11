const TEMP_ENCODED_LOC = "backend/machineLearning/tmp/encodedImage";
let _scheduledItems = [];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * @module: MLIdentifier.js
 * ------------------------------------------------------------------
 * @author Aaron Exley
 * @author Justin Harrott
 * @author John Dunphy
 * ------------------------------------------------------------------
 * @version: 2018/11/19
 * -------------------------------------------------------------------
 * @description:
 * This class is designed to Identify a given image,
 * and return the results as an array of detections
 * It also it used to grab the appropriate images from the database for training,
 * and to call the retraining when needed.
 * -------------------------------------------------------------------
 * @requires NPM:node-schedule @link{https://www.npmjs.com/package/node-schedule}
 * @requires NPM:child_process @link {https://www.npmjs.com/package/child_process}
 * @requires NPM:fs @link {https://www.npmjs.com/package/fs}
 */
class MLIdentifier {

    /**
     * @author John Dunphy
     *
     * @description gathers all images from the database to be used in indentificaction
     *
     * @returns an array of images where each photo is stored in the array at id-1
     * for any given photo id.
     */
    static gatherImages() {

        const db = require('../db/DBInterface.js');
        var id = 1;
        var plants = [];
        var picture = db.getPhoto(i);
        while (picture != null) {
            plants.push(picture);
            i++;
            picture = db.getPhoto(i);
        }
        return plants;
    }

    /**
     * @author Aaron Exley
     *
     * Used to identify which flowers are in the given image
     *
     * @param {Base64 ByteString} image the image to identify, as a byte array
     *
     * @returns the results of the prediction in the form
     *          {numResults: int, boxes: float[400], scores: float[100], classes: int[100]}
     *          - numResults: an int that indicates the amount of objects identified
     *          - boxes: an array of size 400, which the first 4*numResults elements are associated with the
     *                   bounding boxes around the objects identified. They are in a decimal form which indicates
     *                   the percent of the width or height the point is. The four points for each object i can be
     *                   found using:
     *                   - minY = boxes[i * 4]
     *                   - minX = boxes[i * 4 + 1]
     *                   - maxY = boxes[i * 4 + 2]
     *                   - maxX = boxes[i * 4 + 3]
     *          - scores: an array of floats in which the first numResults elements indicated the percent confidence of each prediction i.
     *          - classes: an array of ints in which the first numResults elements indicate the id of the class that was predicted (ie. 1 = rose)
     */
    static predict(image) {

        const child_process = require("child_process");
        const fs = require('fs');
        const path = require('path');

        let filePath = path.resolve(__dirname, TEMP_ENCODED_LOC);
        fs.writeFileSync(path.resolve(filePath, image));

        const data = child_process.execSync(`python MLExecutor.py ${filePath}`);

        const output = JSON.parse("[" + data.toString() + "]");

        const count = output[3];
        const boxes = output[0];
        const scores = output[1];
        const classes = output[2];

        return { count: count, boxes: boxes, scores: scores, classes: classes };
    }

    /**
     * @author Justin Harrott
     *
     * calls trainModel function from MLTrainer.js
     *
     * @param {Number} duration length of training period in hours; default 8 hours
     */
    static retrain(duration) {
        let train = require('./MLTrainer.js');

        train.trainModel(duration);

    }

    /**
     * @author Justin Harrott
     *
     * Creating a new schedule produces a JSON object. Sets scheduled call retrain
     *
     * @param {String} newItem R:YYYY:MO:DD:HH:MM:D format
     * R = REPEAT: 0 for no repeats, 1 for weekly repeat
     * YYYY = YEAR: 4 digit year
     * MO = MONTH: 2 digit month; Jan = 00 ... Dec = 11
     * DD = DAY OF MONTH: 2 digit day of the month; from 1-31
     * HH = HOUR: 2 digit, 24 hour format; from 00-23
     * MM = MINUTES: 2 digit, 60 minute format; from 00-59
     * D = DURATION: 1 digit length of training period in hours
     *
     * @returns id of the scheduled object
     *
     * @example let scheduled = scheduleTraining("1:2018:10:04:04:20:2");
     *      - will schedule 2 hours of training every Sunday, at 4:20 AM, starting Nov. 4, 2018.
     */
    static scheduleTraining(newItem) {
        let id = _scheduledItems.length == 0 ? 1 : _scheduledItems[_scheduledItems.length - 1].id + 1; // ID's start at 1, otherwise +1 to the last element's ID

        let item = newItem.split(":");

        let schedule = require('node-schedule');
        // node-cron syntax
        // # ┌────────────── second (optional)
        // # │ ┌──────────── minute
        // # │ │ ┌────────── hour
        // # │ │ │ ┌──────── day of month
        // # │ │ │ │ ┌────── month
        // # │ │ │ │ │ ┌──── day of week
        // # │ │ │ │ │ │
        // # │ │ │ │ │ │
        // # * * * * * *
        //
        // Date syntax
        // Date(YYYY, MM, DD, HH, MM, SS, NS)
        let schedDate = new Date(item[1], item[2], item[3], item[4], item[5], 0);
        //let schedStr = item[0] == 0 ? schedDate : item[5] + " " + item[4] + " * * " + schedDate.getDay();
        let schedStr = item[5] + " " + item[4] + " * * " + schedDate.getDay();

        let job = schedule.scheduleJob(schedStr, MLIdentifier.retrain.bind(Number(item[6])));

        let schedObj = {
          id: id,
          repeat: item[0],
          startDate: [item[1], item[2], item[3]], // [ YYYY, MO, DD ]
          hr: item[4],
          min: item[5],
          duration: item[6],
          sched: job
        };

        _scheduledItems.push(schedObj);

        return schedObj.id;
    }

    /**
     * @author Justin Harrott
     *
     * cancels a scheduled training time
     *
     * @param {String} idGiven unique id of scheduled training object
     * 
     * @returns string description of cancelled item's information, else -1
     */
    static cancelScheduledTrain(idGiven) {
        let confirmation = -1;
        let pos = _scheduledItems.findIndex(item => item.id === idGiven);

        if (pos != -1) {
            let removedItem = _scheduledItems.splice(pos, 1)[0];
            removedItem.sched.cancel();

            let dat = new Date(removedItem.startDate[0], removedItem.startDate[1], removedItem.startDate[2], removedItem.hr, removedItem.min, 0, 0);
            let d = dat.getDay();
            confirmation = ('Training ID: ' + removedItem.id + ', next scheduled for ' + DAYS[d] + ' @ ' + removedItem.hr + ':' + removedItem.min + ', was cancelled and removed from all future schedules.');
            console.log(confirmation);
        }

        return confirmation
    }

    // /**
    //  * @author John Dunphy
    //  * @deprecated
    //  * Add description ...
    //  */
    // static _loadNewModel() {
    //     //unused
    // }

    // /**
    //  * @author Aaron Exley
    //  *
    //  * This function is to convert the byte image into the appropriate tensor to
    //  * be used to predict.
    //  * @param {Base64 ByteString} image the image to predict, as a byte image
    //  *
    //  * @returns the image converted to a tensor of shape [1, width, height,3]
    //  * @deprecated
    //  */
    // static _preProcessImage(image) {

    //   const canvas = require('canvas');

    //   // const blob = new Blob([image], {type: "image/jpeg"});
    //   // const url = URL.createObjectURL(blob);

    //   // const tmpCanvas = canvas.createCanvas();

    //   const img = new canvas.image();
    //   img.src = image;

    //   let imageT = tf.fromPixels(image);
    //   let imageT = imageT.expandDims(0);

    //   return imageT
    // }

}

MLIdentifier._scheduledItems = _scheduledItems;
module.exports = MLIdentifier;

MLIdentifier.predict();