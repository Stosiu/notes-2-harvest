import * as dayjs from 'dayjs';

import { LineParser } from '~/line-parser';
import { Project } from '~/dtos';

import {
  generateProject,
  generateTaskAssigment
} from './_utils/mocks-generators';
import { LineParseError } from '~/errors/LineParseError';

const EXAMPLE_TASK = generateTaskAssigment('Programming');
const EXAMPLE_PROJECTS: Project[] = [generateProject('TEST', [EXAMPLE_TASK])];

describe('LineParser', () => {
  describe('valid data', () => {
    it('should properly parse duration', () => {
      expect(
        new LineParser(
          '9:00 - 10:00 ABC [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().duration
      ).toEqual(3600);

      expect(
        new LineParser(
          '9:00 - 10:05 ABC [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().duration
      ).toEqual(3600 + 5 * 60);

      expect(
        new LineParser(
          '13:00 - 15:15 ABC [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().duration
      ).toEqual(3600 * 2 + 15 * 60);

      expect(
        new LineParser(
          '20:00 - 23:30 ABC [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().duration
      ).toEqual(3600 * 3 + 30 * 60);
    });

    it('should properly parse start time', () => {
      expect(
        new LineParser(
          '9:00 - 10:00 ABC [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().start
      ).toEqual(
        dayjs()
          .set('h', 9)
          .set('m', 0)
          .set('second', 0)
          .set('millisecond', 0)
          .toISOString()
      );

      expect(
        new LineParser(
          '11:00 - 12:00 ABC [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().start
      ).toEqual(
        dayjs()
          .set('h', 11)
          .set('m', 0)
          .set('second', 0)
          .set('millisecond', 0)
          .toISOString()
      );
    });

    it('should properly parse task', () => {
      const entry = new LineParser(
        '9:00 - 10:00 ABC [TEST] ~Programming~',
        dayjs(),
        EXAMPLE_PROJECTS
      ).toTimeEntry();

      expect(entry.taskId).toEqual(EXAMPLE_TASK.task.id);
      expect(entry.taskName).toEqual(EXAMPLE_TASK.task.name);
    });

    it('should properly parse project', () => {
      const entry = new LineParser(
        '9:00 - 10:00 ABC [TEST] ~Programming~',
        dayjs(),
        EXAMPLE_PROJECTS
      ).toTimeEntry();

      expect(entry.projectId).toEqual(EXAMPLE_PROJECTS[0].id);
      expect(entry.projectName).toEqual(EXAMPLE_PROJECTS[0].name);
    });

    it('should properly parse task name', () => {
      expect(
        new LineParser(
          '9:00 - 10:00 ABC [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().description
      ).toEqual('ABC');

      expect(
        new LineParser(
          '9:00 - 10:00 My complicated description [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().description
      ).toEqual('My complicated description');

      expect(
        new LineParser(
          '9:00 - 10:00 With task number SVP-2020 [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().description
      ).toEqual('With task number SVP-2020');
    });

    it('should properly parse billable status', () => {
      expect(
        new LineParser(
          '9:00 - 10:00 ABC [TEST] ~Programming~',
          dayjs(),
          EXAMPLE_PROJECTS
        ).toTimeEntry().billable
      ).toEqual(EXAMPLE_TASK.billable);
    });
  });

  describe('invalid data', () => {
    it('should fail if project code is not in the list', () => {
      expect.assertions(1);

      const line = '9:00 - 10:00 ABC [NOT] ~Programming~';
      try {
        new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();
      } catch (e) {
        expect(e).toBeInstanceOf(LineParseError);
      }
    });

    it('should fail if task name is not in the list', () => {
      expect.assertions(1);

      const line = '9:00 - 10:00 ABC [TEST] ~X~';
      try {
        new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();
      } catch (e) {
        expect(e).toBeInstanceOf(LineParseError);
      }
    });

    it('should fail if start is a wrong hour', () => {
      expect.assertions(1);

      const line = '250:00 - 10:00 ABC [TEST] ~Programming~';
      try {
        new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();
      } catch (e) {
        expect(e).toBeInstanceOf(LineParseError);
      }
    });

    it('should fail if end hour is a wrong hour', () => {
      expect.assertions(1);

      const line = '10:00 - 250:00 ABC [TEST] ~Programming~';
      try {
        new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();
      } catch (e) {
        expect(e).toBeInstanceOf(LineParseError);
      }
    });

    it('should fail if start is after end', () => {
      expect.assertions(1);

      const line = '16:00 - 10:00 ABC [TEST] ~Programming~';
      try {
        new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();
      } catch (e) {
        expect(e).toBeInstanceOf(LineParseError);
      }
    });

    it('should fail if minutes if higher than 59', () => {
      expect.assertions(2);

      let line = '10:00 - 11:59 ABC [TEST] ~Programming~';
      new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();

      line = '10:59 - 11:59 ABC [TEST] ~Programming~';
      new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();

      line = '10:60 - 11:00 ABC [TEST] ~Programming~';
      try {
        new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();
      } catch (e) {
        expect(e).toBeInstanceOf(LineParseError);
      }

      line = '10:00 - 11:60 ABC [TEST] ~Programming~';
      try {
        new LineParser(line, dayjs(), EXAMPLE_PROJECTS).toTimeEntry();
      } catch (e) {
        expect(e).toBeInstanceOf(LineParseError);
      }
    });
  });
});
