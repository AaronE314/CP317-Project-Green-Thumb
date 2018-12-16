"use strict";
const assert = require("assert");
const Plant = require("../../backend/Plant");

describe("Plant Tests", () => {

    it("getId() should return the plants id attribute",
        /**
         * @author Noah Nichols
         */
        () => {
            let plant = new Plant("Devil's Lettuce", "If a tree falls in the forest, is it really a forest?", 1);
            assert.equal(plant.getId(), 1);
        });

    it("getName() should return the plant's name",
        /**
         * @author Noah Nichols
         */
        () => {
            let plant = new Plant("Devil's Lettuce", "If a tree falls in the forest, is it really a forest?", 1);
            assert.equal(plant.getName(), "Devil's Lettuce");
        });

    it("getBio() should return the plant's bio",
        /**
         * @author Noah Nichols
         */
        () => {
            let plant = new Plant("Devil's Lettuce", "If a tree falls in the forest, is it really a forest?", 1);
            assert.equal(plant.getBio(), "If a tree falls in the forest, is it really a forest?");
        });

    it("toJSON() should produce an object containing a copy of the attributes of the plant object",
        /**
         * @author Noah Nichols
         */
        () => {
            let plant = new Plant("Devil's Lettuce", "If a tree falls in the forest, is it really a forest?", 1);
            let toJSON = plant.toJSON();
            assert.notDeepStrictEqual(plant, toJSON);
            assert.equal(toJSON.id, 1);
            assert.equal(toJSON.name, "Devil's Lettuce");
            assert.equal(toJSON.bio, "If a tree falls in the forest, is it really a forest?");
            assert(!(toJSON.reportDate < new Date(0)) && !(toJSON.reportDate > new Date(0)));
        });
});