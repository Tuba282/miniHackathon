import React, { useState, useEffect } from "react";
import { onAuthStateChanged, auth, collection, addDoc, db, serverTimestamp, } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const goto = useNavigate();
  const [logedIn, setLogIn] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showAddTaskButton, setShowAddTaskButton] = useState(true);

  useEffect(() => {
    const checkUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogIn(true);
      } else {
        setLogIn(false);
      }
    });
    return () => checkUser();
  }, []);

  const handleTasks = () => {
    if (!logedIn) {
      setError("You cannot add a task without logging in.");
      setMessage("Please log in to add a task.");
      setTimeout(() => {
        goto("/login");
      }, 3000);
    } else {
      setFormVisible(true);
      setShowAddTaskButton(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const task = e.target[0].value;
    const description = e.target[1].value;
    const time = e.target[2].value;
    const date = e.target[3].value;
    const day = e.target[4].value;

    try {
      await addDoc(collection(db, "userTask"), {
        id: auth.currentUser.uid,
        task,
        description,
        time,
        date,
        day,
        timestamp: serverTimestamp(),
      });

      setTimeout(() => {
        goto("/tasks");
      }, 3000);
    } catch (error) {
      setError("Error adding task: " + error.message);
      setMessage("");
    }
  };


  // ------------------ upload image in cloudinary helping function ------------------
  // const uploadImge = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "uploadPreset");
  //   formData.append("cloud_name", "dzq61zzxb");

  //   try {
  //     const response = await fetch(
  //       `https://api.cloudinary.com/v1_1/dzq61zzxb/image/upload`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("Image upload response: ", data);
  //     if (data.secure_url) {
  //       return data.secure_url;
  //     } else {
  //       throw new Error("Image URL not found");
  //     }
  //   } catch (error) {
  //     console.log("Image upload error:", error);
  //     return null;
  //   }
  // };
  return (
    <div className="p-0 sm:p-0 w-full h-screen flex flex-col justify-center items-center font-[ZCOOL] text-center">
      {showAddTaskButton && (
        <button
          onClick={handleTasks}
          className="p-2 rounded my-3 w-[150px] bg-white text-black hover:bg-[#08110E] hover:border-white border hover:text-white mx-auto transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        >
          Add Task
        </button>
      )}
      {error && <p className="text-red-500 text-xs my-3">{error}</p>}
      {message && <p className="text-green-500 text-xs my-3">{message}</p>}
      {formVisible && logedIn && (
        <div className="w-[100%] lg:w-[60%] m-10 lg:m-0  flex items-center justify-center min-h-100 mx-auto bg-[#3C4658] my-5 rounded p-2 gap-2">
          <div className="relative hidden md:flex justify-center items-center text-black w-[100%] lg:w-[40%] min-h-120 bg-gray-100 rounded">
            <img
              src={"/addBLogImg.jpg"}
              className="absolute w-full h-full object-cover rounded"
              alt="addBlogImage"
            />
            <span className=" text-6xl z-50 text-white text-shadow-2xs text-shadow-black font-[ZCOOL] font-extrabold"> Add your <br /> Task</span>
          </div>
          <form
            className="grid w-[100%] lg:w-[60%] h-full lg:min-h-100 p-2 bg-black text-white rounded"
            onSubmit={handleSubmit}
          >
            <label className="flex justify-between items-center gap-3 my-4">
              <span className="w-full lg:w-[50%] mb-1 text-left font-medium text-xl">
                Task
              </span>
              <input
                className="form-input w-full p-2 border rounded border-gray-300 text-white placeholder:text-gray-300 outline-none text-xs"
                type="text"
                placeholder="add task here ..."
                required
              />
            </label>
            <label className="w-full grid gap-3 my-4">
              <p className="w-[100%] mb-1 font-medium text-left text-white text-xl">Task Description</p>
              <textarea
                className="w-full form-input p-2 border rounded border-gray-300 bg-white text-black placeholder:text-gray-600 outline-none text-xs"
                type="text"
                placeholder="add description here ..."
                required
              ></textarea>
            </label>
            <label className="flex justify-between items-center gap-3 my-4">
              <span className="w-full lg:w-[50%] mb-1 text-left font-medium text-xl">
                Time
              </span>
              <input
                className="form-input w-full p-2 border rounded border-gray-300 text-white placeholder:text-gray-300 outline-none text-xs"
                type="time" placeholder="add time"
                required
              />
            </label>
            <label className="flex justify-between items-center gap-3 my-4">
              <span className="w-full lg:w-[50%] mb-1 text-left font-medium text-xl">
                Date
              </span>
              <input
                className="form-input w-full p-2 border rounded border-gray-300 text-white placeholder:text-gray-300 outline-none text-xs"
                type="date" placeholder="add date"
                required
              />
            </label>
            <label className="flex justify-between items-center gap-3 my-4">
              <span className="w-full lg:w-[50%] mb-1 text-left font-medium text-xl">
                Day
              </span>
              <select
                className="form-select w-full p-2 border rounded border-gray-300 text-white placeholder:text-gray-300 outline-none text-xs"
                required
              >
                <option className="bg-black" value="">Select Day</option>
                <option className="bg-black" value="Monday">Monday</option>
                <option className="bg-black" value="Tuesday">Tuesday</option>
                <option className="bg-black" value="Wednesday">Wednesday</option>
                <option className="bg-black" value="Thursday">Thursday</option>
                <option className="bg-black" value="Friday">Friday</option>
                <option className="bg-black" value="Saturday">Saturday</option>
                <option className="bg-black" value="Sunday">Sunday</option>
              </select>
            </label>
            <input
              type="submit"
              className="w-full transition delay-150 duration-250 ease-in-out hover:scale-90 bg-white text-gray-900 p-2 rounded"
              value="Done Adding"
            />
          </form>
        </div>
      )}

      
    </div>
  );
};

export default AddTask;
