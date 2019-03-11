const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");
const prettier = require("prettier");
const extractReactTypes = require("@bebraw/extract-react-types");
const flatMap = require("lodash/flatMap");
const fromPairs = require("lodash/fromPairs");
const mri = require("mri");
const argv = process.argv.slice(2);

async function main() {
  const args = mri(argv, {
    default: {
      format: "tsx",
      verbose: false,
    },
    boolean: ["verbose"],
    string: ["format"],
  });
  const { _: rootDirs, format, verbose } = args;

  const filenames = flatMap(rootDirs, dir =>
    glob.sync(`${dir}/**/*.${format}`)
  );
  const result = fromPairs(
    filenames.map(filename => {
      return [
        path.basename(filename, path.extname(filename)),
        extractReactTypes(
          fs.readFileSync(filename, { encoding: "utf8" }),
          "typescript",
          filename
        ),
      ];
    })
  );
  const code = `const componentTypes = ${JSON.stringify(result)};
export default componentTypes;`;

  // TODO: Extract output directory as a parameter. Also get cwd from process or argv.
  await fs.writeFile(
    path.join(__dirname, "../server/types/component-types.ts"),
    prettier.format(code, { parser: "typescript" })
  );
}

main();
