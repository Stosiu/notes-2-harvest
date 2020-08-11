import { uploadCmd } from '~/commands/upload';

describe('uploadCmd', () => {
  it('should do nothing if path was not provided', async () => {
    const consoleLogSpy = jest.spyOn(global.console, 'log');
    await uploadCmd(undefined);
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });
});
