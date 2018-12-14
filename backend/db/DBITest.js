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
     let i = 36;
    let n =46; 
    while (i < n ){
        await DBInterface.removePhoto(i);

        await i++;
    } 
    
    await DBInterface.removePhoto(32);

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
