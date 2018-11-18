
/**@abstract
 * 
 * @author Ben Keunen
 * @author Joseph Myc
 * 
 * @description This class is designed to Identify a given image,
 * and return the results as an array of detections
 * 
 */
class TFTrainer {
const { spawn } = require('child_process');
    /**
     * @author Joseph Myc
     * 
     * Add description ...
     */
    static convertFormat() {
        
    }

    /**
     * @author Joseph Myc
     * 
     * Add description ...
     * @param model
     */
    static saveModel(model) {

    }

    /**
     * @author Ben Keunen
     * 
     * Node.js script that trains a model for a given number of hours
     * must be run from Object_Detection directory
     *
     * Requires Train.TFrecord and Test.TFrecord within object detection and labelmap.pbtxt within training folder
     *
     * @param time (int) hours to train
     * @param model (String) model to be trained ie 'ssd_mobilenet_v1_coco_2017_11_17'
     */
    static trainModel(time, model)
  
        //arguments are [where to log errors, directory of where training occurs, path to configuration file of the model]
        const train = spawn('python',
        ["train.py", "--logtostderr", "--train_dir=training/", "--pipeline_config_path=training/"+model]);


        //outputs any data returned from script
        train.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });

        //outputs any error messages given by the script
        train.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        //outputs the close code when process finishes/is killed
        train.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });

        //sets a timer to allow the training to occur for 'time' hours as input as an argument
        setTimeout(function(evt){ 
            //stops the training after time has passed
            train.kill();
            //calls function to find highest checkpoint and export a graph based upon it
            findHighCheck(function(data){ exportGraph(data) });
            //60 minutes * 'time' hours
        },1000*60*60*time);
        

        /**
         * @param {function} action
         * action is the input function which in this case was exportGraph(data)
         *
         */
        function findHighCheck(action){
            //function used to search for highest index files given data from ls command
            /**
             * @param {Buffer} data
             * 
             */
            this.check = function(data){
                //sets data to a string
                ret=String(data);
                //searches for line matching 'model.ckpt-[0-9]*\.meta' in data
                found=ret.match(regex);
                //changes regex to just search for the number within the string
                regex=/\d+/;

                //searches for the highest number within the original list of lines matching 'model.ckpt-[0-9]*\.meta'
                for (var i = 0; i < found.length; i++){
                    var num= parseInt(found[i].match(regex));
                    if (num>max){
                        max=num;
                    }
                }
                //performs the exportGraph method upon the max number
                action(max);
            }

            //performs ls command from training directory
            const findCheck = spawn('ls',{cwd:"training"});

            var regex=/model.ckpt-[0-9]*\.meta/g;
            var found;
            var max=0;
            // output given by ls command in training directory
            findCheck.stdout.on('data', this.check);
        }
         /**
         * @param {int} chkpt
         * 
         */
        function exportGraph(chkpt){
           // $ arguments represents arguments which should not be changed
           //arguments are [$script, $input type, path to configuration file of the model, prefix of latest checkpoint file given by training, where to save the frozen graph]
        const exportFile = spawn('python',["export_inference_graph.py","--input_type=image_tensor","--pipeline_config_path=training/"+model,
        "--trained_checkpoint_prefix=training/model.ckpt-"+String(chkpt), "--output_directory=inference_graph"],);
        }
    }
}
