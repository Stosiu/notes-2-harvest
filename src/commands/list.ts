/* eslint-disable no-console */
import * as chalk from 'chalk';

import { HarvestApi } from '~/harvest-api';
import { ConfigStore } from '~/config-store';
import { Project } from '~/dtos';

export const listCmd = async (): Promise<void> => {
  const store = new ConfigStore();
  const harvest = new HarvestApi(store.harvestConfig);
  console.log('📭', chalk.cyan('Listing all your projects...'));
  const projects: Project[] = await harvest.listProjects();

  console.log('\n🏵 ', chalk.cyan('Here is a list of all your projects:'));
  for (const project of projects) {
    const taskNames = project.task_assignments.map((t) => t.task.name);
    console.log(`${chalk.blue(`[${project.code}]`)} ${project.name}:`);
    console.log(taskNames.map((t) => `- ${chalk.green(t)}`).join('\n'));
    console.log();
  }
};
