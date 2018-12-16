"use strict";
/**
 * @desc The Ban class.
 * @author Nathaniel Carr
 */
class Ban {
    /**
     * @desc The Ban class Constructor.
     * @author Nathaniel Carr
     * @param {String} userId The ID of the banned User.
     * @param {String} adminId The ID of the Admin who banned the User.
     * @param {*} expirationDate The Date when the Ban expires.
     * @param {Number} id The Ban ID. Integer.
     * @constructor
     */
    constructor(userId, adminId, expirationDate, id) {
        // PRIVATE attributes.
        let _id = id; // id may be undefined (that's fine -- it's an optional argument).
        let _userId = userId;
        let _adminId = adminId;
        let _expirationDate = expirationDate;

        // PUBLIC methods.
        this.getId = getId;
        this.getUserId = getUserId;
        this.getAdminId = getAdminId;
        this.getExpirationDate = getExpirationDate;
        this.setId = setId;
        this.toJSON = toJSON;

        // PUBLIC method defintions.
        /**
         * @author Nathaniel Carr
         * @returns {Number} The Ban ID. Integer.
         */
        function getId() {
            return _id;
        }
        /**
         * @author Nathaniel Carr
         * @returns {Number} The ID of the banned User. Integer.
         */
        function getUserId() {
            return _userId;
        }
        /**
         * @author Nathaniel Carr
         * @returns {Number} The ID of the Admin who banned the User. Integer.
         */
        function getAdminId() {
            return _adminId;
        }
        /**
         * @author Nathaniel Carr
         * @returns {*} The Date when the Ban expires.
         */
        function getExpirationDate() {
            return _expirationDate;
        }
        /**
         * @desc Set the Ban ID. Can only be done once.
         * @author Nathaniel Carr
         * @param {Number} id The Ban ID. Integer.
         */
        function setId(id) {
            if (!_id) {
                _id = id;
            }
        }
        /**
         * @desc Convert the private attributes of Ban object to JSON so it can be sent via an API.
         * @author Nathaniel Carr
         * @returns {*} The Ban object's attributes.
         */
        function toJSON() {
            return {
                id: _id,
                userId: _userId,
                adminId: _adminId,
                expirationDate: _expirationDate
            }
        }
    }
}

module.exports = Ban;