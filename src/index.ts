import { Command } from 'commander';

import { configureCmd, listCmd, uploadCmd } from './commands';

const program = new Command();

program.name('Notes2Harvest').version('0.0.1');

program
  .command('list')
  .description('List of all available projects & their tasks')
  .action(listCmd);

program
  .command('configure <accessToken> <accountId> <subdomain>')
  .description('Configure Harvest keys.')
  .action(configureCmd);

program
  .command('upload <path>', { isDefault: true })
  .description('Adds entries from the file.')
  .action(uploadCmd);

program.parse(process.argv);
