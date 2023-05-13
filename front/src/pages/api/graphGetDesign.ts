import { NextApiRequest, NextApiResponse } from "next";
import client from "../../helpers/apolloClient";
import { getDesigns } from "../../helpers/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await client.query({
      query: getDesigns,
      variables: {
        first: 10,
      },
    });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
}
