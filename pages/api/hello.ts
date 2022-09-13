// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// import initDb from "../../lib/db";
// @ts-ignore
// import wasmModule from "../../lib/sql-wasm.wasm?module";
import wasm from "../../lib/pkg/wasm_bg.wasm?module";

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

export default async function handler(request: Request, event: Event) {
  const url = new URL(request.url);

  if (!url.searchParams.get("a") || !url.searchParams.get("b")) {
    return new Response("Two inputs are required", { status: 400 });
  }

  const a = convertToNumber(url.searchParams.get("a")!);
  const b = convertToNumber(url.searchParams.get("b")!);

  const { exports } = (await WebAssembly.instantiate(wasm)) as any;

  const value = exports.xor(a, b);
  return new Response(hexFormat(value));
}
