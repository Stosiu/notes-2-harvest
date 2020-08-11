import Harvest from 'harvest';
import * as dayjs from 'dayjs';
import * as chalk from 'chalk';

import { EntriesLogs } from './notes-parser';
import { TimeEntry } from './line-parser';

export class EntriesUploader {
  static async uploadNotes(
    notes: EntriesLogs,
    harvestInstance: Harvest
  ): Promise<void> {
    for (const date in notes) {
      const notesToUpload = notes[date];
      let totalHours = 0;

      const when = chalk.green(dayjs(date).format('DD MMMM YYYY'));
      // eslint-disable-next-line no-console
      console.log(`🏋🏻 ${chalk.blue('Started logging for')} ${when}...`);

      // TODO: Add progress bar.
      for (const note of notesToUpload) {
        // eslint-disable-next-line no-console
        console.log(
          `🏋🏻 ${chalk.blue('Logging')} ${note.duration / 3600} hours`
        );
        const createdEntry = await this.uploadNote(note, harvestInstance);
        totalHours += createdEntry.hours;
      }

      const hoursLog = `${totalHours} ${totalHours > 1 ? 'hours' : 'hour'}`;
      // eslint-disable-next-line no-console
      console.log(
        `⏲ Finished logging for ${when}. Logged ${chalk.blue(
          hoursLog
        )} in total.`
      );
    }
  }

  static async uploadNote(note: TimeEntry, harvestInstance: Harvest) {
    return harvestInstance.timeEntries.create({
      project_id: note.projectId,
      task_id: note.taskId,
      spent_date: note.start,
      hours: note.duration / 3600,
      notes: note.description
    });
  }
}
