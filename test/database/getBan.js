
const assert = require('assert');
const DBInterface = require("../../backend/db/DBInterface.js");
const Ban = require("../../backend/Ban.js");

const id = 3;

describe('getBan Database Tests', async function() {
    it('should return a Ban from the table with ID == ' + id, async function() {
        let b = await DBInterface.getBan(id);

        let ban = new Ban(4, 1, new Date("2019-01-01"), id);
        assert.equal(b.getId(), ban.getId());
        assert.equal(b.getUserId(), ban.getUserId());
        assert.equal(b.getAdminId(), ban.getAdminId());
        assert.equal(b.getExpirationDate().getTime(), ban.getExpirationDate().getTime());

    });
    it('should throw error for Ban with ID == 2', async function() {
        assert.throws(async function() { 
            await DBInterface.getBan(2)
        }, Error);
    });
});

