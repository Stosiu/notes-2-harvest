import * as chalk from 'chalk';

import { ConfigStore } from '~/config-store';
import { errorHandler } from '~/error-handler';

export const configureCmd = async (
  accessToken: string,
  accountId: string,
  subdomain: string
): Promise<void> => {
  try {
    const store = new ConfigStore(true);
    store.configure({
      accountId,
      accessToken,
      subdomain
    });

    // eslint-disable-next-line no-console
    console.log(chalk.green(`All done! You are ready to use the tool`));
  } catch (e) {
    errorHandler(e);
  }
};
