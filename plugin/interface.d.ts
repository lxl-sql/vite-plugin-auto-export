/**
 * @description 需要的参数
 */
export interface AutoExportOptions {
  /**
   * 需要自动导出的文件
   */
  files: string | string[] | File[];
  /**
   * commonjs -> require | ES6 -> import
   */
  module?: "commonjs" | "ES6";
  /**
   * 默认导出方式
   */
  exportMember?: "export" | "export default";
  /**
   * 自动解包的关键字
   */
  keywords?: string | string[];
  /**
   * 导出到的文件名
   * @example index.ts
   * @default index.ts
   */
  outFile?: string;
  /**
   * 需要默认导出的文件后缀
   * @example json | ['json', 'ts']
   * @default json
   */
  suffix?: string | string[];
}

interface File {
  /**
   * 文件(夹)路径
   */
  directory: string;
  /**
   * 需要自动导出的文件夹子目录
   */
  defaultDir?: string[];
  /**
   * 输出文件名
   */
  outFile?: string;
}

export type ReplaceFileWithDir<T> = {
  [K in keyof T as K extends "files" ? "dir" : K]: T[K];
};

export interface ImportOptions
  extends Pick<AutoExportOptions, "exportMember" | "keywords" | "module"> {
  /**
   * 文件(夹)路径
   */
  file: string;
  /**
   * import 引入名称
   */
  importName: string;
}

export interface GenerateIndexFileOptions
  extends Omit<AutoExportOptions, "files"> {
  dir: string;
}
