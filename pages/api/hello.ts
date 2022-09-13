// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

type Data = {
  info: any;
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  db.serialize(() => {
    db.all("SELECT rowid AS id, info FROM lorem", (err, row) => {
      res.status(200).json({ info: row });
    });
  });
}
