import { gql } from "@apollo/client";

export const getDesigns = gql`
  query GetDesigns($first: Int) {
    designCreateds(first: 5) {
      id
      designId
      owner
      reward
      info
    }
  }
`;

export const getDesignById = gql`
  query DesignCreated($id: ID!) {
    designCreated(id: $id) {
      id
      designId
      info
      reward
    }
  }
`;

export const getReviewsByDesignId = gql`
  query GetReviewsByDesignId($designId: ID!) {
    reviewCreateds(where: { designId: $designId }) {
      id
      reviewId
      reviewer
      designId
      posX
      posY
      comment
    }
  }
`;

export const getUpVotesByReviewId = gql`
  query GetUpVotesByReviewId($reviewId: ID!) {
    reviewUpvoteds(where: { reviewId: $reviewId }) {
      id
      reviewId
      upVotes
    }
  }
`;
