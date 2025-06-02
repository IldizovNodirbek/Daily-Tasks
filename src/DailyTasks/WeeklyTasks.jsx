import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  isSameDay,
  isValid,
  parseISO,
} from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TaskList from "../UserProfile/TaskList";

function WeeklyTasks() {
  const tasks = useSelector((state) => state.tasks.weeklyTasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeekDate, i)
  );

  const handlePrevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const handleDaySelect = (day) => setSelectedDay(day);

  const filterFn = (task) => {
    if (!task.date || !selectedDay) return false;
    try {
      const taskDate = parseISO(task.date);
      return (
        isValid(taskDate) &&
        format(taskDate, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
      );
    } catch (e) {
      console.error("Invalid date format:", task.date);
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <button
          onClick={handlePrevWeek}
          className="text-[#5200FF] p-2 hover:bg-gray-200 rounded-full transition-colors duration-300"
        >
          <FaChevronLeft size={24} />
        </button>
        <div className="bg-gradient-to-r from-[#5200FF] to-[#7B00FF] text-white text-xl font-semibold px-6 py-2 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          Week of {format(startOfWeekDate, "MMM dd, yyyy")}
        </div>
        <button
          onClick={handleNextWeek}
          className="text-[#5200FF] p-2 hover:bg-gray-200 rounded-full transition-colors duration-300"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 w-full max-w-5xl mb-6">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDaySelect(day)}
            className={`border p-3 rounded-xl text-center transition-all duration-300 shadow-sm cursor-pointer ${
              selectedDay && isSameDay(selectedDay, day)
                ? "bg-gradient-to-r from-[#5200FF] to-[#7B00FF] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div
              className={`font-semibold ${
                selectedDay && isSameDay(selectedDay, day)
                  ? "text-white"
                  : "text-gray-600"
              }`}
            >
              {format(day, "EEEE")}
            </div>
            <div
              className={`text-sm ${
                selectedDay && isSameDay(selectedDay, day)
                  ? "text-white"
                  : "text-gray-600"
              }`}
            >
              {format(day, "dd.MM")}
            </div>
          </div>
        ))}
      </div>
      {selectedDay && (
        <TaskList
          tasks={tasks}
          section="weeklyTasks"
          filterFn={filterFn}
          selectedDate={selectedDay}
        />
      )}
    </div>
  );
}

export default WeeklyTasks;
