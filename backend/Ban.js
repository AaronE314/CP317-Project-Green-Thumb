"use strict";

/**
 * @desc The Ban class.
 * @author Nathaniel Carr
 */
class Ban {
    constructor(id, userId, adminId, expirationDate) {
        // PRIVATE attributes.
        let _id = id;
        let _userId = userId;
        let _adminId = adminId;
        let _expirationDate = expirationDate;

        // PUBLIC methods.
        this.getId = getId;
        this.getUserId = getUserId;
        this.getAdminId = getAdminId;
        this.getExpirationDate = getExpirationDate;

        // PUBLIC method defintions.
        /**
         * @returns {int} ID of Ban.
         */
        function getId(){
            return _id;
        }
        /**
         * @returns {int} ID of banned User.
         */
        function getUserId() {
            return _userId;
        }
        /**
         * @returns {int} ID of Admin who gave Ban.
         */
        function getAdminId() {
            return _adminId;
        }
        /**
         * @returns {int} Expiration date of Ban.
         */
        function getExpirationDate() {
            return _expirationDate;
        }
    }
}

module.exports.Ban = Ban;