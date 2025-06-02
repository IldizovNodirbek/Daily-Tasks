import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  getDaysInMonth,
  addDays,
  isValid,
  parseISO,
} from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TaskList from "../UserProfile/TaskList";

function MonthlyTasks() {
  const monthlyTasks = useSelector((state) => state.tasks.monthlyTasks);
  const specialTasks = useSelector((state) => state.specialTasks);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const daysInMonth = Array.from(
    { length: getDaysInMonth(currentMonth) },
    (_, i) => addDays(startOfMonth(currentMonth), i)
  );

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleDaySelect = (day) => setSelectedDay(day);

  // monthlyTasks va specialTasks'ni birlashtirish
  const allTasks = [
    ...monthlyTasks.map((task) => ({ ...task, isSpecial: false })),
    ...specialTasks
      .filter(
        (task) =>
          task.date &&
          isValid(parseISO(task.date)) &&
          format(parseISO(task.date), "yyyy-MM") ===
            format(currentMonth, "yyyy-MM")
      )
      .map((task) => ({ ...task, isSpecial: true })),
  ];

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
    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-white min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <button
          onClick={handlePrevMonth}
          className="text-[#5200FF] p-2 hover:bg-gray-200 rounded-full transition-colors duration-300"
        >
          <FaChevronLeft size={24} />
        </button>
        <div className="bg-gradient-to-r from-[#5200FF] to-[#7B00FF] text-white text-xl font-semibold px-6 py-2 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          onClick={handleNextMonth}
          className="text-[#5200FF] p-2 hover:bg-gray-200 rounded-full transition-colors duration-300"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 w-full max-w-5xl mb-6">
        {daysInMonth.map((day, idx) => (
          <div
            key={idx}
            onClick={() => handleDaySelect(day)}
            className={`p-3 rounded-xl text-center transition-all duration-300 shadow-sm cursor-pointer ${
              selectedDay &&
              format(selectedDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                ? "bg-gradient-to-r from-[#5200FF] to-[#7B00FF] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="font-semibold">{format(day, "dd")}</div>
            <div className="text-sm">{format(day, "EEE")}</div>
          </div>
        ))}
      </div>
      {selectedDay && (
        <TaskList
          tasks={allTasks}
          section="monthlyTasks"
          filterFn={filterFn}
          selectedDate={selectedDay}
        />
      )}
    </div>
  );
}

export default MonthlyTasks;
