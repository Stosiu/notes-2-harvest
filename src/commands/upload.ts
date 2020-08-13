import * as chalk from 'chalk';

import { FileParser } from '~/file-parser';
import { HarvestApi } from '~/harvest-api';
import { NotesParser } from '~/notes-parser';
import { ConfigStore } from '~/config-store';
import { EntriesUploader } from '~/entries-uploader';

export const uploadCmd = async (path: string | undefined): Promise<void> => {
  if (!path) {
    // eslint-disable-next-line no-console
    console.log(chalk.red('Path parameter is required.'));
    return;
  }

  const store = new ConfigStore();
  const note = await FileParser.fileToString(path);
  const harvest = new HarvestApi(store.harvestConfig);
  const projects = await harvest.listProjects();
  const parsedNotes = NotesParser.parseNote(note, projects);
  await EntriesUploader.uploadNotes(parsedNotes, harvest.client);
};
