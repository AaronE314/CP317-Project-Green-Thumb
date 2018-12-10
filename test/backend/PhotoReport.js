"use strict";
const assert = require("assert");
const PhotoReport = require("../../backend/PhotoReport");

describe("PhotoReport Tests", () => {

    it("getId() should return the private id attribute",
        /**
         * @author Nathaniel Carr
         */
        () => {
            let photoReport = new PhotoReport(1, 2, "test", 3, new Date(0));
            assert.equal(photoReport.getId(), 3);
        });

    it("getPhotoId() should return the private photoId attribute",
        /**
         * @author Nathaniel Carr
         */
        () => {
            let photoReport = new PhotoReport(1, 2, "test", 3, new Date(0));
            assert.equal(photoReport.getPhotoId(), 1);
        });

    it("getUserId() should return the private userId attribute",
        /**
         * @author Nathaniel Carr
         */
        () => {
            let photoReport = new PhotoReport(1, 2, "test", 3, new Date(0));
            assert.equal(photoReport.getUserId(), 2);
        });

    it("getReportText() should return the private reportText attribute",
        /**
         * @author Nathaniel Carr
         */
        () => {
            let photoReport = new PhotoReport(1, 2, "test", 3, new Date(0));
            assert.equal(photoReport.getReportText(), "test");
        });

    it("getReportDate() should return the private reportDate attribute",
        /**
         * @author Nathaniel Carr
         */
        () => {
            let photoReport = new PhotoReport(1, 2, "test", 3, new Date(0));
            assert(!(photoReport.reportDate < new Date(0)) && !(photoReport.reportDate > new Date(0)));
        });

    it("toJSON() should produce an object containing a copy of the private attributes of the PhotoReport",
        /**
         * @author Nathaniel Carr
         */
        () => {
            let photoReport = new PhotoReport(1, 2, "test", 3, new Date(0));
            let toJSON = photoReport.toJSON();
            assert.notDeepStrictEqual(photoReport, toJSON);
            assert.equal(toJSON.id, 3);
            assert.equal(toJSON.photoId, 1);
            assert.equal(toJSON.userId, 2);
            assert.equal(toJSON.reportText, "test");
            assert(!(toJSON.reportDate < new Date(0)) && !(toJSON.reportDate > new Date(0)));
        });
});