import { convertScrapboxToObsidian } from "./convert.js";
import { parse } from "https://esm.sh/@progfay/scrapbox-parser@7.2.0"
import { readLines } from 'https://deno.land/std/io/mod.ts'
import clipboard from 'https://deno.land/x/clipboard/mod.ts';

console.log("Test Deno")
// const lines = []
// for await (const line of readLines(Deno.stdin)) {
//     lines.push(line)
// }
const text = await clipboard.readText();
const blocks = parse(text)
const md = blocks.map((block) => convertScrapboxToObsidian(block, 0, "villagepump")).join("\n")
console.log(md)
await clipboard.writeText(md);
