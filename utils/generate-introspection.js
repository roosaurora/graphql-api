const fs = require("fs-extra");
const prettier = require("prettier");
const fromPairs = require("lodash/fromPairs");
const { buildSchema, introspectionFromSchema } = require("graphql");
const mri = require("mri");
const argv = process.argv.slice(2);

// TODO: Expose input
async function main() {
  const args = mri(argv, {
    default: {
      verbose: false,
    },
    boolean: ["verbose"],
  });
  const { _: verbose } = args;
  const schema = await fs.readFile("./server/types/schema.gql", {
    encoding: "utf8",
  });
  const introspection = fromPairs(
    introspectionFromSchema(buildSchema(schema), {
      descriptions: true,
    }).__schema.types.map(type => {
      return [type.name, type];
    })
  );

  const code = `const introspection = ${JSON.stringify(introspection)};
export default introspection;`;

  // TODO: Extract output file as a parameter. Also get cwd from process or argv.
  await fs.writeFile(
    "./server/types/schema.ts",
    prettier.format(code, JSON.parse(await fs.readFile("./.prettierrc")))
  );
}

main();
