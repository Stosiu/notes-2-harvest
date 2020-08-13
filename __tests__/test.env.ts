import { HarvestAPIConfig } from '~/harvest-api';

// How to get one for your tests:
// https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/
export const testHarvestConfig: HarvestAPIConfig = {
  accessToken: process.env.HARVEST_ACCESS_TOKEN || 'your-access-token',
  accountId: process.env.HARVEST_ACCOUNT_ID || 'your-account-id',
  subdomain: process.env.HARVEST_SUBDOMAIN || 'your-subdomain'
};
