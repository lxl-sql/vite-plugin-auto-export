

自动导出文件夹中的文件

例:

```bash
|- src
	|- locales
		|- zh
			|- admin
				|- role.json
				|- log.json
			|- default.json
		|- en
			|- admin
				|- role.json
				|- log.json
			|- default.json
```

输出

```bash
|- src
	|- locales
		|- zh
			|- admin
				|- role.json
				|- log.json
				|- index.ts
			|- default.json
			|- index.ts
		|- en
			|- admin
				|- role.json
				|- log.json
				|- index.ts
			|- default.json
			|- index.ts
```

## ES6模式下

```typescript
// src/locales/en/admin/index.ts
import role from './role.json';
import log from './log.json';

export default {admin, log};

// src/locales/en/index.ts
import admin from './admin/index';
import defaultValue from './default.json'; // 遇到关键字会主动拼接Value并解构返回

export default {admin, ...defaultValue}; // 遇到关键字会解构返回
```

## CommonJS模式下

```typescript
// src/locales/en/admin/index.ts
const role = require('./role.json');
const log = require('./log.json');

module.exports = {admin, log};

// src/locales/en/index.ts
const admin = require('./admin/index');
const defaultValue = require('./default.json'); // 遇到关键字会主动拼接Value并解构返回

module.exports = {admin, ...defaultValue}; // 遇到关键字会解构返回
```

示例入参

```typescript
{
  // files: [
  //   path.resolve(process.cwd(), "src", "locales", "en"),
  //   path.resolve(process.cwd(), "src", "locales", "zh"),
  // ],
  files: [
    {
      directory: path.resolve(process.cwd(), "src", "locales"),
      defaultDir: ["en"], // 可选 选择会指定需要输出的文件夹 否则输出改类目下的全部
      // outFile: "test.js",
    },
  ],
  exportMember: "export",
  module: "commonjs", // 默认 ES6
  suffix: ["json", "ts"], // 默认 json
  // files: [
  //   {
  //     directory: resolve(process.cwd(), 'src', 'locales', 'en'),
  //     outFile: 'test.ts',
  //     exportMember: 'export',
  //   }
  // ],
  keywords: ["default"], // 关键字
}
```

