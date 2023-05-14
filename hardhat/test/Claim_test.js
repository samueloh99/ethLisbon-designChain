const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DesignChain", function () {
  let accounts, designChain;

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    const DesignChain = await ethers.getContractFactory("DesignChain");
    designChain = await DesignChain.deploy();
    await designChain.deployed();
  });

  describe("Distribute Reward", function () {
    beforeEach(async function () {
      const info = "QmAbCdEfGhIjKlMnOpQrStUvWxYz";
      const comment = "Review Comment";
      const posX = 100;
      const posY = 200;

      // Create design and reviews
      await designChain
        .connect(accounts[0])
        .createDesign(info, ethers.utils.parseEther("5"), {
          value: ethers.utils.parseEther("5"),
        });

      for (let i = 1; i <= 7; i++) {
        await designChain
          .connect(accounts[i])
          .createReview(1, comment, posX, posY);
      }

      // Upvote reviews to create a ranking
      for (let i = 7; i >= 1; i--) {
        for (let j = 0; j <= 7 - i; j++) {
          await designChain.connect(accounts[j]).upvoteReview(i);
        }
      }

      // Increase block timestamp by 10 days
      await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
    });

    it("Should distribute rewards to top 5 reviewers", async function () {
      await expect(designChain.distributeReward(1))
        .to.emit(designChain, "RewardDistributed")
        .withArgs(1, 1, accounts[1].address); // Check with first top reviewer. Repeat for others

      const review = await designChain.reviews(1);
      expect(review.isRewarded).to.be.true;
    });

    it("Should mark the design as completed after rewards distribution", async function () {
      await designChain.distributeReward(1);

      const design = await designChain.designs(1);
      expect(design.isCompleted).to.be.true;
    });

    it("Should not allow rewards distribution before 10 days", async function () {
      // Decrease block timestamp by 10 days
      await ethers.provider.send("evm_increaseTime", [-10 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      await expect(designChain.distributeReward(1)).to.be.revertedWith(
        "Reward can only be distributed after 10 days of the design creation."
      );
    });

    it("Should not allow rewards distribution more than once", async function () {
      await designChain.distributeReward(1);

      await expect(designChain.distributeReward(1)).to.be.revertedWith(
        "Rewards have already been distributed for this design."
      );
    });
  });
});
