

let assert = require('assert');
let identifier = require('../../backend/machineLearning/MLIdentifier.js');

describe('Testing TFIdentifier', () => {
    
    it('should return array of plants', () => {
        let results = identifier.gatherImages();

        //find some way to test this is correct
    });

    it('should return object containing prediction', async () => {
        let db = require('../../backend/db/DBInterface.js');

        for (let i = 1; i <= 4; i++) {

            let photo = await db.getTopPlantPhotos(i, 0, 5);

            for (let j = 0; j < photo.length; j++) {
                photo[i] = photo[i].getImage();
            }

            let correct = 0;

            for (let p = 0; p < photo.length; p++) {

                for (let j = 0; j < 10; j++) {
                    let results = identifier.predict(photo[i]);

                    for (let k = 0; k < results.numResults; k++) {
                        if (results.classes[k] == i && results.scores > 0.3) {
                            correct++;
                            break;
                        }
                    }
                    
                }
            }

            let accuracy = correct / (photo.length * 10);

            assert(accuracy > 0.8, `Predict isn't at least 80% accurate for plants with id ${i}`);

        }
    });

    it('should return an id of a scheduled retrain', () => {

        let lengthBefore = identifier.scheduledItems.length;

        let id = identifier.scheduleTraining("0:2018:11:10:15:00:3");

        assert(id > 0, "Id is negative");

        let lengthAfter = identifier.scheduledItems.length;

        assert(lengthBefore < lengthAfter, "didn't add object to list");

        let confirmation = identifier.cancelScheduledTrain(id);

        assert(confirmation === true, "didn't cancel");

        assert(lengthAfter > identifier.scheduledItems.length, "removed from list");
    });
});