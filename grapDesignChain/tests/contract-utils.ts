import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  DesignCreated,
  ReviewCreated,
  ReviewUpvoted,
  RewardClaimed
} from "../generated/Contract/Contract"

export function createDesignCreatedEvent(
  designId: BigInt,
  owner: Address,
  info: string,
  reward: BigInt
): DesignCreated {
  let designCreatedEvent = changetype<DesignCreated>(newMockEvent())

  designCreatedEvent.parameters = new Array()

  designCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "designId",
      ethereum.Value.fromUnsignedBigInt(designId)
    )
  )
  designCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  designCreatedEvent.parameters.push(
    new ethereum.EventParam("info", ethereum.Value.fromString(info))
  )
  designCreatedEvent.parameters.push(
    new ethereum.EventParam("reward", ethereum.Value.fromUnsignedBigInt(reward))
  )

  return designCreatedEvent
}

export function createReviewCreatedEvent(
  reviewId: BigInt,
  reviewer: Address,
  designId: BigInt,
  comment: string,
  posX: BigInt,
  posY: BigInt
): ReviewCreated {
  let reviewCreatedEvent = changetype<ReviewCreated>(newMockEvent())

  reviewCreatedEvent.parameters = new Array()

  reviewCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "reviewId",
      ethereum.Value.fromUnsignedBigInt(reviewId)
    )
  )
  reviewCreatedEvent.parameters.push(
    new ethereum.EventParam("reviewer", ethereum.Value.fromAddress(reviewer))
  )
  reviewCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "designId",
      ethereum.Value.fromUnsignedBigInt(designId)
    )
  )
  reviewCreatedEvent.parameters.push(
    new ethereum.EventParam("comment", ethereum.Value.fromString(comment))
  )
  reviewCreatedEvent.parameters.push(
    new ethereum.EventParam("posX", ethereum.Value.fromUnsignedBigInt(posX))
  )
  reviewCreatedEvent.parameters.push(
    new ethereum.EventParam("posY", ethereum.Value.fromUnsignedBigInt(posY))
  )

  return reviewCreatedEvent
}

export function createReviewUpvotedEvent(
  reviewId: BigInt,
  voter: Address,
  upVotes: BigInt
): ReviewUpvoted {
  let reviewUpvotedEvent = changetype<ReviewUpvoted>(newMockEvent())

  reviewUpvotedEvent.parameters = new Array()

  reviewUpvotedEvent.parameters.push(
    new ethereum.EventParam(
      "reviewId",
      ethereum.Value.fromUnsignedBigInt(reviewId)
    )
  )
  reviewUpvotedEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  reviewUpvotedEvent.parameters.push(
    new ethereum.EventParam(
      "upVotes",
      ethereum.Value.fromUnsignedBigInt(upVotes)
    )
  )

  return reviewUpvotedEvent
}

export function createRewardClaimedEvent(
  designId: BigInt,
  reviewId: BigInt,
  reviewer: Address
): RewardClaimed {
  let rewardClaimedEvent = changetype<RewardClaimed>(newMockEvent())

  rewardClaimedEvent.parameters = new Array()

  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "designId",
      ethereum.Value.fromUnsignedBigInt(designId)
    )
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "reviewId",
      ethereum.Value.fromUnsignedBigInt(reviewId)
    )
  )
  rewardClaimedEvent.parameters.push(
    new ethereum.EventParam("reviewer", ethereum.Value.fromAddress(reviewer))
  )

  return rewardClaimedEvent
}
