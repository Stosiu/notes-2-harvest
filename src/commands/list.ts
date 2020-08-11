import * as chalk from 'chalk';

import { HarvestApi } from '~/harvest-api';
import { ConfigStore } from '~/config-store';
import { errorHandler } from '~/error-handler';

export const listCmd = async (): Promise<void> => {
  try {
    const store = new ConfigStore();
    const harvest = new HarvestApi(store.harvestConfig);
    const projects = await harvest.listProjects();
    for (const project of projects) {
      const taskNames = project.task_assignments.map((t) => t.task.name);
      // eslint-disable-next-line no-console
      console.log(chalk.blue(`[${project.name}]`), ':', taskNames.join(', '));
    }
  } catch (e) {
    errorHandler(e);
  }
};
