import {
  DesignCreated as DesignCreatedEvent,
  ReviewCreated as ReviewCreatedEvent,
  ReviewUpvoted as ReviewUpvotedEvent,
  RewardClaimed as RewardClaimedEvent
} from "../generated/Contract/Contract"
import {
  DesignCreated,
  ReviewCreated,
  ReviewUpvoted,
  RewardClaimed
} from "../generated/schema"

export function handleDesignCreated(event: DesignCreatedEvent): void {
  let entity = new DesignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.designId = event.params.designId
  entity.owner = event.params.owner
  entity.info = event.params.info
  entity.reward = event.params.reward

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReviewCreated(event: ReviewCreatedEvent): void {
  let entity = new ReviewCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reviewId = event.params.reviewId
  entity.reviewer = event.params.reviewer
  entity.designId = event.params.designId
  entity.comment = event.params.comment
  entity.posX = event.params.posX
  entity.posY = event.params.posY

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReviewUpvoted(event: ReviewUpvotedEvent): void {
  let entity = new ReviewUpvoted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reviewId = event.params.reviewId
  entity.voter = event.params.voter
  entity.upVotes = event.params.upVotes

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardClaimed(event: RewardClaimedEvent): void {
  let entity = new RewardClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.designId = event.params.designId
  entity.reviewId = event.params.reviewId
  entity.reviewer = event.params.reviewer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
