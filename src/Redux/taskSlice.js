import { createSlice } from "@reduxjs/toolkit";
import { changeSpecialTaskStatus } from "./specialTasksSlice";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    todayTasks: [],
    weeklyTasks: [],
    monthlyTasks: [],
  },
  reducers: {
    addTask: (state, action) => {
      const { section, task } = action.payload;
      if (section && state[section] && task.date) {
        state[section].push(task);
      } else {
        console.error(`Invalid section: ${section} or missing date`);
      }
    },
    changeStatus: (state, action) => {
      const { section, id, status } = action.payload;
      const taskList = state[section];
      if (taskList) {
        const task = taskList.find((task) => task.id === id);
        if (task) {
          task.status = status;
          if (task.isSpecial) {
            // Dispatch to specialTasksSlice
            dispatch(changeSpecialTaskStatus({ id, status }));
          }
        }
      }
    },
    deleteTask: (state, action) => {
      const { section, id } = action.payload;
      const taskList = state[section];
      if (taskList) {
        state[section] = taskList.filter((task) => task.id !== id);
      }
    },
    editTask: (state, action) => {
      const { section, id, updatedTask } = action.payload;
      const taskList = state[section];
      if (taskList) {
        const taskIndex = taskList.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          state[section][taskIndex] = {
            ...state[section][taskIndex],
            ...updatedTask,
            isSpecial: state[section][taskIndex].isSpecial,
          };
        }
      }
    },
  },
});

export const { addTask, editTask, deleteTask, changeStatus } =
  taskSlice.actions;
export default taskSlice.reducer;
