/**
 * @author Saje Bailey
 */
export let User = class User {
    /**
     * @param {int} userId
     */
    constructor(userId) {
        this.admin = false;
        this.bans = [];
        this.id = userId;
    }
    
    // getters
    getBans() {
        return this.bans;
    }
    getId() {
        return this.id;
    }
    isAdmin() {
        return this.admin;
    }
    /**
     * @param {int} adminId
     */
    ban(adminId) {
        if (!this.admin) {
            let expiration = new Date();
            let numBans = bans.length;
            expiration.setDate(expiration.getDate() + Math.pow(7, (numBans)));
            let ban = class{
                constructor(adminId, expiration) {
                    this.adminId = adminId;
                    this.expiration = expiration;
                }
            }
            this.bans[numBans] = ban;
        }
    }
    /**
   * @returns {boolean} banned;
   */
    isBanned() {
        let len = this.bans.length;
        if (len > 0) {
            let ban = this.bans[len - 1];
            let today = new Date();
            let bannedToday = dates.compare(ban.expiration, today); // do bans contain adminId still
            if (bannedToday == 1) {
                return true;
            }
        }
        return false;
    }
    makeAdmin() {
        this.admin = true;
    }
    
}
