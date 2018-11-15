"use strict";
/**
 * @desc The Ban class.
 * @author Nathaniel Carr
 */
export default class Ban {
    /**
     * @desc The Ban class Constructor.
     * @author Nathaniel Carr
     * @param {Number} id The Ban ID. Integer.
     * @param {Number} userId The ID of the banned User. Integer.
     * @param {Number} adminId The ID of the Admin who banned the User. Integer.
     * @param {*} expirationDate The Date when the Ban expires.
     * @constructor
     */
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
         * @author Nathaniel Carr
         * @returns {Number} id The Ban ID. Integer.
         */
        function getId() {
            return _id;
        }
        /**
         * @author Nathaniel Carr
         * @returns {Number} userId The ID of the banned User. Integer.
         */
        function getUserId() {
            return _userId;
        }
        /**
         * @author Nathaniel Carr
         * @returns {Number} adminId The ID of the Admin who banned the User. Integer.
         */
        function getAdminId() {
            return _adminId;
        }
        /**
         * @author Nathaniel Carr
         * @returns {*} expirationDate The Date when the Ban expires.
         */
        function getExpirationDate() {
            return _expirationDate;
        }
    }
}