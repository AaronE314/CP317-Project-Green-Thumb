/** 
 * @author Scott Peebles
 * */

class PhotoReport{
	
	let adminId = -1;
	let handleDate = new Date();
	let id = -1;
	let photoId = -1;
	let reportDate = new Date();
	let reportText = "";
	let userId = -1;
	let handled = false;
	
	/**
	 * @param {int} photoId
     * @param {int} userId
	 * @param {int} photoReportId
     * @constructor
     */

    constructor(photoId, userId, photoReportId) {
        this.photoId = photoId;
        this.userId = userId;
		this.photoReportId = photoReportId;

      }
	  
	  
	/**
     * @returns {AdminAction} AdminAction;
     */
	function getAdminAction(){
		
		return AdminAction;
	}
	
	/**
     * @returns {int} adminId;
     */
	function getAdminId(){
		
		return adminId;
	}
	
	/**
     * @returns {Date} handleDate;
     */
	function getHandleDate(){
		
		return handleDate;
	}
	
	/**
     * @returns {int} photoId;
     */
	function getPhotoId(){
		return photoId;
	}
	
	/**
     * @returns {Date} reportDate;
     */
	function getReportDate(){
		return reportDate;
	}
	
	/**
     * @returns {String} reportText;
     */
	function getReportText(){
		return reportText;
	}	
		
	/**
     * @returns {int} userId;
     */
	function getUserId(){
		return userId;
	}
	
	
	/**
     * @returns {boolean}(If report is handled)
     */
	function is_Handled(){
		
		if(handled == true){ 
			return true;
		}
		else{
			return false;
		}
		
		
	}
	
	public handle(adminID, AdminAction){
		
		AdminAction();
		handled = true;
		
		
		
		
	}


}