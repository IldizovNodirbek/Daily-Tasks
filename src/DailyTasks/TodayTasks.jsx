import React from "react";
import { useSelector } from "react-redux";
import { format, isValid, parseISO } from "date-fns";
import TaskList from "../UserProfile/TaskList";

function TodayTasks() {
  const tasks = useSelector((state) => state.tasks.todayTasks);
  const selectedDate = new Date(); // Joriy kun

  const filterFn = (task) => {
    if (!task.date) return false;
    try {
      const taskDate = parseISO(task.date);
      return (
        isValid(taskDate) &&
        format(taskDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
    } catch (e) {
      console.error("Invalid date format:", task.date);
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-4rem)]">
      <div className="bg-gradient-to-r from-[#5200FF] to-[#7B00FF] text-white text-xl font-semibold px-6 py-2 rounded-xl shadow-lg mb-6 text-center transform hover:scale-105 transition-transform duration-300">
        Today: {format(selectedDate, "MMMM dd, yyyy")}
      </div>
      <TaskList
        tasks={tasks}
        section="todayTasks"
        filterFn={filterFn}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default TodayTasks;
