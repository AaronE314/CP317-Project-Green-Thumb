/**
 * @desc The Photo class.
 * @author Adam Cassidy
 */
class Photo {
    /**
     * @desc The Photo class constructor.
     * @author Adam Cassidy
     * @param {int} id The ID of the Photo.
     * @param {int} plantId The ID of the corresponding Plant.
     * @param {int} userId The ID of the User who uploaded this Photo.
     * @param {byte[]} image The byte array for the image.
     * @constructor
     */
    constructor(id, plantId, userId, image) {
        // PRIVATE attributes.
        this.downvoteIds = [];
        this.upvoteIds = [];
        this.id = id;
        this.plantId = plantId;
        this.userId = userId;
        this.uploadDate = new Date();
        this.image = image;

        // PUBLIC methods.
        this.getId = getId;
        this.getPlantId = getPlantId;
        this.getUserId = getUserId;
        this.getUploadDate = getUploadDate;
        this.getUpvoteIds = getUpvoteIds;
        this.getDownvoteIds = getDownvoteIds;
        this.userUpvoted = userUpvoted;
        this.userDownvoted = userDownvoted;
        this.getVoteSum = getVoteSum;
        this.vote = vote;

        // PRIVATE method definitions.
        /**
        * @returns {int} Id;
        */
        function getId() {
            return this.Id;
        }

        /**
        * @returns {int} plantId;
        */
        function getPlantId() {
            return this.plantId;
        }

        /**
        * @returns {int} userId;
        */
        function getUserId() {
            return this.userId;
        }

        /**
        * @returns {Date} uploadDate;
        */
        function getUploadDate() {
            return this.uploadDate;
        }

        /**
        * @returns {int[]} upvoteIds;
        */
        function getUpvoteIds() {
            return this.upvoteIds;
        }

        /**
         * @returns {int[]} downvoteIds;
         */
        function getDownvoteIds() {
            return this.downvoteIds;
        }

        /**
         * 
         * @param {int} userId 
         * @returns {boolean} (if the user upvoted)
         */
        function userUpvoted(userId) {
            if (searchVoteArray(this.upvoteIds, this.userId) === -1) {
                return false;
            }
            else {
                return true;
            }
        }

        /**
         * 
         * @param {int} userId 
         * @returns {boolean} (if the user downvoted)
         */
        function userDownvoted(userId) {
            if (searchVoteArray(this.downvoteIds, this.userId) === -1) {
                return false;
            }

            else {
                return true;
            }
        }

        /**
         * @returns {int} voteSum;
         */
        function getVoteSum() {
            var sum = 0;
            for (upvote in this.upvoteIds) {
                sum += 1;
            }
            for (downvote in this.downvoteIds) {
                sum -= 1;
            }
            return sum;
        }

        function vote(userId, up) {
            if (up) {
                var upIndex = searchVoteArray(this.upvoteIds, this.userId);
                if (upIndex != -1) {
                    removeVote(up, upIndex);
                }
                else {
                    var downIndex = searchVoteArray(this.downvoteIds, this.userId);
                    if (downIndex != -1) {
                        removeVote(!up, downIndex);
                    }
                    addVote(up);
                }
            }
            else {
                var downIndex = searchVoteArray(this.downvoteIds, this.userId);
                if (downIndex != -1) {
                    removeVote(up, downIndex);
                }
                else {
                    var upIndex = searchVoteArray(this.upvoteIds, this.userId);
                    if (upIndex != -1) {
                        removeVote(!up, upIndex);
                    }
                    addVote(up);
                }
            }
        }

        // PRIVATE method definitions.
        function searchVoteArray(voteArray, userId) {
            let first = 0;
            let mid;
            let last = voteArray.length;
            let found = false;
            let result = -1;

            while (first <= last && !found) {
                mid = (first + last) / 2;
                if (userId === voteArray[mid]) {
                    found = true;
                    result = mid;
                }
                else if (userId < voteArray[mid]) {
                    last = mid - 1;
                }
                else {
                    first = mid + 1;
                }
            }
            return result;
        }

        /**
         * 
         * @param {boolean} up
         */
        function addVote(userId, up) {
            if (up) {
                this.upvoteIds.push(userId);
                upvoteIds.sort(function (a, b) { return a - b });
            }
            else {
                this.downvoteIds.push(userId);
                downvoteIds.sort(function (a, b) { return a - b });
            }
            return;
        }

        /**
         * 
         * @param {boolean} up
         */
        function removeVote(up, index) {
            if (up) {
                if (index != -1) {
                    this.upvoteIds.splice(index, 1);
                }
            }
            else {
                if (index != -1) {
                    this.downvoteIds.splice(index, 1);
                }
            }
            return;

        }
    }
}
