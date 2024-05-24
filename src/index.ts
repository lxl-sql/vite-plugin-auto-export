import {
  AutoExportOptions,
  ImportOptions,
  ReplaceFileWithDir,
} from "./interface";

const fs = require("fs");
const path = require("path");
import { Plugin } from "vite";

function getImport(options: ImportOptions) {
  const { exportMember, file, keywords, importName, module } = options;
  const _file = file.replace(/.(ts|js)$/, "");
  console.log("_file", _file);
  let _importName = importName;
  if (module === "ES6") {
    if (exportMember === "export") {
      _importName = `* as ${importName}`;
    }
  }
  if (keywords && keywords.indexOf(importName) > -1) {
    let _import = `import ${_importName}Value from './${_file}';`; // 默认 ES6
    if (module === "commonjs") {
      _import = `const ${importName}Value = require("./${_file}")`;
    }
    return {
      import: _import,
      export: `...${importName}Value`,
    };
  } else {
    let _import = `import ${_importName} from './${_file}';`; // 默认 ES6
    if (module === "commonjs") {
      _import = `const ${importName} = require("./${_file}")`;
    }
    return {
      import: _import,
      export: importName,
    };
  }
}

function generateIndexFile(options: ReplaceFileWithDir<AutoExportOptions>) {
  const {
    dir,
    keywords = ["default", "delete"],
    module = "ES6",
    exportMember = "export default",
    suffix = "json",
    outFile = "index.ts",
  } = options;
  const files = fs.readdirSync(dir);
  const imports: string[] = [];
  const exports: string[] = [];

  files.forEach((file: string) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    const importParams: ImportOptions = {
      keywords,
      importName: "",
      file,
      exportMember,
      module,
    };

    if (stat.isDirectory()) {
      // Recursive call for subdirectories
      const subIndexContent = generateIndexFile({
        ...options,
        dir: fullPath,
      });
      const subIndexPath = path.join(fullPath, outFile);
      fs.writeFileSync(subIndexPath, subIndexContent);
      const importName = path.basename(file);
      const rootFile = outFile.replace(/.(ts|js)/, "");
      importParams.importName = importName;
      importParams.file = `${file}/${rootFile}`;
      const result = getImport(importParams);
      imports.push(result.import);
      exports.push(result.export);
    } else {
      if (typeof suffix === "string") {
        const _suffix = `.${suffix}`;
        if (file.endsWith(_suffix)) {
          if (file === outFile) return;
          const importName = path.basename(file, _suffix);
          importParams.importName = importName;
          const result = getImport(importParams);
          imports.push(result.import);
          exports.push(result.export);
        }
      } else if (Array.isArray(suffix)) {
        suffix.forEach((s) => {
          const _s = `.${s}`;
          if (file.endsWith(_s)) {
            if (file === outFile) return;
            const importName = path.basename(file, _s);
            importParams.importName = importName;
            const result = getImport(importParams);
            imports.push(result.import);
            exports.push(result.export);
          }
        });
      }
    }
  });

  let exportMethod = "export default"; // 默认 ES6
  if (module === "commonjs") {
    exportMethod = "module.exports =";
  }

  return `${imports.join("\n")}\n\n${exportMethod} {\n  ${exports.join(
    ",\n  "
  )}\n};\n`;
}

function render(options: ReplaceFileWithDir<AutoExportOptions>) {
  const { dir, outFile } = options;
  const indexContent = generateIndexFile(options);
  if (indexContent) {
    fs.writeFileSync(path.join(dir, outFile), indexContent);
  }
}

function autoI18nPlugin(options: AutoExportOptions) {
  const { files, outFile = "index.ts", ...resetOptions } = options;
  if (typeof files === "string") {
    render({
      dir: files,
      outFile,
      ...resetOptions,
    });
  } else if (Array.isArray(files)) {
    files.forEach((file) => {
      if (typeof file === "string") {
        render({
          dir: file,
          outFile,
          ...resetOptions,
        });
      } else {
        if (file.defaultDir) {
          file.defaultDir.forEach((locale) => {
            const localeDir = path.join(file.directory, locale);
            render({
              dir: localeDir,
              outFile: file.outFile || outFile,
              ...resetOptions,
            });
          });
        } else {
          render({
            dir: file.directory,
            outFile: file.outFile || outFile,
            ...resetOptions,
          });
        }
      }
    });
  }
}

function vitePluginAutoExport(
  globalOptions: AutoExportOptions
): Plugin {
  return {
    name: "vite-plugin-auto-export",
    apply: "serve",
    buildStart() {
      autoI18nPlugin(globalOptions);
    },
    handleHotUpdate() {
      autoI18nPlugin(globalOptions);
    },
  };
}

// overwrite for cjs require('...')() usage
module.exports = vitePluginAutoExport;
vitePluginAutoExport["default"] = vitePluginAutoExport;
