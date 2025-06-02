import { createSlice } from "@reduxjs/toolkit";

const specialTasksSlice = createSlice({
  name: "specialTasks",
  initialState: [],
  reducers: {
    addSpecialTask: (state, action) => {
      state.push(action.payload);
    },
    changeSpecialTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.find((task) => task.id === id);
      if (task) {
        task.status = status;
      }
    },
    editSpecialTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const taskIndex = state.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state[taskIndex] = { ...state[taskIndex], ...updatedTask };
      }
    },
    deleteSpecialTask: (state, action) => {
      const { id } = action.payload;
      return state.filter((task) => task.id !== id);
    },
  },
});

export const {
  addSpecialTask,
  changeSpecialTaskStatus,
  editSpecialTask,
  deleteSpecialTask,
} = specialTasksSlice.actions;
export default specialTasksSlice.reducer;
