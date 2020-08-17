import Configstore from 'configstore';

import { HarvestAPIConfig } from './harvest-api';
import { ConfigurationError } from './errors/ConfigurationError';

const ACCESS_TOKEN_KEY = 'harvest-access-token';
const ACCOUNT_ID_KEY = 'harvest-account-id';
const SUBDOMAIN_KEY = 'harvest-subdomain';

export class ConfigStore {
  store: Configstore;

  constructor(doNotValidate = false) {
    this.store = new Configstore('Notes2Harvest');

    if (!doNotValidate) {
      this.validateStoreState();
    }
  }

  configure(config: HarvestAPIConfig): void {
    this.store.set(ACCESS_TOKEN_KEY, config.accessToken);
    this.store.set(ACCOUNT_ID_KEY, config.accountId);
    this.store.set(SUBDOMAIN_KEY, config.subdomain);
  }

  private get accessToken(): string {
    return this.store.get(ACCESS_TOKEN_KEY);
  }

  private get accountId(): string {
    return this.store.get(ACCOUNT_ID_KEY);
  }

  private get subdomain(): string {
    return this.store.get(SUBDOMAIN_KEY);
  }

  get harvestConfig(): HarvestAPIConfig {
    return this._safeHarvestConfig;
  }

  validateStoreState(): void {
    if (!this.accessToken || !this.subdomain || !this.accountId) {
      throw new ConfigurationError({
        accessToken: this.accessToken,
        accountId: this.accountId,
        subdomain: this.subdomain
      });
    }
  }

  private get _safeHarvestConfig(): HarvestAPIConfig {
    this.validateStoreState();

    return {
      accessToken: this.accessToken,
      accountId: this.accountId,
      subdomain: this.subdomain
    };
  }
}
