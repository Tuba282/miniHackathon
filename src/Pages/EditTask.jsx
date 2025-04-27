import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

const TaskDetail = () => {
  const { id } = useParams(); // Get task ID from URL
  const navigate = useNavigate(); // For redirection after deletion
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState({ Pending: [], InProgress: [], Done: [] }); // State to manage task lists
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [editedTask, setEditedTask] = useState({}); // State for the task being edited

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskDoc = await getDoc(doc(db, "userTask", id));
        if (taskDoc.exists()) {
          const fetchedTask = { id: taskDoc.id, ...taskDoc.data() };
          setTask(fetchedTask);
          setTasks((prevTasks) => ({
            ...prevTasks,
            [fetchedTask.state || "Pending"]: [
              ...prevTasks[fetchedTask.state || "Pending"],
              fetchedTask,
            ],
          }));
        } else {
          console.error("No such document found with ID:", id);
          setTask(null);
        }
      } catch (error) {
        console.error("Error fetching document:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Update Task State
  const updateTaskState = async (newState) => {
    try {
      await updateDoc(doc(db, "userTask", id), { state: newState });
      setTasks((prevTasks) => {
        const prevState = task.state || "Pending";
        return {
          ...prevTasks,
          [prevState]: prevTasks[prevState].filter((t) => t.id !== task.id),
          [newState]: [...prevTasks[newState], { ...task, state: newState }],
        };
      });
      setTask((prevTask) => ({ ...prevTask, state: newState }));
    } catch (error) {
      console.error("Error updating task state:", error.message);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await deleteDoc(doc(db, "userTask", id));
      alert("Task deleted successfully!");
      navigate("/tasks"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  // Start Editing
  const startEditing = () => {
    setIsEditing(true);
    setEditedTask({ ...task });
  };

  // Save Edited Task
  const saveTask = async () => {
    try {
      await updateDoc(doc(db, "userTask", id), editedTask);
      setTask(editedTask);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [task.state || "Pending"]: prevTasks[task.state || "Pending"].map((t) =>
          t.id === task.id ? editedTask : t
        ),
      }));
      setIsEditing(false);
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error saving task:", error.message);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading task details...</p>
      ) : task ? (
        <div className="p-3 w-[330px] mx-auto my-10 bg-slate-900 rounded border">
          {isEditing ? (
            <div>
              <h1>Edit Task</h1>
              <input
                className="p-2 border rounded w-full mb-3"
                value={editedTask.task}
                onChange={(e) =>
                  setEditedTask((prev) => ({ ...prev, task: e.target.value }))
                }
                placeholder="Task Title"
              />
              <textarea
                className="p-2 border rounded w-full mb-3"
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
              ></textarea>
              <button
                onClick={saveTask}
                className="p-2 bg-green-500 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-red-500 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h1>{task.task}</h1>
              <p>Description: {task.description}</p>
              <p>Time: {task.time}</p>
              <p>Date: {task.date}</p>
              <p>Day: {task.day}</p>
              <p>State: {task.state || "Pending"}</p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => updateTaskState("Pending")}
                  className="p-2 bg-yellow-500 rounded"
                >
                  Move to Pending
                </button>
                <button
                  onClick={() => updateTaskState("InProgress")}
                  className="p-2 bg-blue-500 rounded"
                >
                  Move to InProgress
                </button>
                <button
                  onClick={() => updateTaskState("Done")}
                  className="p-2 bg-green-500 rounded"
                >
                  Move to Done
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={startEditing}
                  className="p-2 bg-gray-500 rounded"
                >
                  Edit Task
                </button>
                <button
                  onClick={deleteTask}
                  className="p-2 bg-red-500 rounded"
                >
                  Delete Task
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p>No task found for this ID!</p>
      )}

      {/* Display states */}
      <div className="flex justify-center items-start gap-5 flex-wrap mt-10">
        <div className="w-[200px] h-auto bg-yellow-200 text-black p-2 rounded-2xl">
          <h2>Pending</h2>
          {tasks.Pending.map((t) => (
            <div key={t.id} className="p-2 border rounded bg-yellow-100">
              {t.task}
            </div>
          ))}
        </div>
        <div className="w-[200px] h-auto bg-blue-200 text-black p-2 rounded-2xl">
          <h2>InProgress</h2>
          {tasks.InProgress.map((t) => (
            <div key={t.id} className="p-2 border rounded bg-blue-100">
              {t.task}
            </div>
          ))}
        </div>
        <div className="w-[200px] h-auto bg-green-200 text-black p-2 rounded-2xl">
          <h2>Done</h2>
          {tasks.Done.map((t) => (
            <div key={t.id} className="p-2 border rounded bg-green-100">
              {t.task}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
