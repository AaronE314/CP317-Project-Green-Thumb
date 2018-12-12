"use strict";
const assert = require("assert");
const Photo = require("../../backend/Photo");

describe("Photo Tests", () => {

    it("getId() should return the private id attribute.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            assert.equal(photo.getId(), 4);
        });

    it("getPlantId() should return the corresponding Plant ID.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            assert.equal(photo.getPlantId(), 1);
        });

    it("getUserId() should return the userId of the User who uploaded the Photo.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            assert.equal(photo.getUserId(), 2);
        });

    it("getImage() should return the byte array for the image.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            assert.equal(photo.getImage(), "");
        });

    it("getUploadDate() should return the date on which the photo was uploaded.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            assert(!(photo.getUploadDate() < new Date(0)) && !(photo.getUploadDate() > new Date(0)));
        });

    it("getUpvoteIds() should return the the IDs of the users who have upvoted on this Photo.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            assert(JSON.stringify(photo.getUpvoteIds()) == JSON.stringify([5]));
        });

    it("getDownvoteIds() should return the the IDs of the users who have downvoted on this Photo.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            assert(JSON.stringify(photo.getDownvoteIds()) == JSON.stringify([6]));
        });

    it("getVoteSum() should return overall total of upvotes and downvotes.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            assert.equal(photo.getVoteSum(), 0);
        });

    it("toJSON() should produce an object containing a copy of the private attributes of the Photo.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, "", 4, new Date(0), [5], [6]);
            let toJSON = photo.toJSON();
            assert.notDeepStrictEqual(photo, toJSON);
            assert.equal(toJSON.id, 4);
            assert.equal(toJSON.plantId, 1);
            assert.equal(toJSON.userId, 2);
            assert(JSON.stringify(toJSON.upvoteIds), JSON.stringify([5]));
            assert(JSON.stringify(toJSON.downvoteIds), JSON.stringify([6]));
            assert(!(toJSON.uploadDate < new Date(0)) && !(toJSON.uploadDate > new Date(0)));
        });
});
