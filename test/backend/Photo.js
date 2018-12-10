"use strict";
const assert = require("assert");
const Photo = require("../../backend/Photo");

describe("Photo Tests", () => {

    it("getId() should return the private id attribute",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.getId(), 4);
        });

    it("getPlantId() should return the corresponding Plant ID",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.getPlantId(), 1);
        });

    it("getUserId() should return the userId of the User who uploaded the photo",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.getUserId(), 2);
        });

    it("getImage() should return the byte array for the image",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.getImage(), *[0]);
        });

    it("getUploadDate() should return the date on which the photo was uploaded",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert(!(photo.getUploadDate < new Date(0)) && !(photo.getUploadDate > new Date(0)));
        });
		
	it("getUpvoteIds() should return the the IDs of the users who have upvoted on this photo.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.getUpvoteIds(), [5]);
        });
		
	it("getDownvoteIds() should return the the IDs of the users who have downvoted on this photo.",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.getDownvoteIds(), [6]);
        });
		
	it("userUpvoted(userId) should return the user ID who upvoted on this photo",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.userUpvoted(5), true);
        });
		
	it("userDownvoted(userId) should return the user ID who downvoted on this photo",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.userDownvoted(6), true);
        });
		
	it("getVoteSum() should return overall total of upvotes and downvotes",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            assert.equal(photo.getVoteSum(), 0);
        });
		
	it("vote(userId, up) should add a user's ID to the upvoteIds or downvoteIds",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
			photo.vote(3, true);
            assert.equal(photo.getUpvoteIds(), [5,3]);
        });
		
	it("binaryIndexOf(arr, item, comp, closestLT) should return the index of item if item is found in arr",
        /**
         * @author Scott Peebles
         */
        () => {
			let index = binaryIndexOf([1,2,3],3, comp, closestLT);
            assert.equal(index, 2);
        });
		
    it("toJSON() should produce an object containing a copy of the private attributes of the Photo",
        /**
         * @author Scott Peebles
         */
        () => {
            let photo = new Photo(1, 2, *[0], 4, new Date(0), [5],[6]);
            let toJSON = photo.toJSON();
            assert.notDeepStrictEqual(photo, toJSON);
            assert.equal(toJSON.id, 4);
            assert.equal(toJSON.plantId, 1);
            assert.equal(toJSON.userId, 2);
			assert.equal(toJSON.upvoteIds, [5]);
			assert.equal(toJSON.downvoteIds, [6]);
            assert(!(toJSON.uploadDate < new Date(0)) && !(toJSON.uploadDate > new Date(0)));
        });
});
