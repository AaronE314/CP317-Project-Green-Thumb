
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
   *
   * Add description ...
   *
   * @param image
   */
  static predict(image) {

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

    var schedule = require('schedulejs');
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
   * Add description ...
   * @param image
   */
  static _preProcessImage(images) {

  }

}
