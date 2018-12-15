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
<<<<<<< HEAD
    let photos = await DBInterface.removeUser('8');

    //console.log(photos[1].toJSON());
=======
    let photos = await DBInterface.getNewestUserPhotos('1234',1,2);
>>>>>>> c669337664e5df5babcb900d4ccef89e8a2c96b7
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
