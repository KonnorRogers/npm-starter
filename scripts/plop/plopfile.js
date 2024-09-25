import { readdirSync } from "fs";
import { fdir } from "fdir"
import * as process from "process";
import * as path from "path";

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

export default function (plop) {
  const componentPrefix = "";

  function tagWithoutPrefix(tag) {
    return tag.replace(new RegExp(`^${componentPrefix}`), "");
  }

  function tagToTitle(tag) {
    const withoutPrefix = plop.getHelper("tagWithoutPrefix");
    const titleCase = plop.getHelper("titleCase");
    return titleCase(withoutPrefix(tag).replace(/-/g, " "));
  }

  plop.setHelper("tagWithoutPrefix", tagWithoutPrefix);
  plop.setHelper("tagToTitle", tagToTitle);

  plop.setGenerator("component", {
    description: "Generate a new component",
    prompts: [
      {
        type: "input",
        name: "tag",
        message: `Tag name? (e.g. ${componentPrefix}button)`,
        validate: (value) => {
          // Start with light- and include only a-z + dashes
          const regex = new RegExp(`^${componentPrefix}[a-z-+]+`);

          if (!regex.test(value)) {
            console.error(`Tag must start with ${componentPrefix}`);
            return false;
          }

          // No double dashes or ending dash
          if (value.includes("--") || value.endsWith("-")) {
            return false;
          }

          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "../../exports/components/{{ tag }}/{{ tag }}-register.js",
        templateFile: "templates/component-register.hbs",
      },
      {
        type: "add",
        path: "../../exports/components/{{ tag }}/{{ tag }}-globals.ts",
        templateFile: "templates/component-globals.hbs",
      },
      {
        type: "add",
        path: "../../exports/components/{{ tag }}/{{ tag }}.js",
        templateFile: "templates/component.hbs",
      },
      {
        type: "add",
        path: "../../exports/components/{{ tag }}/{{ tag }}.styles.js",
        templateFile: "templates/component-styles.hbs",
      },
      {
        type: "add",
        path: "../../tests/{{ tag }}.test.js",
        templateFile: "templates/component-tests.hbs",
      },
      {
        type: "add",
        path: "../../docs/src/_documentation/components/{{ tag }}.md",
        templateFile: "templates/component-docs.hbs",
      },
      {
        type: "modify",
        path: "../../exports/index.js",
        transform(fileContents, data) {
          const properCase = plop.getHelper("properCase");
          const directories = getDirectories(
            path.resolve(process.cwd(), "exports", "components"),
          );
          const contents = directories.sort().map((directoryName) => {
            // const componentPath = tagWithoutPrefix(directoryName)
            const componentPath = directoryName;
            return `export { default as ${properCase(directoryName)} } from "./components/${componentPath}/${componentPath}-register.js"`;
          });
          return contents.join("\n");
        },
      },
    ],
  });

  plop.setGenerator("rename-package", function (data) {
    console.warn(`Renaming a package is a one time process. This process cannot be repeated.`)

    const files = new fdir({
      includeDirs: false,
      exclude (dirName, dirPath) {
        if (dirPath.includes("/node_modules/")) {
          return true
        }

        if (dirName.includes("/node_modules/")) {
          return true
        }

        return false
      }
    })
    .withBasePath()
    .crawl(".")

    console.log(files)

    const actions = []
    actions.push({
      type: "modify",
      path: filePath,
      transform(fileContents, data) {
        console.log(plop.renderString(fileContents, data))

        return fileContents
      }
    })

    return {
      description: "Change the package name",
      prompts: [
        {
          type: "input",
          name: "packageName",
          message: `Choose a package name (ex. do-the-roar)`,
        }
      ],
      actions
    }
  })
}
