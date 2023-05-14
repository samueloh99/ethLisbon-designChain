const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DesignChain_IntegratingApe", function () {
  let accounts, designChain, apeToken;

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    const Ape = await ethers.getContractFactory("Ape");
    apeToken = await Ape.deploy("Ape Token", "APE");
    await apeToken.deployed();

    const DesignChain_IntegratingApe = await ethers.getContractFactory(
      "DesignChain_IntegratingApe"
    );
    designChain = await DesignChain_IntegratingApe.deploy(apeToken.address);
    await designChain.deployed();
  });

  describe("Claim Reward", function () {
    beforeEach(async function () {
      const info = "QmAbCdEfGhIjKlMnOpQrStUvWxYz";
      const comment = "Review Comment";
      const posX = 100;
      const posY = 200;

      // Mint APE tokens for the first account
      await apeToken.mintOwner(
        accounts[0].address,
        ethers.utils.parseEther("10000")
      );

      // Approve DesignChain to spend APE tokens
      await apeToken
        .connect(accounts[0])
        .approve(designChain.address, ethers.utils.parseEther("5"));

      // Create design and reviews
      await designChain
        .connect(accounts[0])
        .createDesign(info, ethers.utils.parseEther("5"));

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
    });

    async function getTopReviewers() {
      let reviewers = [];

      // Get upvotes for each reviewer and store them along with the reviewer's index.
      for (let i = 1; i <= 7; i++) {
        const review = await designChain.reviews(i);
        reviewers.push({ index: i, upvotes: review.upVotes });
      }

      // Sort the reviewers based on their upvotes.
      reviewers.sort((a, b) => b.upvotes.toNumber() - a.upvotes.toNumber());

      // Return the top 5 reviewers.
      return reviewers.slice(0, 5).map((reviewer) => reviewer.index);
    }

    it("Should allow top 5 reviewers to claim rewards", async function () {
      const topReviewers = await getTopReviewers();

      for (let i = 0; i < topReviewers.length; i++) {
        await expect(
          designChain.connect(accounts[topReviewers[i]]).claimReward(1)
        )
          .to.emit(designChain, "RewardClaimed")
          .withArgs(1, topReviewers[i], accounts[topReviewers[i]].address);

        const review = await designChain.reviews(topReviewers[i]);
        expect(review.isRewarded).to.be.true;

        const reviewerBalance = await apeToken.balanceOf(
          accounts[topReviewers[i]].address
        );
        expect(reviewerBalance).to.equal(ethers.utils.parseEther("1")); // each reviewer gets 1 APE token
      }
    });

    it("Should not allow reviewers outside the top 5 to claim rewards", async function () {
      const topReviewers = await getTopReviewers();

      for (let i = 1; i <= 7; i++) {
        if (!topReviewers.includes(i)) {
          await expect(
            designChain.connect(accounts[i]).claimReward(1)
          ).to.be.revertedWith("The user is not among the top 5 reviewers.");
        }
      }
    });

    it("Should not allow a user to claim a reward more than once", async function () {
      const topReviewers = await getTopReviewers();
      const topReviewer = topReviewers[0];

      await expect(designChain.connect(accounts[topReviewer]).claimReward(1))
        .to.emit(designChain, "RewardClaimed")
        .withArgs(1, topReviewer, accounts[topReviewer].address);

      await expect(
        designChain.connect(accounts[topReviewer]).claimReward(1)
      ).to.be.revertedWith("The user has already claimed the reward.");
    });

    it("Should mark the design as completed once all rewards are claimed", async function () {
      const topReviewers = await getTopReviewers();

      for (let i = 0; i < topReviewers.length; i++) {
        await designChain.connect(accounts[topReviewers[i]]).claimReward(1);
      }

      const design = await designChain.designs(1);
      expect(design.isCompleted).to.be.true;
    });
  });
});
