import { LineParser, TimeEntry } from './line-parser';
import * as dayjs from 'dayjs';

import { Project } from './dtos';

const os = require('os');

export interface EntriesLogs {
  [date: string]: TimeEntry[];
}

export class NotesParser {
  static parseNote(
    notes: string,
    availableProjectNames: Project[]
  ): EntriesLogs {
    const lines = notes
      .split(os.EOL)
      .map((e) => e.trimLeft().trimRight())
      .filter((l) => l && l.length > 1);

    let lastDate: string | null = null;
    return lines.reduce<EntriesLogs>((acc, line) => {
      const isDate = /^\s*[0-9]{1,2}\.[0-9]{2}\.[0-9]{4}\s*$/.test(line);

      if (isDate) {
        lastDate = line;
        acc[line] = [];
        return acc;
      } else if (lastDate) {
        if (!acc[lastDate]) {
          // eslint-disable-next-line no-console
          console.error(
            `Could not parse line "${line}". Input from ${lastDate}.`
          );
        }

        acc[lastDate].push(
          new LineParser(
            line,
            dayjs(lastDate),
            availableProjectNames
          ).toTimeEntry()
        );
      }

      return acc;
    }, {});
  }
}
