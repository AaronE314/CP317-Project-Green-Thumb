"use strict";
/** 
 * @desc The Plant class.
 * @author Nicolas Ross
 * */
class Plant {
    /**
     * @desc The constructor for the Plant class.
     * @author Nicolas Ross
     * @param {Number=} id 
     * @param {string} name 
     * @param {string} bio 
     * @constructor
     */
    constructor(name, bio, id) {
        // PRIVATE attributes.
        let _id = id; // May be undefined -- that's fine. This argument is optional.
        let _name = name;
        let _bio = bio;

        // PUBLIC methods.
        this.getId = getId;
        this.getName = getName;
        this.getBio = getBio;
        this.setId = setId;
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
         * @desc Set the Plant ID. Can only be done once.
         * @author Nathaniel Carr
         * @param {Number} id The Plant ID. Integer.
         */
        function setId(id) {
            if (!_id) {
                _id = id;
            }
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