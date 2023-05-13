import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const worldcoinKey = process.env.NEXT_PUBLIC_WORLDCOIN_API_KEY;
    const verify = await axios.post(
      `https://developer.worldcoin.org/api/v1/verify/${worldcoinKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nullifier_hash:
            "0x2bf8406809dcefb1486dadc96c0a897db9bab002053054cf64272db512c6fbd8",
          merkle_root:
            "0x2264a66d162d7893e12ea8e3c072c51e785bc085ad655f64c10c1a61e00f0bc2",
          proof:
            "0x1aa8b8f3b2d2de5ff452c0e1a83e29d6bf46fb83ef35dc5957121ff3d3698a1119090fb...",
          credential_type: "orb",
          action: "my_action",
          signal: "my_signal",
        }),
      }
    );

    console.log(verify);

    res.status(200).json({ msg: "HEHE" });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
}
