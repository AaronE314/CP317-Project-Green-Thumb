
/**@abstract
 *
 * @license
 * Copyright 2018 Sir Juggeth Ent. All Rights Reserved.
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
 * @requires NPM:node-cron @link{https://www.npmjs.com/package/node-cron}
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
   * @param {string} time time and day (of week/month) in Cron format(* * * * * *)
   # ┌────────────── second (optional)
   # │ ┌──────────── minute
   # │ │ ┌────────── hour
   # │ │ │ ┌──────── day of month
   # │ │ │ │ ┌────── month
   # │ │ │ │ │ ┌──── day of week
   # │ │ │ │ │ │
   # │ │ │ │ │ │
   # * * * * * *
   * @param {boolean} repeat optional param, default true
   *
   * @returns {boolean} confirms that scheduling was set
   */
  static scheduleTraining(time, repeat) {
    repeat = typeof given !== 'undefined' ? repeat : true;

    return false

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
   * Add description ...
   * @param image
   */
  static _preProcessImage(images) {

  }

}
