// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// import initDb from "../../lib/db";
// @ts-ignore
import wasmModule from "../../lib/sql-wasm.wasm?module";

type Data = {
  info: any;
};

export const config = {
  runtime: "experimental-edge",
};

const hello = async (_req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { exports } = (await WebAssembly.instantiate(wasmModule)) as any;
  // const db = await initDb();
  // const stmt = db.prepare("SELECT rowid AS id, info FROM lorem");

  // const result = stmt.getAsObject();
  res.status(200).json({ info: exports });
};

export default hello;
