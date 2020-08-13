import { uploadCmd } from '~/commands/upload';
import { ConfigStore } from '~/config-store';
import { MissingFileError } from '~/errors/MissingFileError';

import { testHarvestConfig } from '../test.env';

jest.mock('~/config-store');
const mockedConfigStore = <jest.Mock<ConfigStore>>ConfigStore;

mockedConfigStore.prototype.harvestConfig = testHarvestConfig;

describe('uploadCmd', () => {
  it('should do nothing if path was not provided', async () => {
    const consoleLogSpy = jest.spyOn(global.console, 'log');
    await uploadCmd(undefined);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw from wrong path', async () => {
    try {
      await uploadCmd('abc');
    } catch (e) {
      expect(e).toBeInstanceOf(MissingFileError);
    }
  });

  it('should be able to upload double day test data without errors', async () => {
    jest.setTimeout(60000);
    await uploadCmd('./__tests__/_utils/files/valid-double-day-note.txt');
  });

  it('should be able to upload single day test data without errors', async () => {
    jest.setTimeout(60000);
    await uploadCmd('./__tests__/_utils/files/valid-single-day-note.txt');
  });

  it('should be able to upload multiple days test data without errors', async () => {
    jest.setTimeout(60000);
    await uploadCmd('./__tests__/_utils/files/valid-multiple-days-note.txt');
  });
});
