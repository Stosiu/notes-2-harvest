import * as fs from 'fs';

export class FileParser {
  static async fileToString(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data.toString());
      });
    });
  }
}
