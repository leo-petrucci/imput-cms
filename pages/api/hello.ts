// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest } from "next";
// @ts-ignore
import wasm from "../../lib/wasm_bg.wasm?module";

export const config = {
  runtime: "experimental-edge",
};

function convertToNumber(given: string) {
  if (given.startsWith("0x")) {
    return parseInt(given.slice(2), 16);
  }

  return parseInt(given, 10);
}

function hexFormat(given: number) {
  const str = given.toString(16);
  return "0x" + "0".repeat(8 - str.length) + str;
}

export default async function handler(request: NextApiRequest) {
  if (!request.query.a || !request.query.b) {
    return new Response("Two inputs are required", { status: 400 });
  }

  const a = convertToNumber(request.query.a as string);
  const b = convertToNumber(request.query.b as string);

  const { exports } = (await WebAssembly.instantiate(wasm)) as any;

  const value = exports.xor(a, b);
  return new Response(hexFormat(value));
}
