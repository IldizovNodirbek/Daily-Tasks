import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addTask,
  changeStatus,
  deleteTask,
  editTask,
} from "../Redux/taskSlice";
import {
  changeSpecialTaskStatus,
  editSpecialTask,
  deleteSpecialTask,
} from "../Redux/specialTasksSlice";
import { FaTasks, FaSpinner, FaCheck, FaTrash, FaEdit } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

function TaskList({ tasks, section, filterFn = () => true, selectedDate }) {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState("");
  const [showMenu, setShowMenu] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  const handleAddTask = () => {
    if (!newTask.trim()) {
      alert("Please enter a task description");
      return;
    }
    if (!selectedDate) {
      console.error("No selected date provided for adding task");
      alert("Cannot add task: No date selected");
      return;
    }
    dispatch(
      addTask({
        section,
        task: {
          id: uuidv4(),
          text: newTask,
          status: "todo",
          date: selectedDate.toISOString(),
          isSpecial: false,
        },
      })
    );
    setNewTask("");
  };

  const handleChangeStatus = (id, status, isSpecial) => {
    if (isSpecial) {
      dispatch(changeSpecialTaskStatus({ id, status }));
    } else {
      dispatch(changeStatus({ section, id, status }));
    }
    setShowMenu(null);
  };

  const handleDeleteTask = (id, isSpecial) => {
    if (isSpecial) {
      dispatch(deleteSpecialTask({ id }));
    } else {
      dispatch(deleteTask({ section, id }));
    }
    setShowMenu(null);
  };

  const handleEditTask = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
    setShowMenu(null);
  };

  const handleSaveEdit = (isSpecial) => {
    if (editTaskText.trim()) {
      if (isSpecial) {
        dispatch(
          editSpecialTask({
            id: editTaskId,
            updatedTask: { text: editTaskText },
          })
        );
      } else {
        dispatch(
          editTask({
            section,
            id: editTaskId,
            updatedTask: { text: editTaskText },
          })
        );
      }
      setEditTaskId(null);
      setEditTaskText("");
    }
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditTaskText("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
      {["todo", "inProgress", "done"].map((status) => (
        <div
          key={status}
          className="border border-gray-200 rounded-xl p-4 bg-white shadow-xl flex flex-col max-h-[500px] overflow-hidden"
        >
          <div className="flex justify-between items-center mb-3">
            <h2
              className={`text-lg font-bold capitalize ${
                status === "todo"
                  ? "text-blue-600"
                  : status === "inProgress"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {status === "inProgress"
                ? "In Progress"
                : status === "done"
                ? "Done"
                : "To Do"}
            </h2>
          </div>
          <div className="flex flex-col space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {tasks
              .filter(filterFn)
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className={`border p-3 rounded-lg flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-sm relative ${
                    task.isSpecial
                      ? "border-2 border-[#FF00FF] animate-pulse-neon"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex flex-col flex-1 pr-2">
                    <span className="font-medium text-gray-800">
                      {task.text}
                    </span>
                    {task.isSpecial && (
                      <span className="text-xs text-[#FF00FF] font-semibold mt-1">
                        Special Task
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowMenu(task.id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ⋮
                  </button>
                  {showMenu === task.id && (
                    <div
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
                      onClick={() => setShowMenu(null)}
                    >
                      <div
                        className="bg-white border border-gray-200 rounded-lg shadow-[0_0_20px_rgba(82,0,255,0.5)] p-3 min-w-[180px] animate-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {status !== "todo" && (
                          <button
                            onClick={() =>
                              handleChangeStatus(
                                task.id,
                                "todo",
                                task.isSpecial
                              )
                            }
                            className="flex items-center gap-2 text-left px-3 py-2 w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 font-semibold rounded transition-all duration-300"
                          >
                            <FaTasks size={14} /> To Do
                          </button>
                        )}
                        {status !== "inProgress" && (
                          <button
                            onClick={() =>
                              handleChangeStatus(
                                task.id,
                                "inProgress",
                                task.isSpecial
                              )
                            }
                            className="flex items-center gap-2 text-left px-3 py-2 w-full bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-yellow-600 font-semibold rounded transition-all duration-300"
                          >
                            <FaSpinner size={14} /> In Progress
                          </button>
                        )}
                        {status !== "done" && (
                          <button
                            onClick={() =>
                              handleChangeStatus(
                                task.id,
                                "done",
                                task.isSpecial
                              )
                            }
                            className="flex items-center gap-2 text-left px-3 py-2 w-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-600 font-semibold rounded transition-all duration-300"
                          >
                            <FaCheck size={14} /> Done
                          </button>
                        )}
                        <button
                          onClick={() => handleEditTask(task.id, task.text)}
                          className="flex items-center gap-2 text-left px-3 py-2 w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-[#5200FF] font-semibold rounded transition-all duration-300"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTask(task.id, task.isSpecial)
                          }
                          className="flex items-center gap-2 text-left px-3 py-2 w-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 font-semibold rounded transition-all duration-300"
                        >
                          <FaTrash size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          {status === "todo" && (
            <div className="mt-4 flex flex-col space-y-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
                className="border-2 border-gray-300 rounded-lg p-2 text-gray-700 focus:border-[#5200FF] focus:ring-2 focus:ring-[#5200FF]/30 outline-none transition-all duration-300"
              />
              <button
                onClick={handleAddTask}
                className="relative bg-gradient-to-r from-[#5200FF] to-[#7B00FF] text-white font-semibold py-2 px-4 rounded-lg overflow-hidden group"
              >
                <span className="relative z-10">+ Add Task</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#FF00FF] to-[#5200FF] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="absolute inset-0 shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] transition-shadow duration-300"></span>
              </button>
            </div>
          )}
        </div>
      ))}
      {editTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-8 w-11/12 max-w-md mx-4 shadow-[0_0_15px_rgba(82,0,255,0.3)] animate-in">
            <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#5200FF] to-[#7B00FF]">
              Edit Task
            </h2>
            <input
              type="text"
              value={editTaskText}
              onChange={(e) => setEditTaskText(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-lg w-full mb-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all duration-200"
            />
            <div className="flex gap-4">
              <button
                onClick={() =>
                  handleSaveEdit(
                    tasks.find((task) => task.id === editTaskId)?.isSpecial
                  )
                }
                className="relative bg-gradient-to-r from-[#5200FF] to-[#7B00FF] text-white font-semibold py-2 px-4 rounded-lg flex-1 overflow-hidden group"
              >
                <span className="relative z-10">Save</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#FF00FF] to-[#5200FF] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="absolute inset-0 shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] transition-shadow duration-300"></span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="relative border-2 border-[#5200FF] text-[#5200FF] font-semibold py-2 px-4 rounded-lg flex-1 hover:bg-gradient-to-r hover:from-[#5200FF] hover:to-[#7B00FF] hover:text-white transition-all duration-300 group"
              >
                <span className="relative z-10">Cancel</span>
                <span className="absolute inset-0 shadow-[0_0_10px_rgba(82,0,255,0.2)] group-hover:shadow-[0_0_15px_rgba(82,0,255,0.5)] transition-shadow duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
