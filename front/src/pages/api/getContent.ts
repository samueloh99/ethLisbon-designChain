import { NextApiRequest, NextApiResponse } from "next";
import { Web3Storage } from "web3.storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new Web3Storage({
    token: process.env.NEXT_PUBLIC_API_KEY_WEB3 as string,
  });

  try {
    const { cid } = req.body;

    const content: any = await client.get(cid);

    if (!content) {
      res.status(404).json({ error: "Content not found" });
      return;
    }

    // Assuming the content is text for this example
    const files = await content.files();

    const fileData = [];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        // This is an image file
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const dataUrl = `data:${
          file.type || "application/octet-stream"
        };base64,${base64}`;
        fileData.push({ name: file.name, url: dataUrl });
      } else {
        // This is a text file
        const text = await file.text();
        fileData.push({ name: file.name, content: text });
      }
    }

    res.status(200).json({ data: fileData });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
}
