"use strict";
import Ban from './Ban.js'

/**
 * @description The User class
 * @author Saje Bailey
 */
export default class User {

    /**
     * @param {Ban[]} bans The list of Bans associated with the User
     * @param {int} userId The ID of the User
     */
    constructor(userId, bans) {
        // PRIVATE constant and attributes.
        let _banBase = 3;
        let _bans = (bans == null ? [] : bans);
        let _id = userId;
        
        // PUBLIC methods.
        this.getBans = getBans;
        this.getId = getId;
        this.ban = ban;
        this.isBanned = isBanned;

        // PUBLIC method definitions.
        // getters
        /**
         * @returns {Ban[]} _bans The list of Bans associated with the User.
         */
        function getBans() {
            return _bans;
        }
        /**
         * @returns {int} _id The ID of the User.
         */
        function getId() {
            return _id;
        }
        
        /**
         * @param {int} adminId The ID of the Admin banning the User.
         */
        function ban(adminId) {
            let expiration = new Date();
            let numBans = _bans.length;
            expiration.setDate(expiration.getDate() + Math.pow(_banBase, (numBans)));
            
            // call function in the DB Interface with appropreate constructor arguments
            // this call to Ban constructor is temporary for testing
            let b = new Ban(adminId, expiration);

            _bans[numBans] = b;
        }
    
    /**
     * @returns {boolean} banned true if the User is currently banned, false otherwise
     */
        function isBanned() {
            let len = _bans.length;
            let banned = false;
            
            // if the user has been banned
            if (len > 0) {
                let ban = _bans[len - 1];
                let ex = ban.getDate()
                let today = new Date();

                // If the ban goes into another year
                if (ex.getFullYear() > today.getFullYear()) {
                    banned = true;
                    // console.log("year");
                }
                
                else if (ex.getFullYear() == today.getFullYear()) {
                    // if the ban is in a future month
                    if (ex.getMonth() > today.getMonth()) {
                        banned = true;
                        // console.log("month");
                    }
                    else if (ex.getMonth() == today.getMonth()) {
                        // If today is not equal to or less than the ban
                        if (ex.getDate() > today.getDate()) {
                            banned = true;
                            // console.log("day");
                        }
                    }
                }
            }
            return banned;
        } 
    }

    
}

// Mock Ban class for testng purposes
// let Ban = class Ban {
//     constructor(adminId, expiration) {
//         this.adminId = adminId;
//         this.expiration = expiration;
//     }
//     getDate() {
//         return this.expiration;
//     }
// }
