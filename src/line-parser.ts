import * as dayjs from 'dayjs';
import * as chalk from 'chalk';

import { Project, TaskAssignment } from './dtos';
import { LineParseError } from '~/errors/LineParseError';

export interface TimeEntry {
  description: string;
  projectId: number;
  projectName: string;
  taskId: number;
  taskName: string;
  start: string;
  duration: number;
  billable: boolean;
}

export class LineParser {
  line: string;
  modificated: string;
  date: dayjs.Dayjs;
  project: Project;
  task: TaskAssignment;

  constructor(
    line: string,
    date: dayjs.Dayjs = dayjs(),
    projectsMap: Project[]
  ) {
    this.line = line;
    this.date = date;
    this.modificated = line;

    this.project = this.destructProjectByCode(projectsMap);
    this.task = this.destructTaskIdByName(this.project);
  }

  toTimeEntry(): TimeEntry {
    const time = this.destructStartAndDuration();
    const description: string = this.destructDescription();

    return {
      description,
      projectId: this.project.id,
      taskId: this.task.task.id,
      start: time.start,
      duration: time.duration,
      billable: this.task.billable,
      projectName: this.project.name,
      taskName: this.task.task.name
    };
  }

  private destructProjectByCode(projects: Project[]): Project {
    const tokens = projects.map((project) => `\\[${project.code}\\]`);

    const regexp = new RegExp(tokens.join('|'));
    const projectCodeMatch: RegExpMatchArray | null = this.modificated.match(
      regexp
    );

    const listOfValidProjects = projects.map((p) => p.code).join(', ');
    if (projectCodeMatch === null) {
      throw this.generateError(
        `Couldn't parse project code. Make sure it's on the list: ${listOfValidProjects}.`
      );
    }

    const projectName = projectCodeMatch[0].trim().slice(1, -1);

    const project = projects.find((p) => p.code === projectName);
    this.modificated = this.modificated.replace(regexp, '');

    if (!project) {
      throw this.generateError(
        `Project code ${project} is not in your list of project codes ${listOfValidProjects}`
      );
    }

    return project;
  }

  private destructTaskIdByName(project: Project): TaskAssignment {
    const tokens = project.task_assignments.map(
      (assigment) => `\\~${assigment.task.name}\\~`
    );

    const regexp = new RegExp(tokens.join('|'));
    const taskNameMatch: RegExpMatchArray | null = this.modificated.match(
      regexp
    );

    const listOfValidTasks = project.task_assignments
      .map((t) => t.task.name)
      .join(', ');
    if (taskNameMatch === null) {
      throw this.generateError(
        `Couldn't parse project task. Make sure it's on the list: ${listOfValidTasks}.`
      );
    }

    const taskName = taskNameMatch[0].trim().slice(1, -1);

    const task = project.task_assignments.find((p) => p.task.name === taskName);
    this.modificated = this.modificated.replace(regexp, '');

    if (!task) {
      throw this.generateError(
        `Task code ${project} is not in your list of project codes ${listOfValidTasks}`
      );
    }

    return task;
  }

  private destructStartAndDuration(): { start: string; duration: number } {
    const hoursRegexp = /^\s*([0-9]{1,2}):([0-9]{2})\s*-\s*([0-9]{1,2}):([0-9]{2})[\s-]*/;
    const hoursRegexpResult = hoursRegexp.exec(this.modificated);

    if (!hoursRegexpResult) {
      throw this.generateError('Failed to parse start and duration');
    }

    const [, startHour, startMinute, endHour, endMinute] = hoursRegexpResult;

    if (parseInt(startHour, 10) > 24 || parseInt(endHour, 10) > 24) {
      throw this.generateError('Maximum hour is 24');
    }

    if (parseInt(startMinute, 10) > 59 || parseInt(endMinute, 10) > 59) {
      throw this.generateError('Maximum minute is 59');
    }

    const startMoment = dayjs(this.date)
      .set('hour', parseInt(startHour, 10))
      .set('minute', parseInt(startMinute, 10))
      .set('second', 0)
      .set('millisecond', 0);

    const endMoment = dayjs(this.date)
      .set('hour', parseInt(endHour, 10))
      .set('minute', parseInt(endMinute, 10))
      .set('second', 0)
      .set('millisecond', 0);

    if (startMoment.isAfter(endMoment)) {
      throw this.generateError('Start cannot be after end');
    }

    const duration = endMoment.diff(startMoment, 's');

    this.modificated = this.modificated.replace(hoursRegexp, '');

    return {
      start: startMoment.toISOString(),
      duration
    };
  }

  private destructDescription(): string {
    return this.modificated.replace(/\s+/g, ' ').trim();
  }

  private generateError(message: string) {
    const date = chalk.cyan(this.date.format('DD.MM.YYYY'));

    return new LineParseError(
      `${chalk.red(message)}\nParsing line: "${chalk.blue(
        this.line
      )}" in ${date}.`
    );
  }
}
