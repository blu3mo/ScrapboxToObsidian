
// From https://scrapbox.io/takker/選択範囲をMarkdown記法に変換してclip_boardにcopyするPopupMenu

// @ts-check

/**
 * @typedef {import("https://esm.sh/@progfay/scrapbox-parser@7.2.0").Block} Block
 * @typedef {import("https://esm.sh/@progfay/scrapbox-parser@7.2.0").Table} Table
 * @typedef {import("https://esm.sh/@progfay/scrapbox-parser@7.2.0").Line} Line
 * @typedef {import("https://esm.sh/@progfay/scrapbox-parser@7.2.0").Node} NodeType
 * @typedef {import("https://raw.githubusercontent.com/scrapbox-jp/types/0.3.4/scrapbox.ts").Scrapbox} Scrapbox
 */

/** Scrapbox記法をMarkdown記法に変える
 *
 * @param {Block} block
 * @param {number} topIndentLevel
 * @return {string}
 */
export const convertSb2Md = (block, topIndentLevel) => {
  switch (block.type) {
    case "title":
      return ""; // タイトルは選択範囲に入らないので無視
    case "codeBlock":
      return [
        block.fileName,
        `\n\`\`\`${getFileType(block.fileName)}`,
        block.content,
        "\`\`\`\n",
      ].join("\n");
    case "table":
      return convertTable(block);
    case "line":
      return convertLine(block, topIndentLevel);
  }
};

/** Table記法の変換
 *
 * @param {Table} table
 * @return {string}
 */
const convertTable = (table) => {
  const line = [table.fileName];
  // columnsの最大長を計算する
  const maxCol = Math.max(...table.cells.map((row) => row.length));
  table.cells.forEach((row, i) => {
    line.push(
      `| ${
        row.map((column) => column.map((node) => convertNode(node)).join(""))
          .join(" | ")
      } |`,
    );
    if (i === 0) line.push(`|${" -- |".repeat(maxCol)}`);
  });
  return line.join("\n");
};

const INDENT = "    "; // インデントに使う文字

/** 行の変換
 *
 * @param {Line} line
 * @param {number} topIndentLevel
 * @return {string}
 */
const convertLine = (line, topIndentLevel) => {
  const content = line.nodes
    .map((node) =>
      convertNode(node, { section: line.indent === topIndentLevel })
    ).join("").trim();
  if (content === "") return ""; // 空行はそのまま返す

  // リストを作る
  if (line.indent === topIndentLevel) return content; // トップレベルの行はインデントにしない
  let result = INDENT.repeat(line.indent - topIndentLevel - 1);
  if (!/^\d+\. /.test(content)) result += "- "; // 番号なしの行は`-`を入れる
  return result + content;
};

/** Nodeを変換する
 *
 * @param {NodeType} node
 * @param {{section?:boolean}} [init]
 * @return {string}
 */
const convertNode = (node, init) => {
  const { section = false } = init ?? {};
  switch (node.type) {
    case "quote":
      return `> ${node.nodes.map((node) => convertNode(node)).join("")}`;
    case "helpfeel":
      return `\`? ${node.text}\``;
    case "image":
    case "strongImage":
      return `![image](${node.src})`;
    case "icon":
    case "strongIcon":
      // 仕切り線だけ変換する
      return ["/icons/hr", "/scrapboxlab/hr"]
        .includes(node.path)
        ? "---"
        : "";
    case "strong":
      return `**${node.nodes.map((node) => convertNode(node)).join("")}**`;
    case "formula":
      return `$${node.formula}$`;
    case "decoration": {
      let result = node.nodes.map((node) => convertNode(node)).join("");
      if (node.decos.includes("/")) result = `*${result}*`;
      // 見出しの変換
      // お好みで変えて下さい
      if (section) {
        if (node.decos.includes("*-3")) result = `# ${result}\n`;
        if (node.decos.includes("*-2")) result = `## ${result}\n`;
        if (node.decos.includes("*-1")) result = `### ${result}\n`;
      } else {
        if (node.decos.some((deco) => /\*-/.test(deco[0]))) {
          result = `**${result}**`;
        }
      }
      if (node.decos.includes("~")) result = `~~${result}~~`;
      return result;
    }
    case "code":
      return `\`${node.text}\``;
    case "commandLine":
      return `\`${node.symbol} ${node.text}\``;
    case "link":
      switch (node.pathType) {
        case "root":
          return `[${node.href}](https://scrapbox.io${node.href})`;
        case "relative":
          //@ts-ignore declare宣言が使えないため、`scrapbox`に型定義をつけられない
          return `[${node.href}](https://scrapbox.io/${scrapbox.Project.name}/${node.href})`;
        default:
          return node.content === "" ?
            ` ${node.href} ` :
            `[${node.content}](${node.href})`;
      }
    case "googleMap":
      return `[${node.place}](${node.url})`;
    case "hashTag":
      //@ts-ignore declare宣言が使えないため、`scrapbox`に型定義をつけられない
      return `[#${node.href}](https://scrapbox.io/${scrapbox.Project.name}/${node.href})`;
    case "blank":
    case "plain":
      return node.text;
  }
};

const extensionData = [
    {
        extensions: ["javascript", "js"],
        fileType: "javascript",
    },
    {
        extensions: ["typescript", "ts"],
        fileType: "typescript",
    },
    {
        extensions: ["cpp", "hpp"],
        fileType: "cpp",
    },
    {
        extensions: ["c", "cc", "h"],
        fileType: "c",
    },
    {
        extensions: ["cs", "csharp"],
        fileType: "cs",
    },
    {
        extensions: ["markdown", "md"],
        fileType: "markdown",
    },
    {
        extensions: ["htm", "html"],
        fileType: "html",
    },
    {
        extensions: ["json"],
        fileType: "json",
    },
    {
        extensions: ["xml"],
        fileType: "xml",
    },
    {
        extensions: ["yaml", "yml"],
        fileType: "yaml",
    },
    {
        extensions: ["toml"],
        fileType: "toml",
    },
    {
        extensions: ["ini"],
        fileType: "ini",
    },
    {
        extensions: ["tex", "sty"],
        fileType: "tex",
    },
    {
        extensions: ["svg"],
        fileType: "svg",
    },
];

/** ファイル名の拡張子から言語を取得する
 *
 * @param {string} filename
 * @return {string}
 */
const getFileType = (filename) => {
    const filenameExtention = filename.replace(/^.*\.(\w+)$/, "$1");
    return extensionData
            .find((data) => data.extensions.includes(filenameExtention))?.fileType ??
        "";
};
