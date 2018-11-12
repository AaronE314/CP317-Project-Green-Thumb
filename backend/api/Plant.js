/** 
 * @author Nicolas Ross
 * */

class Plant {
    id = -1;
    name;
    bio;

    /**
     * @param {string} name 
     * @param {string} bio 
     * @constructor
     */

    constructor(name, bio) {
        this.name = name;
        this.bio = bio; 
    }
    
    /**
     * @returns {string} bio;
     */

    function getBio() {          
        return this.bio;
    }

    /**
     * @returns {int} id
     */

    function getID() {
        return this.id;
    }

    /**
     * @returns {string} name
     */

    function getName() {
        return this.name;
    }

    /**
     * @param {string} newBio 
     */

    function setBio(newBio) {
        this.bio = newBio;
    }
}
