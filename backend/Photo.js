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
     * @param {String} userId The ID of the User who uploaded this Photo.
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
        this.getVoteSum = getVoteSum;
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
        * @returns {String} userId The ID of the User who uploaded this Photo. String.
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
         * @desc Determine overall total of upvotes and downvotes (one upvote is +1, one downvote is -1).
         * @author Nathaniel Carr
         * @author Adam Cassidy
         * @returns {Number} The difference between the length of upvoteIds and downvoteIds. Integer.
         */
        function getVoteSum() {
            return _upvoteIds.length - _downvoteIds.length;
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
