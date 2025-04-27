import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

const TaskDetail = () => {
  const { id } = useParams(); // Get ID from URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true); // For loader

  useEffect(() => {
    const fetchTask = async () => {
      try {
        console.log("Fetching document with ID:", id); // Log the ID
        const taskDoc = await getDoc(doc(db, "userTask", id));
        if (taskDoc.exists()) {
          setTask(taskDoc.data());
        } else {
          console.error("No such document found with ID:", id);
          setTask(null);
        }
      } catch (error) {
        console.error("Error fetching document:", error.message);
      } finally {
        setLoading(false); // Stop loader
      }
    };

    fetchTask();
  }, [id]);

  return (
    <div>
    {loading ? (
      <p>Loading task details...</p>
    ) : task ? (
      <div className="p-3 w-[330px] mx-auto my-10 bg-slate-900 rounded border">
        <h1>{task.task}</h1>
        <p>Description: {task.description}</p>
        <p>Time: {task.time}</p>
        <p>Date: {task.date}</p>
        <p>Day: {task.day}</p>
      </div>
    ) : (
      <p>No task found for this ID!</p>
    )}


    <div className="flex justify-center items-center gap-5 flex-wrap mt-10">
      <div className="w-[200px] h-[200px] bg-slate-200 text-black flex justify-center items-center rounded-2xl">Pending</div>
      <div className="w-[200px] h-[200px] bg-slate-200 text-black flex justify-center items-center rounded-2xl">INProgress</div>
      <div className="w-[200px] h-[200px] bg-slate-200 text-black flex justify-center items-center rounded-2xl">Done</div>
    </div>
  </div>
  );
};

export default TaskDetail;
