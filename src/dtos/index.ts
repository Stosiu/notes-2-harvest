export interface TaskAssignment {
  id: number;
  billable: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  hourly_rate: number | null;
  budget: number | null;
  task: {
    id: number;
    name: string;
  };
}

export interface Project {
  id: number;
  name: string;
  code: string;
  task_assignments: TaskAssignment[];
}
