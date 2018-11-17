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
 * @author Jhon Duphny
 *
 * @description This class is designed to Identify a given image,
 * and return the results as an array of detections
 *
 * @requires NPM:schedulejs @link{https://bunkat.github.io/schedule/}
 * or
 * @requires NPM:later @link{http://bunkat.github.io/later/}
 * (both very similar, just determining which will suit our needs best)
 * 
 * @requires NPM:tensorflow/tfjs @link{}
 * 
 * @requires NPM:canvas @link {}
 */

const MODEL_URL = 'path/to/tensorflowjs_model.pb';
const WEIGHTS_URL = 'path/to/weights_manifest.json';
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
  static predict(image) {

    const tf = require('@tensorflow/tfjs');
    require('@tensorflow/tfjs-node'); //Switch to @tensorflow/tfjs-node-gpu for gpu version

    const imageT = this._preProcessImage(image);

    const model = await tf.loadFrozenModel(MODEL_URL, WEIGHTS_URL);

    const prediction = await model.executeAsync(imageT);

    const count = prediction[3].dataSync()[0];
    const boxes = prediction[0].dataSync();
    const scores = prediction[1].dataSync();
    const classes = prediction[2].dataSync();

    return {count: count, boxes: boxes, scores: scores, classes: classes};
  }

  /**
   * @author Justin Harrott
   *
   * Add description ...
   */
  static retrain() {

  }

  /**
   * @author Justin Harrott
   *
   * sets schedule to call retrain
   *
   * @param {String} time time and day (of week/month)
   * @param {Boolean} repeat optional param, default false
   *
   * @returns {Boolean} confirms that scheduling was set
   */
  static scheduleTraining(time, repeat) {
    repeat = typeof given !== 'undefined' ? repeat : false;

    let schedule = require('schedulejs');
    //var later = require('later');


    return false

  }

  // I don't think I'll need this, but am keeping it here for now, just in case.
  //
  // /**
  //  * @author Justin Harrott
  //  *
  //  * Creates ScheduleTask object to be used for scheduling
  //  *
  //  * @param {Array} time
  //  * @param {Boolean} repeat
  //  *
  //  * @returns task object literal
  //  */
  // static _scheduleTask(time, repeat) {
  //   let task = {
  //     date: something,
  //     repeat: something
  //   }

  //   return
  // }


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
   * @returns the image converted to a tensor of shape [1, width, height, 3]
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
