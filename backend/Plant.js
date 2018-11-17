"use strict";
/** 
 * @desc The Plant class.
 * @author Nicolas Ross
 * */
class Plant {
    /**
     * @desc The constructor for the Plant class.
     * @author Nicolas Ross
     * @param {string} name 
     * @param {string} bio 
     * @constructor
     */
    constructor(id, name, bio) {
        // PRIVATE attributes.
        let _id = id;
        let _name = name;
        let _bio = bio;

        // PUBLIC methods.
        this.getId = getId;
        this.getName = getName;
        this.getBio = getBio;
        this.setBio = setBio;
        this.toJSON = toJSON;

        // PUBLIC method definitions.
        /**
         * @returns {Number} The Plant's ID. Integer.
         */
        function getId() {
            return _id;
        }
        /**
         * @returns {String} The Plant's name.
         */
        function getName() {
            return _name;
        }
        /**
         * @returns {String} The Plant's biography.
         */
        function getBio() {
            return _bio;
        }
        /**
         * @param {String} newBio The Plant's new biography.
         */
        function setBio(newBio) {
            _bio = newBio;
        }
        /**
		 * @desc Convert the private attributes of Plant object to JSON so it can be sent via an API.
		 * @author Nathaniel Carr
		 * @returns {*} The Plant object's attributes.
		 */
		function toJSON() {
			return {
				id: _id,
                name: _name,
                bio: _bio
			}
		}
    }
}

module.exports = Plant;