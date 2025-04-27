import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../firebaseConfig.js";

const ForgetPassword = () => {
  const [recoveryEmail, setRecoveryEmail] = useState(""); // State for email
  const [error, setError] = useState(""); // Error state
  const [message, setMessage] = useState(""); // Success message state

  const modalRef = useRef(null);

  const handleForgetPassword = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      if (!recoveryEmail) {
        setError("Please enter a valid email address.");
        return;
      }
      await sendPasswordResetEmail(auth, recoveryEmail); // Firebase function call
      setMessage("Password reset email sent successfully!");
      setError("");

      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.classList.remove("flex");
          modalRef.current.classList.add("hidden");
        }
      }, 2000);
    } catch (error) {
      setError(error.message);
      setMessage("");

      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.classList.remove("flex");
          modalRef.current.classList.add("hidden");
        }
      }, 2000);
    }
  };

  return (
    <section className="px-4 w-full h-screen py-24 mx-auto max-w-7xl">
      <div className="w-full mx-auto space-y-5 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12 bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-4xl font-semibold text-center text-gray-900">
          Forget Password
        </h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleForgetPassword}>
          <label className="block">
            <span className="block mb-1 text-xs font-medium text-gray-700">
              Recovery Email
            </span>
            <input
              className="form-input w-full p-1 border placeholder:text-black text-gray-700 border-gray-300 outline-none text-xs"
              type="email"
              placeholder="Ex. james@bond.com"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)} // Updating state
              required
            />
          </label>
          <input
            type="submit"
            className="w-full bg-black text-white p-2 rounded"
            value="Reset Password"
          />
        </form>

        {/* Modal for Error or Success */}
        {error ? (
          <div
            ref={modalRef}
            className="fixed w-full h-full inset-0 z-50 grid place-content-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
          >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2
                id="modalTitle"
                className="text-xl font-bold text-red-600 sm:text-2xl"
              >
                Error !!
              </h2>
              <div className="mt-4">
                <p className="text-pretty text-gray-700">{error}</p>
              </div>
            </div>
          </div>
        ) : message ? (
          <div
            ref={modalRef}
            className="fixed w-full h-full inset-0 z-50 grid place-content-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
          >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2
                id="modalTitle"
                className="text-xl font-bold text-gray-900 sm:text-2xl capitalize"
              >
                Password reset email sent successfully!
              </h2>
              <div className="mt-4">
                <p className="text-pretty text-gray-700">{message}</p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* Navigation Links */}
        <div className="flex justify-between items-center py-6 border-b border-gray-200">
          <Link
            to={"/signup"}
            className="text-center text-xs text-gray-500 underline"
          >
            create an account
          </Link>
          <Link
            to={"/login"}
            className="text-center text-xs text-gray-500 underline"
          >
            login to your account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
