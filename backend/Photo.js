"use strict";
/**
 * @desc The Photo class.
 * @author Adam Cassidy
 */
class Photo {
    /**
     * @desc The Photo class constructor.
     * @author Adam Cassidy
     * @param {Number=} id The ID of the Photo. Integer.
     * @param {Number} plantId The ID of the corresponding Plant. Integer.
     * @param {Number} userId The ID of the User who uploaded this Photo. Integer.
     * @param {*[]} image The byte array for the image.
     * @param {*=} uploadDate The Date on which the Photo was uploaded. Today if undefined.
     * @param {Number[]=} upvoteIds The IDs of the Users who have upvoted on this Photo. Sorted in ascending order. Integer.
     * @param {Number[]=} downvoteIds The IDs of the Users who have downvoted on this Photo. Sorted in ascending order. Integer.
     * @constructor
     */
    constructor(plantId, userId, image, id, uploadDate, upvoteIds, downvoteIds) {
        // PRIVATE attributes.
        let _plantId = plantId;
        let _userId = userId;
        let _image = image;
        let _id = id //can be undefined because the id is optional;
        let _uploadDate = uploadDate !== undefined ? new Date(uploadDate) : new Date();
        let _upvoteIds = upvoteIds; //!== undefined ? upvoteIds.sort((a, b) => { return a - b; }) : [];
        let _downvoteIds = downvoteIds; //!== undefined ? downvoteIds.sort((a, b) => { return a - b; }) : [];

        // PUBLIC methods.
        this.getId = getId;
        this.getPlantId = getPlantId;
        this.getUserId = getUserId;
        this.getImage = getImage;
        this.getUploadDate = getUploadDate;
        this.getUpvoteIds = getUpvoteIds;
        this.getDownvoteIds = getDownvoteIds;
        this.userUpvoted = userUpvoted;
        this.userDownvoted = userDownvoted;
        this.getVoteSum = getVoteSum;
        this.vote = vote;
        this.toJSON = toJSON;
        this.setId = setId;

        // PRIVATE method definitions.
        /**
        * @author Adam Cassidy
        * @returns {Number} The ID of the Photo. Integer.
        */
        function getId() {
            return _id;
        }
        /**
        * @author Adam Cassidy
        * @returns {Number} The ID of the corresponding Plant. Integer.
        */
        function getPlantId() {
            return _plantId;
        }
        /**
        * @author Adam Cassidy
        * @returns {Number} userId The ID of the User who uploaded this Photo. Integer.
        */
        function getUserId() {
            return _userId;
        }
        /**
         * @author Adam Cassidy
         * @returns {*[]} The byte array for the image.
         */
        function getImage() {
            return _image;
        }
        /**
         * @author Adam Cassidy
        * @returns {*} uploadDate The Date on which the Photo was uploaded.
        */
        function getUploadDate() {
            return _uploadDate;
        }
        /**
         * @author Adam Cassidy
        * @returns {Number[]} upvoteIds The IDs of the Users who have upvoted on this Photo. Sorted in ascending order. Integer.
        */
        function getUpvoteIds() {
            return _upvoteIds;
        }
        /**
         * @author Adam Cassidy
         * @returns {Number[]} downvoteIds The IDs of the Users who have downvoted on this Photo. Sorted in ascending order. Integer.
         */
        function getDownvoteIds() {
            return _downvoteIds;
        }
        /**
         * @desc Determine whether or not a User with a specified ID upvoted on this Photo.
         * @author Adam Cassidy
         * @param {Number} userId The ID of the User in question. Integer.
         * @returns {Boolean} True iff the User upvoted.
         */
        function userUpvoted(userId) {
            return binaryIndexOf(_upvoteIds, userId, (a, b) => { return a - b; }) > -1;
        }
        /**
         * @desc Determine whether or not a User with a specified ID downvoted on this Photo.
         * @author Adam Cassidy
         * @param {Number} userId The ID of the User in question. Integer.
         * @returns {Boolean} True iff the User downvoted.
         */
        function userDownvoted(userId) {
            return binaryIndexOf(_downvoteIds, userId, (a, b) => { return a - b; }) > -1;
        }
        /**
         * @desc Determine overall total of upvotes and downvotes (one upvote is +1, one downvote is -1).
         * @author Nathaniel Carr
         * @author Adam Cassidy
         * @returns {Number} The difference between the length of upvoteIds and downvoteIds. Integer.
         */
        function getVoteSum() {
            return _upvoteIds.length - _downvoteIds.length;
        }
        /**
         * @desc Add a User's ID to the upvoteIds or downvoteIds (based on up param) if it does not already exist in the array in question, and remove it if it does. There will be at most one instance of userId in either upvoteIds or downvoteIds at the end.
         * @author Nathaniel Carr
         * @author Adam Cassidy
         * @param {Number} userId The User's ID. Integer.
         * @param {Boolean} up Whether to upvote or downvote.
         */
        function vote(userId, up) {
            // Find index of userId in upvoteIds if it exists.
            let index = binaryIndexOf(_upvoteIds, userId, (a, b) => { return a - b; });
            if (index > -1) {
                // Splice userId out of upvoteIds.
                _upvoteIds.splice(index, 1);
            } else if (up) {
                // Splice userId into appropriate index in upvoteIds.
                _upvoteIds.splice(
                    binaryIndexOf(_upvoteIds, userId, (a, b) => { return a - b; }, true), 0, userId);
            }

            // Find index of userId in downvoteIds if it exists.
            index = binaryIndexOf(_downvoteIds, userId, (a, b) => { return a - b; });
            if (index > -1) {
                // Splice userId out of downvoteIds.
                _downvoteIds.splice(index, 1);
            } else if (!up) {
                // Splice userId into appropriate index in downvoteIds.
                _downvoteIds.splice(binaryIndexOf(_downvoteIds, userId, (a, b) => { return a - b; }, true), 0, userId);
            }
        }

        // PRIVATE method definitions.
        /**
         * @desc Returns index of item if item is found in arr. Else, returns -1 by default or the index of the next-least item in arr (based on closestLT).
         * @author Nathaniel Carr
         * @author Adam Cassidy
         * @template T
         * @param {T[]} arr Array to search.
         * @param {T} item Item to search for.
         * @param {*} comp Function that compares a to b, each of type T. Returns < 0 if a < b, 0 if a == b, > 0 if a > b.
         * @param {Boolean=} [closestLT=false] If closestLT set, return index of closest T in arr to item such that the closest T is less than item. If closestLT is false, return -1 if item is not found. Default: false.
         * @returns {Number} Return index of item if item is found in arr. If closestLT set, return index of closest T in arr to item such that the closest T is less than item. If closestLT is false, return -1 if item is not found.
         */
        function binaryIndexOf(arr, item, comp, closestLT) {
            closestLT |= false;

            let first = 0;
            let mid;
            let last = arr.length - 1;
            let found = false;
            let result = -1;

            while (first <= last && !found) {
                let compResult = comp(arr[mid], item);
                mid = Math.floor((first + last) / 2);
                if (compResult == 0) {
                    found = true;
                    result = mid;
                }
                else if (compResult > 0) {
                    last = mid - 1;
                }
                else {
                    first = mid + 1;
                }
            }
            return closestLT ? first : result;
        }
        /**
         * @desc Convert the private attributes of Photo object to JSON so it can be sent via an API.
         * @author Nathaniel Carr
         * @returns {*} The Photo object's attributes.
         */
        function toJSON() {
            return {
                id: _id,
                plantId: _plantId,
                userId: _userId,
                image: _image,
                uploadDate: _uploadDate,
                upvoteIds: _upvoteIds,
                downvoteIds: _downvoteIds
            }
        }
        /**
         * @desc Sets the Photo's id and can only be done once if the current id is undefined.
         * @param {Number} id; the Photo id. Integer.
         * @author Adam Cassidy
         */
        function setId(id) {
            if (!_id) {
                _id = id;
            }
        }
    }
}

module.exports = Photo;
