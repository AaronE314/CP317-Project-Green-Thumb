"use strict";
import Ban from './Ban.js';

const BAN_BASE = 3;

/**
 * @desc The User class
 * @author Saje Bailey
 */
export default class User {
    /**
     * @desc Constructor for the User class.
     * @author Saje Bailey
     * @param {Ban[]} bans The list of Bans associated with the User.
     * @param {Number} userId The ID of the User. Integer.
     * @constructor
     */
    constructor(userId, bans) {
        // PRIVATE attributes.
        let _bans = (bans === undefined ? [] : bans);
        let _id = userId;

        // PUBLIC methods.
        this.getBans = getBans;
        this.getId = getId;
        this.ban = ban;
        this.isBanned = isBanned;

        // PUBLIC method definitions.
        /**
         * @author Saje Bailey
         * @returns {Ban[]} The list of Bans associated with the User.
         */
        function getBans() {
            return _bans;
        }
        /**
         * @author Saje Bailey
         * @returns {Number} The ID of the User. Integer.
         */
        function getId() {
            return _id;
        }
        /**
         * @author Saje Bailey
         * @param {Number} adminId The ID of the Admin banning the User. Integer.
         */
        function ban(adminId) {
            let expiration = new Date();
            expiration.setDate(expiration.getDate() + Math.pow(BAN_BASE, (numBans)));

            // call function in the DB Interface with appropreate constructor arguments
            // this call to Ban constructor is temporary for testing
            _bans[_bans.length] = new Ban(adminId, expiration);
        }
        /**
         * @author Saje Bailey
         * @author Nathaniel Carr
         * @returns {Boolean} true iff the User is currently banned.
         */
        function isBanned() {
            return (_bans.length > 0) && (new Date().getTime() < new Date(_bans[_bans.length - 1]).getTime());
        }
    }
}