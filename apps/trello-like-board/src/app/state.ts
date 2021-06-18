import { atom, selector } from "recoil";

export interface Task {
  id: string;
  content: string;
  columnId: string;
};

export interface Column {
  id: number;
  name: string;
  tasks: Array<Task>;
}

export const columnsListQuery = selector({
  key: 'columns',
  get: async ({get}) => {
    const response = await fetch('/api/columns');
    return response.json();
  }
});

export const getTasksQuery = selector({
  key:'tasks',
  get: async ({ get }) => {
    const columns = get(columnsListQuery);
    let tasks = {};
    for (let col of columns) {
      const tasksForCol = await fetch(`/api/columns/${col.id}/tasks`);
      tasks[col.id] = await tasksForCol.json();
    }
    return tasks;
  }
});