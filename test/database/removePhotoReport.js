const chai = require('chai');
const assert = chai.assert;
const DBInterface = require("../../backend/db/DBInterface.js");
const PhotoReport = require("../../backend/PhotoReport.js");

const id = 4;

describe('removePhotoReport Database Tests', async function() {
    it('should remove a PhotoReport from the table with ID == ' + id, async function() {
        let search1 = await DBInterface.getPhotoReport(id);
        assert.exists(search1, "The PhotoReport is neither 'null' nor 'undefined'");
        await DBInterface.removePhotoReport(id);
        let search2 = await DBInterface.getPhotoReport(id);
        assert.notExists(search2, "The PhotoReport is either 'null' or 'undefined'");
    });
    it('should not remove anything as there are no PhotoReports with ID == 7', async function() {
        await DBInterface.removePhotoReport(7);
    });
});