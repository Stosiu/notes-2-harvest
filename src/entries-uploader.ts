import Harvest from 'harvest';
import * as chalk from 'chalk';
import * as cliProgress from 'cli-progress';

import { EntriesLogs } from './notes-parser';
import { TimeEntry } from './line-parser';

export class EntriesUploader {
  static async uploadNotes(
    notes: EntriesLogs,
    harvestInstance: Harvest
  ): Promise<void> {
    const totalNotesToUpload = Object.values(notes).reduce(
      (acc, el) => acc + el.length,
      0
    );
    // eslint-disable-next-line no-console
    console.log(
      `🏋🏻 Started the process of logging ${chalk.blue(
        totalNotesToUpload
      )} entries to Harvest!`
    );

    let currentUpload: number = 0;
    let totalHours: number = 0;
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);
    bar.start(totalNotesToUpload, currentUpload);

    for (const date in notes) {
      const notesToUpload = notes[date];

      for (const note of notesToUpload) {
        const createdEntry = await this.uploadNote(note, harvestInstance);
        currentUpload += 1;
        bar.update(currentUpload);
        totalHours += createdEntry.hours;
      }
    }

    bar.stop();
    const hoursLog = `${totalHours.toPrecision(2)} ${
      totalHours > 1 ? 'hours' : 'hour'
    }`;
    // eslint-disable-next-line no-console
    console.log(`🏆 Finished! Logged ${chalk.blue(hoursLog)} in total!`);
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
