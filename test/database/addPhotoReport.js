const chai = require('chai');
const assert = chai.assert;
const DBInterface = require("../../backend/db/DBInterface.js");
const PhotoReport = require("../../backend/PhotoReport.js");

const id = 4;
const photoId = 2;
const userId = "22";
const reportText = "This is a dummy report";
const reportDate = new Date();


describe('addPhotoReport Database Tests', async function() {
    it('should add a PhotoReport to the table with ID == ' + id, async function() {
        let prep = new PhotoReport(photoId, userId, reportText, id, reportDate);
        await DBInterface.addPhotoReport(prep);
        let search = await DBInterface.getPhotoReport(id);
        assert.exists(search, "The PhotoReport is neither 'null' nor 'undefined'");
    });
    it('should not add anything as there is already a PhotoReports with ID == ' + id, async function() {
        await DBInterface.removePhotoReport(7);
    });
});