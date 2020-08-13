import { Command } from 'commander';

import { configureCmd, listCmd, uploadCmd } from './commands';
import { errorHandler } from '~/error-handler';

const program = new Command();

program.name('Notes2Harvest').version('0.0.1');

program
  .command('<path>', { isDefault: true })
  .description('Tries to upload entries from specified file.')
  .action(uploadCmd);

program
  .command('list')
  .description(
    'List all available projects & their tasks from your Harvest account.'
  )
  .action(listCmd);

program
  .command('configure <accessToken> <accountId> <subdomain>')
  .description('Save your Harvest API keys in the storage.')
  .action(configureCmd);

if (process.env.NODE_ENV !== 'test') {
  program.exitOverride();

  try {
    program.parse(process.argv);
  } catch (err) {
    errorHandler(err);
  }
}

export { program };
