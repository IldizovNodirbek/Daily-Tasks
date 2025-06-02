import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSpecialTask } from "../Redux/specialTasksSlice";
import { FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

function AddSpecialDay({ onClose }) {
  const dispatch = useDispatch();
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [task, setTask] = useState("");
  const months = [
    { key: "01", value: "January" },
    { key: "02", value: "February" },
    { key: "03", value: "March" },
    { key: "04", value: "April" },
    { key: "05", value: "May" },
    { key: "06", value: "June" },
    { key: "07", value: "July" },
    { key: "08", value: "August" },
    { key: "09", value: "September" },
    { key: "10", value: "October" },
    { key: "11", value: "November" },
    { key: "12", value: "December" },
  ];

  const daysInMonth = month
    ? Array.from(
        { length: new Date(parseInt(year), parseInt(month), 0).getDate() },
        (_, i) => i + 1
      )
    : [];

  const handleSubmit = () => {
    if (!year || !month || !day || !task.trim()) {
      alert("Please fill all the fields.");
      return;
    }

    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");
    const newSpecial = {
      id: uuidv4(),
      text: task,
      status: "todo",
      date: `${year}-${formattedMonth}-${formattedDay}`,
      isSpecial: true, // Maxsus vazifa ekanligini belgilash
    };

    dispatch(addSpecialTask(newSpecial));

    setMonth("");
    setDay("");
    setYear(new Date().getFullYear().toString());
    setTask("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-8 w-11/12 max-w-md mx-4 shadow-[0_0_15px_rgba(82,0,255,0.3)] animate-in">
        <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#5200FF] to-[#7B00FF]">
          Add Special Day
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="border-2 border-gray-300 p-2 rounded-lg w-full text-gray-700 focus:border-[#5200FF] focus:ring-2 focus:ring-[#5200FF]/30 outline-none transition-all duration-300"
          />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-lg w-full text-gray-700 focus:border-[#5200FF] focus:ring-2 focus:ring-[#5200FF]/30 outline-none transition-all duration-300 custom-scrollbar"
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month.key} value={month.key}>
                {month.value}
              </option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-lg w-full text-gray-700 focus:border-[#5200FF] focus:ring-2 focus:ring-[#5200FF]/30 outline-none transition-all duration-300 custom-scrollbar"
            disabled={!month}
          >
            <option value="">Select Day</option>
            {daysInMonth.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border-2 border-gray-300 p-2 rounded-lg w-full mb-6 text-gray-700 focus:border-[#5200FF] focus:ring-2 focus:ring-[#5200FF]/30 outline-none transition-all duration-300"
        />
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="relative bg-gradient-to-r from-[#5200FF] to-[#7B00FF] text-white font-semibold py-2 px-4 rounded-lg flex-1 overflow-hidden group"
          >
            <span className="relative z-10">Add Task</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#FF00FF] to-[#5200FF] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="absolute inset-0 shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] transition-shadow duration-300"></span>
          </button>
          <button
            onClick={onClose}
            className="relative border-2 border-[#5200FF] text-[#5200FF] font-semibold py-2 px-4 rounded-lg flex-1 hover:bg-gradient-to-r hover:from-[#5200FF] hover:to-[#7B00FF] hover:text-white transition-all duration-300 group"
          >
            <span className="relative z-10">Cancel</span>
            <span className="absolute inset-0 shadow-[0_0_10px_rgba(82,0,255,0.2)] group-hover:shadow-[0_0_15px_rgba(82,0,255,0.5)] transition-shadow duration-300"></span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#5200FF] hover:text-[#7B00FF] hover:rotate-90 transition-all duration-300"
        >
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
}

export default AddSpecialDay;
