import * as fs from 'fs';

import { MissingFileError } from '~/errors/MissingFileError';

export class FileParser {
  static async fileToString(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(
            new MissingFileError(
              `Error while processing the file. ${err.message}`
            )
          );
        } else {
          resolve(data.toString());
        }
      });
    });
  }
}
