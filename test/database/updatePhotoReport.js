const chai = require('chai');
const assert = chai.assert;
const DBInterface = require("../../backend/db/DBInterface.js");
const PhotoReport = require("../../backend/PhotoReport.js");

const id = 1;
const photoId = 2;
const userId = "22";
const reportText = "This report was updated";
const reportDate = new Date("2019-12-12");

describe('updatePhotoReport Satabase Tests', async function() {
    it('should update a PhotoReport in the table with ID == ' + id, async function() {
        let prep = new PhotoReport(photoId, userId, reportText, id, reportDate);
        await DBInterface.updatePhotoReport(prep);
        let prep1 = await DBInterface.getPhotoReport(id);

        assert.equal(prep.getId(), prep1.getId());
        assert.equal(prep.getUserId(), prep1.getUserId());
        assert.equal(prep.getPhotoId(), prep1.getPhotoId());
        assert.equal(prep.getReportDate().getTime(), prep1.getReportDate().getTime());
        assert.equal(prep.getReportText(), prep1.getReportText());
    });
    it('should not make any changes as there is no PhotoReports with ID == ' + id, async function() {
        
    });
});