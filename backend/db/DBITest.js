/**
 * @desc The Database Interface, used for all interaction with the GreenThumb Database
 * @author Austin Bursey
 */

var Ban = require("../Ban.js");
var Photo = require("../Photo.js");
var PhotoReport = require("../PhotoReport.js");
var Plant = require("../Plant.js");
var Admin = require("../Admin.js");
var DBInterface = require("./DBInterface.js");
var User = require("../User.js");

(async()=>{
    try{
    let photos = await DBInterface.getTopPlantPhotos(2,0,2);

    console.log(photos[1].toJSON());
    }catch(error){
        console.log(error);
    }
})();
/*
async ()=>{
    let pr = new PhotoReport(10,);
    let ban = DBInterface.addPhotoReport(id);
    assert.equal(ban.getId(),id);
}
*/
