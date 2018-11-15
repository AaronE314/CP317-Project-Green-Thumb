"use strict";
/** 
 * @desc The PhotoReport class.
 * @author Scott Peebles
 * */
export default class PhotoReport {
	/**
	 * @desc The PhotoReport class constructor.
	 * @author Scott Peebles
	 * @param {Number} id The PhotoReport ID. Integer.
	 * @param {Number} photoId The ID of the reported Photo. Integer.
	 * @param {Number} userId The ID of the User who made the PhotoReport. Integer.
	 * @param {String} reportText The text of the PhotoReport.
	 * @param {*=} reportDate The Date when the PhotoReport was created.
	 * @constructor
	 */
	constructor(id, photoId, userId, reportText, reportDate) {
		// PRIVATE attributes.
		let _id = id;
		let _photoId = photoId;
		let _userId = userId;
		let _reportText = reportText;
		let _reportDate = reportDate !== undefined ? new Date(reportDate) : new Date();

		// PUBLIC methods.
		this.getId = getId;
		this.getPhotoId = getPhotoId;
		this.getUserId = getUserId;
		this.getReportText = getReportText;
		this.getReportDate = getReportDate;

		// PUBLIC method defintions.
		/**
		 * @author Scott Peebles
		* @returns {Number} The PhotoReport ID. Integer.
		*/
		function getId() {
			return _id;
		}
		/**
		 * @author Scott Peebles
		* @returns {Number} The ID of the reported Photo. Integer.
		*/
		function getPhotoId() {
			return _photoId;
		}
		/**
		 * @author Scott Peebles
		* @returns {Number} The ID of the reported Photo. Integer.
		*/
		function getUserId() {
			return _userId;
		}
		/**
		 * @author Scott Peebles
		* @returns {String} The text of the PhotoReport.
		*/
		function getReportText() {
			return _reportText;
		}
		/**
		 * @author Scott Peebles
		* @returns {*} The Date when the PhotoReport was created.
		*/
		function getReportDate() {
			return _reportDate;
		}

	}
}