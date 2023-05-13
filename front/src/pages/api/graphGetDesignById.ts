import { NextApiRequest, NextApiResponse } from "next";
import client from "../../helpers/apolloClient";
import { getDesignById } from "../../helpers/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.body;

    const { data, error } = await client.query({
      query: getDesignById,
      variables: {
        id,
      },
    });

    if (error) {
      res.status(404).json({ error: "An error occurred" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
}
