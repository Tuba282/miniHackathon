import React from "react";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="p-6 w-full h-full flex flex-col justify-center items-center text-center">
      <img src="/loader.gif" className="w-[200px]" />
      <h1 className="font-bold text-6xl">404</h1>
      <p>Page Not Found</p>
      <Link to="/" className="text-blue-500">Go Back to Home</Link>
    </div>
  );
};

export default Page404;
