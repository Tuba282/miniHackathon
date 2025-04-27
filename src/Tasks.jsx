import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "userTask"), (snapshot) => {
            const taskData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setTasks(taskData);


        });
        return () => unsubscribe();
    }, []);
    return (
        <div className="flex flex-col w-full p-20">
            <h1 className="text-5xl font-bold font-[ZCOOL] my-3">Board</h1>
            <div className="flex gap-5 flex-wrap">

                {tasks.map((task) => (
                    <Link
                        to={`/tasks/${task.id}`}
                        className="w-[300px] min-h-50 grid p-5 rounded border bg-slate-900"
                        key={task.id}
                    >
                        <h2>
                            <span className="font-[ZCOOL] font-bold">Task</span> : {task.task}
                        </h2>
                        <p>
                            <span className="font-[ZCOOL] font-bold">Desp</span> : {task.description}
                        </p>
                        <p>
                            <span className="font-[ZCOOL] font-bold">Date</span> : {task.date}
                        </p>
                        <p>
                            <span className="font-[ZCOOL font-bold">Day</span> : {task.day}
                        </p>
                        <p>
                            <span className="font-[ZCOOL] font-bold">Time</span> : {task.time}
                        </p>
                    </Link>
                ))}

            </div>
        </div>
    )
}

export default Tasks
