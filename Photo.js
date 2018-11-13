/**
 * @author Adam Cassidy
 */
class Photo {
  let this.downvoteIds = [];
  let this.upvoteIds = [];
  let this.id = -1;
  let this.plantId = -1;
  let this.userId = -1;
  let this.uploadDate = Date;
  let this.image = [];

  /**
   * @param {int} plantId
   * @param {int} userId
   * @param {int} id
   * @param {byte[]} image
   * @constructor
   */
  constructor(plantId, userId, id, image){
    this.downvoteIds = downvoteIds;
    this.upvoteIds = upvoteIds;
    this.id = id;
    this.plantId = plantId;
    this.userId = userId;
    this.uploadDate = new Date();
    this.image = image;
  }
 

  /**
   * @returns {int[]} downvoteIds;
   */
  function getDownvoteIds(){
    return this.downvoteIds;
  }

  /**
   * @returns {int} Id;
   */
  function getId(){
    return this.Id;
  }

  /**
   * @returns {int} plantId;
   */
  function getPlant(){
    return this.plantId;
  }

  /**
   * @returns {Date} uploadDate;
   */
  function getUploadDate(){
    return this.uploadDate;
  }

  /**
   * @returns {int[]} upvoteIds;
   */
  function getUpvoteIds(){
    return this.upvoteIds;
  }

  /**
   * @returns {int} userId;
   */
  function getUser(){
    return this.userId;
  }

  /**
   * @returns {int} voteSum;
   */
  function getVoteSum(){
    var sum = 0;
    for (upvote in this.upvoteIds) {
      sum += 1;
    }
    for (downvote in this.downvoteIds){
      sum -= 1;
    }
    return sum;
  }

  /**
   * 
   * @param {int} userId 
   * @returns {boolean} (if the user downvoted)
   */
  function userDownvoted(userId){
    if (searchVoteArray(this.downvoteIds, this.userId)===-1){
      return false;
    }

    else {
      return true;
    }
  }

  /**
   * 
   * @param {int} userId 
   * @returns {boolean} (if the user upvoted)
   */
  function userUpvoted(userId){
    if (searchVoteArray(this.upvoteIds, this.userId)===-1){
      return false;
    }
    else {
      return true;
    }
  }

  /**
   * 
   * @param {boolean} up
   */
  function addVote(up){
    if (up){
      this.upvoteIds.push(this.userId);
      upvoteIds.sort();
    }
    else {
      this.downvoteIds.push(this.userId);
      downvoteIds.sort();
    }
    return;
  }

  /**
   * 
   * @param {boolean} up
   */
  function removeVote(up, index){
    if (up){
      if (index != -1){
        this.upvoteIds.splice(index, 1);
      }
      
    }
    else {
      if (index != -1){
        this.downvoteIds.splice(index, 1);
      }     

    }
    return;

  }

  function vote(userId, up){
    if (up){
      var upIndex = searchVoteArray(this.upvoteIds, this.userId);
      if (upIndex != -1){
        removeVote(up, upIndex);
      }
      else {
        var downIndex = searchVoteArray(this.downvoteIds, this.userId);
        if (downIndex != -1){
          removeVote(!up, downIndex);
        }
        addVote(up);
      }
    }
    else {
      var downIndex = searchVoteArray(this.downvoteIds, this.userId);
      if (downIndex != -1){
        removeVote(up, downIndex);
      }
      else {
        var upIndex = searchVoteArray(this.upvoteIds, this.userId);
        if (upIndex != -1){
          removeVote(!up, upIndex);
        }
        addVote(up);
      }
  }

  
  function searchVoteArray(voteArray, userId){
    var first = 0;
    var mid;
    var last = voteArray.length;
    var found = false;
    var result = -1;

    while (first <= last && !found){
      mid = (first+last)/2;
      if (userId === voteArray[mid]){
        found = true;
        result = mid;
      }
      else if (userId < voteArray[mid]){
        last = mid - 1;
      }
      else {
        first = mid + 1;
      }
    }
    return result;
  }
}
