/** 
 * @author Nicolas Ross
 * */

class Plant {
    
    /**
     * @param {string} name 
     * @param {string} bio 
     * @constructor
     */
    constructor(name, bio) {
        //PRIVATE attributtes
        let _id = -1;
        let _name = name;
        let _bio = bio;
    
        /**
         * @returns {string} bio;
         */

        function getBio() {          
            return _bio;
        }

        /**
         * @returns {int} id
         */

        function getID() {
            return _id;
        }

        /**
         * @returns {string} name
         */

        function getName() {
            return _name;
        }

        /**
         * @param {string} newBio 
         */

        function setBio(newBio) {
            _bio = newBio;
        }
    }
}
