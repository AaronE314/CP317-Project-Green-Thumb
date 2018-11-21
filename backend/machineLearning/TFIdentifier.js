const MODEL_URL = 'path/to/tensorflowjs_model.pb';
const WEIGHTS_URL = 'path/to/weights_manifest.json';

/**
 * @module: TFIdentifier.js
 * ------------------------------------------------------------------
 * @author Aaron Exley
 * @author Justin Harrott
 * @author Jhon Duphny
 * ------------------------------------------------------------------
 * @version: 2018/11/19
 * -------------------------------------------------------------------
 * @description:
 * This class is designed to Identify a given image,
 * and return the results as an array of detections
 * It also it used to grab the appropriate images from the database for training,
 * and to call the retraining when needed.
 * -------------------------------------------------------------------
 * @requires NPM:schedulejs @link{https://bunkat.github.io/schedule/}
 * @requires NPM:later @link{http://bunkat.github.io/later/}
 * @requires NPM:tensorflow/tfjs @link{}
 * @requires NPM:canvas @link {}
 */
class TFIdentifier {

  /**
   * @author Jhon Duphny
   *
   * Add description ...
   */
  static gatherImages() {

  }

  /**
   * @author Aaron Exley
   * @async
   * 
   * Used to identify which flowers are in the given image
   *
   * @param image the image to identify, as a byte array
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
  static async predict(image) {

    const tf = require('@tensorflow/tfjs');
    require('@tensorflow/tfjs-node'); //Switch to @tensorflow/tfjs-node-gpu for gpu version

    const imageT = this._preProcessImage(image);

    const model = await tf.loadFrozenModel(MODEL_URL, WEIGHTS_URL);

    const prediction = await model.executeAsync(imageT);

    const count = prediction[3].dataSync()[0];
    const boxes = prediction[0].dataSync();
    const scores = prediction[1].dataSync();
    const classes = prediction[2].dataSync();

    return { count: count, boxes: boxes, scores: scores, classes: classes };
  }

  /**
   * @author Justin Harrott
   *
   * Add description ...
   */
  static retrain() {
    let train = require('./TFTrainer.js');

    train.trainModel();

    return
  }

  /**
   * @author Justin Harrott
   *
   * Creating a new schedule produces a JSON object. Sets scheduled call retrain
   *
   * @param {String} time written expression of when the training is to occur
   *
   * @returns {Boolean} confirms that training was scheduled
   *
   * @example let scheduled = scheduleTraining("every Sunday at 4:30am") or scheduleTraining("tomorrow at 23:59")
   */
  static scheduleTraining(time, duration) {
    let schedule = require('schedulejs');
    let later = require('later') // To make schedules easier to read/use, we use the text parser from later
    let scheduled = false;

    schedule.date.localTime();

    let projectAvailability = later.parse.text(time);

    schedule.create(); // All dates are returned as milliseconds from the Unix epoch, you can convert them to dates using - new Date(val);

    let now = new Date().toString();
    let millisTillTrain = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
    if (millisTillTrain < 0)
      millisTillTrain += 86400000; // it's after 10am, try 10am tomorrow.

    setTimeout(retrain(), millisTillTrain);

    return scheduled
  }

  /**
   * @author Jhon Duphny
   *
   * Add description ...
   */
  static _loadNewModel() {

  }

  /**
   * @author Aaron Exley
   *
   * This function is to convert the byte image into the appropriate tensor to
   * be used to predict.
   * @param image the image to predict, as a byte image
   *
   * @returns the image converted to a tensor of shape [1, width, height,3]
   */
  static _preProcessImage(image) {

    const canvas = require('canvas');

    // const blob = new Blob([image], {type: "image/jpeg"});
    // const url = URL.createObjectURL(blob);

    // const tmpCanvas = canvas.createCanvas();

    const img = new canvas.image();
    img.src = image;

    let imageT = tf.fromPixels(image);
    let imageT = imageT.expandDims(0);

    return imageT
  }

}