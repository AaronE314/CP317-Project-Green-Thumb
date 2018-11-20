/**@abstract
 *
 * @license
 * Copyright 2018 Project Green Thumb. All Rights Reserved.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *
 * @author Aaron Exley
 * @author Justin Harrott
 * @author John Dunphy
 *
 * @description This class is designed to Identify a given image,
 * and return the results as an array of detections
 *
 * @requires NPM:node-schedule @link{https://www.npmjs.com/package/node-schedule}
 * @requires NPM:tensorflow/tfjs @link{}
 * @requires NPM:canvas @link {}
 */

const MODEL_URL = 'path/to/tensorflowjs_model.pb';
const WEIGHTS_URL = 'path/to/weights_manifest.json';
let scheduledItems = []
class TFIdentifier {

  /**
   * @author John Dunphy
   *
   * @description gathers all images from the database and converts them to a form
   * that the ai can read.
   *
   * @returns an array of images where each photo is stored in the array at id-1
   * for any given photo id.
   */
  static gatherImages() {
    var id = 1;
    var plants [];
    var picture = getPhoto(i);
    while (picture != null) {
      plants.push(_preProcessImage(picture));
      i++;
      picture = getPhoto(i);
    }
    return plants;
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
   * calls trainModel function from TFTrainer.js
   *
   * @param {Number} duration length of training period in hours; default 8 hours
   */
  static retrain(duration) {
    let train = require('./TFTrainer.js');

    train.trainModel(duration);

    return
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
   * @example let scheduled = scheduleTraining("1:2018:10:04:04:20:2");
   *      - will schedule 2 hours of training every Sunday, at 4:20 AM, starting Nov. 4, 2018.
   */
  static scheduleTraining(newItem) {
    let id = scheduledItems.length == 0 ? 1 : scheduledItems[scheduledItems.length - 1].id + 1; // ID's start at 1, otherwise +1 to the last element's ID

    let item = newItem.split(":");

    let schedObj = {
      id: id,
      repeat: item[0],
      startDate: [item[1], item[2], item[3]], // [ YYYY, MO, DD ]
      hr: item[4],
      min: item[5],
      duration: item[6]
    };

    scheduledItems.push(schedObj);

    var sched = require('node-schedule');
    let schedDate = new Date(item[1], item[2], item[3], item[4], item[5], 0);

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
    let schedStr = schedObj.repeat == 0 ? schedDate : schedObj.min + " " + schedObj.hr + " * * " + schedDate.getDay();

    sched.schedule(schedStr, () => {
      retrain(schedObj.duration);
    });

    return
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
