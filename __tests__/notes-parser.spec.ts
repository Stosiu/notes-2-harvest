import dayjs from 'dayjs';

import { NotesParser } from '../src/notes-parser';
import { Project } from '../src/dtos';

import {
  generateNote,
  GenerateNoteData,
  generateProject,
  generateTaskAssigment
} from './_utils/mocks-generators';

describe('NoteParser', () => {
  describe('valid data', () => {
    it('should properly parse single date entry', () => {
      const date = '2020-01-14';
      const description = 'Test description';

      const task = generateTaskAssigment('Programming');
      const projects: Project[] = [generateProject('TES', [task])];
      const generateNoteData: GenerateNoteData = {
        [date]: [
          {
            from: '9:00',
            to: '12:00',
            description: description,
            project: projects[0].code,
            task: task.task.name
          }
        ]
      };
      const input: string = generateNote(generateNoteData);
      const output = NotesParser.parseNote(input, projects);

      expect(Boolean(output[date])).toBeTruthy();
      expect(output[date].length).toEqual(1);
      expect(output[date][0].description).toEqual(description);
      expect(output[date][0].start).toEqual(
        dayjs(date).set('h', 9).toISOString()
      );
      expect(output[date][0].duration).toEqual(3600 * 3);
      expect(output[date][0].projectName).toEqual(projects[0].name);
      expect(output[date][0].projectId).toEqual(projects[0].id);
      expect(output[date][0].taskName).toEqual(task.task.name);
      expect(output[date][0].taskId).toEqual(task.task.id);
    });

    it('should properly parse multiple dates entry', () => {
      const startDate = dayjs();
      const description = 'Test description';

      const programmingTask = generateTaskAssigment('Programming');
      const managementTask = generateTaskAssigment('Management');
      const projects: Project[] = [
        generateProject('TEST', [programmingTask, managementTask])
      ];

      const data = [
        {
          from: '9:00',
          to: '12:00',
          description: description,
          project: projects[0].code,
          task: programmingTask.task.name
        },
        {
          from: '14:00',
          to: '16:00',
          description: description,
          project: projects[0].code,
          task: managementTask.task.name
        }
      ];

      const generateNoteData: GenerateNoteData = {
        [startDate.format('YYYY-MM-DD')]: data,
        [startDate.add(1, 'd').format('YYYY-MM-DD')]: data,
        [startDate.add(2, 'd').format('YYYY-MM-DD')]: data,
        [startDate.add(3, 'd').format('YYYY-MM-DD')]: data
      };
      const input: string = generateNote(generateNoteData);
      const output = NotesParser.parseNote(input, projects);

      expect(Boolean(output[startDate.format('YYYY-MM-DD')])).toBeTruthy();
      expect(
        Boolean(output[startDate.add(1, 'd').format('YYYY-MM-DD')])
      ).toBeTruthy();
      expect(
        Boolean(output[startDate.add(2, 'd').format('YYYY-MM-DD')])
      ).toBeTruthy();
      expect(
        Boolean(output[startDate.add(3, 'd').format('YYYY-MM-DD')])
      ).toBeTruthy();
      expect(Object.keys(output).length).toEqual(4);
    });

    it('should not fail on a date without entries', () => {
      const input = '2020-10-16';
      const output = NotesParser.parseNote(input, []);

      expect(Boolean(output[input])).toBeTruthy();
      expect(output[input].length).toEqual(0);
      expect(Object.keys(output).length).toEqual(1);
    });

    it('should not fail on multiple dates without entries', () => {
      const input = `
        2020-01-15
        2020-01-22
        2020-01-26
      `;
      const output = NotesParser.parseNote(input, []);

      expect(output['2020-01-15'].length).toEqual(0);
      expect(output['2020-01-22'].length).toEqual(0);
      expect(output['2020-01-26'].length).toEqual(0);
      expect(Object.keys(output).length).toEqual(3);
    });
  });
});
