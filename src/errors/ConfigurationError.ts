import chalk from 'chalk';

import { HarvestAPIConfig } from '../harvest-api';

export class ConfigurationError extends Error {
  config: Partial<HarvestAPIConfig>;

  constructor(currentConfig: Partial<HarvestAPIConfig>) {
    super('Some parts of Harvest configuration are missing.');
    this.config = currentConfig;
  }

  toString(): string {
    const hasAccessToken = Boolean(this.config.accessToken);
    const hasSubdomain = Boolean(this.config.subdomain);
    const hasAccountId = Boolean(this.config.accountId);
    const errors: string[] = [];

    if (!hasAccessToken) {
      errors.push('- accessToken');
    }

    if (!hasSubdomain) {
      errors.push('- subdomain');
    }

    if (!hasAccountId) {
      errors.push('- accountId');
    }

    const pleaseAddMessage = `Please add: \n${chalk.blue(errors.join('\n'))}`;

    return `${chalk.red(
      'Missing Harvest config values.'
    )}\n${pleaseAddMessage}`;
  }
}
