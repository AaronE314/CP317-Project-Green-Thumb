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

    constructor (name, bio) {
        this.name = name;
        this.bio = bio; 
    }
    
    /**
     * @returns {string} bio;
     */

    get getBio() {          
        return this.bio;
    }

    /**
     * @returns {int} id
     */

    get getID() {
        return this.id;
    }

    /**
     * @returns {string} name
     */

    get getName() {
        return this.name;
    }

    /**
     * @param {string} newBio 
     */

    set setBio(newBio) {
        this.bio = newBio;
    }
}
