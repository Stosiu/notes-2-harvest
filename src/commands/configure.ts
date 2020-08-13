import * as chalk from 'chalk';

import { ConfigStore } from '~/config-store';

export const configureCmd = async (
  accessToken: string,
  accountId: string,
  subdomain: string
): Promise<void> => {
  const store = new ConfigStore(true);
  store.configure({
    accountId,
    accessToken,
    subdomain
  });

  // eslint-disable-next-line no-console
  console.log(chalk.green(`All done! You are ready to use the tool`));
};
