import { NextApiRequest, NextApiResponse } from "next";
import client from "../../helpers/apolloClient";
import {
  getReviewsByDesignId,
  getUpVotesByReviewId,
} from "../../helpers/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.body;

    const { data, error } = await client.query({
      query: getReviewsByDesignId,
      variables: {
        designId: id,
      },
    });

    const formattedMap = data.reviewCreateds.map(
      async (item: any) => {
        const { data, error } = await client.query({
          query: getUpVotesByReviewId,
          variables: {
            reviewId: item.reviewId,
          },
        });

        let votes = data.reviewUpvoteds[0];

        return {
          ...item,
          votes: votes !== undefined ? votes.upVotes : 0,
        };
      }
    );

    const response = await Promise.all(formattedMap);

    if (error) {
      res.status(404).json({ error: "An error occurred" });
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
}
