import { convertSb2Md } from "./convert.js";
import { parse } from "https://esm.sh/@progfay/scrapbox-parser@7.2.0"

console.log("Test Deno")
const blocks = parse(" Scrapbox -> Obsidian Markdownの変換\n" +
    "  https://gist.github.com/chkk525/3dcdffc5b6a4441b5f618a12398a63f7#file-scrapbox2obsidian-py\n" +
    "   いくつか不具合があるので直す\n" +
    "   　インデントのスペース、多分半角にしか対応してない\n" +
    "   　non-Gyazoの画像も変換できてない\n" +
    "   　リンクではない物がリンクになる\n" +
    "    　アイコンがリンクになっちゃう\n" +
    "    　 `[blu3mo.icon*3]`みたいなのも対応してない\n" +
    "    　[/ XX]みたいな装飾記法がリンクになってしまう\n" +
    "  \t\tTeX\n" +
    "  \t\tインデント中のコードブロック\n" +
    "  \t\t\tcode:たとえばこういうの\n" +
    "  \t\t\t \n" +
    "  \t\t\tMarkdownにこれを表現する能力は無かった気がする[sta.icon]\n" +
    "  \t\t\tああ、逆か。失敬\n" +
    "  \t\t\tscrapbox to markdownだと思っていた\n" +
    "  　　　　あってます[blu3mo.icon]\n" +
    "  　　[TeX]対応、`[$ x]` => `$$ x $$`")
const md = blocks.map((block) => convertSb2Md(block, 0)).join("\n")
// console.log(md)