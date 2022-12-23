import { convertScrapboxToObsidian } from "./convert.js";
import { parse } from "https://esm.sh/@progfay/scrapbox-parser@8.1.0";
import { ensureDir } from "https://deno.land/std@0.170.0/fs/mod.ts";

await ensureDir("./obsidianPages");

const filePath = Deno.args[0];
const projectName = Deno.args[1] ?? "PROJECT_NAME";
try {
  const projectFile = await Deno.readTextFile(`./${filePath}`);
  const projectJson = JSON.parse(projectFile);
  const pages = projectJson["pages"];
  for (const page of pages) {
    const blocks = parse(page["lines"].join("\n"));
    const obsidianPage = blocks.map((block) =>
      convertScrapboxToObsidian(block, 0, projectName)
    ).join("\n");
    const obsidianPagePath = `./obsidianPages/${
      page["title"].replace(/\//gi, "-")
    }.md`;
    await Deno.writeTextFile(obsidianPagePath, obsidianPage);
    await Deno.utime(obsidianPagePath, new Date(), page["updated"]);
  }
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("the file was not found");
  } else {
    throw error;
  }
}
