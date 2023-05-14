// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract DesignChain_IntegratingApe is AutomationCompatibleInterface {
    IERC20 public apeToken;

    struct User {
        address userAddress;
        uint256 totalRequests; // Number of design review requests
        uint256 totalReviews; // Number of reviews provided
    }

    struct PostDesign {
        uint256 id;
        address owner;
        string info; // IPFS hash with some info, like: title, description and image url
        uint256 reward; // deposit reward for feedback providers
        uint256 reviewCount; // number of reviews received
        bool isCompleted; // flag to indicate if feedback reward is completed
        uint256[] reviewIds; // array to store review IDs for this design
        uint256 createdTime; // timestamp of when the design was created
    }

    struct ReviewDesign {
        uint256 id;
        address reviewer;
        uint256 designId;
        string comment; // IPFS hash for the comment
        uint256 posX; // X-coordinate for pinning comment on the image
        uint256 posY; // Y-coordinate for pinning comment on the image
        bool isRewarded; // flag to indicate if the reviewer has received the reward
        uint256 upVotes; // number of upvotes received
    }

    // Events
    event DesignCreated(
        uint256 designId,
        address owner,
        string info,
        uint256 reward,
        uint256 createdTime
    );

    event ReviewCreated(
        uint256 reviewId,
        address reviewer,
        uint256 designId,
        string comment,
        uint256 posX,
        uint256 posY
    );
    event ReviewUpvoted(uint256 reviewId, address voter, uint256 upVotes);

    event RewardClaimed(
        uint256 indexed designId,
        uint256 indexed reviewId,
        address indexed reviewer
    );

    // Mapping to store user data
    mapping(address => User) public users;

    // Mapping to store design data by design ID
    mapping(uint256 => PostDesign) public designs;

    // Mapping to store review data by review ID
    mapping(uint256 => ReviewDesign) public reviews;

    // Mapping to store user votes (prevents double voting)
    // mapping[reviewId][voterAddress] => hasVoted
    mapping(uint256 => mapping(address => bool)) public userUpVotes;

    uint256 public designCounter;
    uint256 public reviewCounter;

    constructor(address _apeTokenAddress) {
        apeToken = IERC20(_apeTokenAddress);
    }

    function createDesign(string memory _info, uint256 _reward) public {
        require(
            apeToken.balanceOf(msg.sender) >= _reward,
            "Insufficient balance."
        );

        // reminder: first you need to approve the contract to transfer the tokens
        apeToken.transferFrom(msg.sender, address(this), _reward);

        designCounter++;

        // Update user data
        User storage user = users[msg.sender];
        user.userAddress = msg.sender;
        user.totalRequests++;

        // Create new design struct
        designs[designCounter] = PostDesign(
            designCounter,
            msg.sender,
            _info,
            _reward,
            0,
            false,
            new uint256[](0),
            block.timestamp
        );

        emit DesignCreated(
            designCounter,
            msg.sender,
            _info,
            _reward,
            designs[designCounter].createdTime
        );
    }

    function createReview(
        uint256 _designId,
        string memory _comment,
        uint256 _posX,
        uint256 _posY
    ) public {
        require(
            designs[_designId].isCompleted == false,
            "Design feedback process is completed."
        );

        reviewCounter++;

        // update user data
        User storage user = users[msg.sender];
        user.userAddress = msg.sender;
        user.totalReviews++;

        // Create new review
        reviews[reviewCounter] = ReviewDesign(
            reviewCounter,
            msg.sender,
            _designId,
            _comment,
            _posX,
            _posY,
            false,
            0
        );

        // Update review counter and add review ID to the design's reviewIds array
        designs[_designId].reviewCount++;
        designs[_designId].reviewIds.push(reviewCounter);

        emit ReviewCreated(
            reviewCounter,
            msg.sender,
            _designId,
            _comment,
            _posX,
            _posY
        );
    }

    // Get the reviews IDs for a design
    function getReviewIds(
        uint256 _designId
    ) public view returns (uint256[] memory) {
        return designs[_designId].reviewIds;
    }

    function upvoteReview(uint256 _reviewId) public {
        require(
            userUpVotes[_reviewId][msg.sender] == false,
            "User has already voted for this review."
        );

        // Update the number of votes for the review
        reviews[_reviewId].upVotes++;

        // Mark that the user has voted for this review
        userUpVotes[_reviewId][msg.sender] = true;

        // Emit ReviewUpvoted event with updated upVotes count
        emit ReviewUpvoted(_reviewId, msg.sender, reviews[_reviewId].upVotes);
    }

    /**
     * @notice Distribute the rewards to the top 5 reviewers of a design
     * @dev The distribution can only happen 10 days after the design was posted and if the reward has not already been distributed.
     * This function can be called by anyone.
     * @param _designId The id of the design for which the reward should be distributed
     */
    function distributeReward(uint256 _designId) public {
        PostDesign storage design = designs[_designId];
        require(
            block.timestamp >= design.createdTime + 10 days,
            "Design feedback reward can only be distributed after 10 days."
        );
        require(
            !design.isCompleted,
            "Rewards have already been claimed for this design."
        );
        require(design.reward > 0, "Reward amount must be greater than zero.");

        uint256[] memory topReviews = new uint256[](5);
        for (uint256 i = 0; i < design.reviewIds.length; i++) {
            uint256 currentReviewId = design.reviewIds[i];
            uint256 currentReviewVotes = reviews[currentReviewId].upVotes;

            for (uint256 j = 0; j < 5; j++) {
                if (currentReviewVotes > reviews[topReviews[j]].upVotes) {
                    for (uint256 k = 4; k > j; k--) {
                        topReviews[k] = topReviews[k - 1];
                    }
                    topReviews[j] = currentReviewId;
                    break;
                }
            }
        }

        uint256 rewardAmount = design.reward / 5;
        for (uint256 i = 0; i < 5; i++) {
            if (!reviews[topReviews[i]].isRewarded) {
                apeToken.transfer(
                    reviews[topReviews[i]].reviewer,
                    rewardAmount
                );

                // Decrease the remaining reward in the design
                design.reward -= rewardAmount;

                // Mark the review as rewarded
                reviews[topReviews[i]].isRewarded = true;
            }
        }

        bool allRewardsClaimed = true;
        for (uint256 i = 0; i < 5; i++) {
            if (!reviews[topReviews[i]].isRewarded) {
                allRewardsClaimed = false;
                break;
            }
        }

        if (allRewardsClaimed) {
            design.isCompleted = true;
        }
    }

    /**
     * @notice This function is used to find the first eligible design ID for reward distribution.
     * An eligible design is one that is not yet completed and was created at least 10 days ago.
     * This function will iterate through all the designs and return the ID of the first design
     * that fulfills the eligibility criteria.
     * @return The ID of the eligible design.
     * @dev The function reverts if no eligible design is found.
     */
    function getEligibleDesignId() public view returns (uint256) {
        uint256 currentTime = block.timestamp;

        for (uint256 i = 1; i <= designCounter; i++) {
            PostDesign storage design = designs[i];
            if (
                !design.isCompleted &&
                currentTime >= design.createdTime + 10 days
            ) {
                return i;
            }
        }

        revert("No eligible design found.");
    }

    /**
     * @notice This function checks if there is an eligible design ID for reward distribution.
     * @dev It calls the getEligibleDesignId() function and returns true if there is an eligible design, false otherwise.
     * @return A boolean indicating if there is an eligible design.
     */
    function isEligibleDesignAvailable() public view returns (bool) {
        try this.getEligibleDesignId() {
            return true;
        } catch {
            return false;
        }
    }

    // Chainlink Implementation
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        upkeepNeeded = isEligibleDesignAvailable();
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        // the function reverts if no eligible design is found.
        uint256 eligibleDesigId = getEligibleDesignId();

        distributeReward(eligibleDesigId);
    }
}
//deploy:
//polygon: https://mumbai.polygonscan.com/address/0xf9f8eC75919f7E6F5179a802537111233E0d7B1e#code
