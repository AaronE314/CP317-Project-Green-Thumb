const chai = require('chai');
const assert = chai.assert;
const DBInterface = require("../../backend/db/DBInterface.js");
const PhotoReport = require("../../backend/PhotoReport.js");

const id = 4;
const photoId = 2;
const userId = "22";
const reportText = "This is a dummy report";

var prep1;

// describe('addPhotoReport Database Tests', async function() {
//     it('should add a PhotoReport to the table with ID == ' + id, async function() {
//         let prep = new PhotoReport(photoId, userId, reportText);
//         prep1 = await DBInterface.addPhotoReport(prep);
//         assert.exists(prep1, "The PhotoReport returned is neither 'null' nor 'undefined'");
//         let search = await DBInterface.getPhotoReport(prep1.getId());
//         assert.exists(search, "The PhotoReport in the database is neither 'null' nor 'undefined'");
//     });
//     it('should throw error as there is already a PhotoReports with ID == ' + id, async function() {
//         let prep2 = new PhotoReport(photoId, userId, reportText, prep1.getId(), prep1.getReportDate());
//         assert.throws(async function() { 
//             await DBInterface.addPhotoReport(prep2);
//         }, Error);
//     });
// });