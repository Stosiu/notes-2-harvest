import * as faker from 'faker';

import { Project, TaskAssignment } from '../src/dtos';
import { TimeEntry } from '../src/line-parser';

export const generateTaskAssigment = (
  name: string = faker.random.word()
): TaskAssignment => ({
  id: faker.random.number(),
  billable: true,
  is_active: true,
  created_at: faker.date.past(2),
  updated_at: faker.date.recent(),
  hourly_rate: faker.random.number(),
  budget: faker.random.number(),
  task: {
    id: faker.random.number(),
    name
  }
});

export const generateProject = (
  code: string,
  tasks: TaskAssignment[] = [generateTaskAssigment('Test')],
  name: string = faker.internet.userName()
): Project => ({
  name,
  code,
  id: faker.random.number(),
  task_assignments: tasks
});

export interface NoteLineData {
  from: string;
  to: string;
  description: string;
  project: string;
  task: string;
}

export const generateNoteLine = (data: NoteLineData): string =>
  `${data.from} - ${data.to} ${data.description} [${data.project}] ~${data.task}~`;

export interface GenerateNoteData {
  [date: string]: NoteLineData[];
}

export const generateNote = (data: GenerateNoteData): string => {
  const dates = Object.keys(data);
  let note = '';

  for (const date of dates) {
    note += `${date}\n`;

    const lines: NoteLineData[] = data[date];
    for (const line of lines) {
      note += `${generateNoteLine(line)}\n`;
    }

    note += '\n';
  }

  return note;
};

export const generateTimeEntry = (): TimeEntry => ({
  description: faker.random.word(),
  projectId: faker.random.number(),
  projectName: faker.random.word(),
  taskId: faker.random.number(),
  taskName: faker.random.word(),
  start: faker.date.past().toISOString(),
  duration: faker.random.number(),
  billable: faker.random.boolean()
});
