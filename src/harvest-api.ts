import Harvest from 'harvest';
import { ProjectAssignment } from 'harvest/dist/models/projectAssignments.models';

import { Project } from './dtos';

export interface HarvestAPIConfig {
  subdomain: string;
  accessToken: string;
  accountId: string;
}

export class HarvestApi {
  client: Harvest;

  constructor(config: HarvestAPIConfig) {
    this.client = new Harvest({
      subdomain: config.subdomain,
      userAgent: 'Harvest API Example',
      concurrency: 1,
      auth: {
        accountId: config.accountId,
        accessToken: config.accessToken
      }
    });
  }

  listProjects(): Project[] {
    return this.client.projectAssignments
      .me({ per_page: 100 })
      .then((data: { project_assignments: ProjectAssignment[] }) =>
        data.project_assignments.map((ass) => ({
          ...ass.project,
          task_assignments: ass.task_assignments
        }))
      );
  }
}
