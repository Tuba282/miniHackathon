import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Page404 from "./Pages/Page404";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import ForgetPassword from "./Pages/ForgetPassword";
import Admin from "./Pages/Admin";
import Tasks from "./Tasks";
import AddTask from "./Pages/AddTask";
import EditTask from "./Pages/EditTask.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/tasks/:id" element={<EditTask />} />
      <Route path="/addtask" element={<AddTask />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="*" element={<Page404 />} />
    </Route>
  )
);
