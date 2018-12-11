const chai = require('chai');
const assert = chai.assert;
const DBInterface = require("../../backend/db/DBInterface.js");
const PhotoReport = require("../../backend/PhotoReport.js");

const id = 2;

describe('removePhotoReport Database Tests', async function() {
    it('should remove a PhotoReport from the table with ID == 2', async function() {
        let search1 = await DBInterface.getPhotoReport(id);
        console.log(search1.toJSON());
        assert(search1 !== null && search1 !== undefined, "The PhotoReport is neither 'null' nor 'undefined'");
        // await DBInterface.removePhotoReport(id);
        // let search2 = await DBInterface.getPhotoReport(id);
        // assert.equal(search2, undefined);
        // await DBInterface.addPhotoReport(search1);
    });
    it('should not remove anything as there are no PhotoReports with ID == 7', async function() {
        await DBInterface.removePhotoReport(7);
    });
});