import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, signInWithEmailAndPassword } from '../firebaseConfig.js'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const modalRef = useRef(null);
    const [logedIn, setLogIn] = useState(false);

    const goto = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredentials.user);
            setError("");
            setLogIn(true);
            setTimeout(() => {
                modalRef.current.classList.remove("flex");
                modalRef.current.classList.add("hidden");


                goto("/");
            }, 1000);

        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <section className="px-4 h-screen py-24 mx-auto max-w-7xl">
            <div className="w-full mx-auto space-y-5 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12 bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-4xl font-semibold text-center text-gray-900">Login Form</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    <label className="block">
                        <span className="block mb-1 text-xs font-medium text-gray-700">Email</span>
                        <input className="form-input w-full p-1 border border-gray-300 text-gray-700 placeholder:text-gray-700 outline-none text-xs" type="email" placeholder="Ex. james@bond.com" onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="block mb-1 text-xs font-medium text-gray-700">Password</span>
                        <input className="form-input w-full p-1 border border-gray-300 text-gray-700 placeholder:text-gray-700 outline-none text-xs" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <input type="submit" className="w-full bg-black text-white p-2 rounded" value="Login" />
                </form>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                {/* {message && <p className="text-green-500 text-xs">{message}</p>} */}
                <div className="flex justify-between items-center py-6 border-b border-gray-200">
                    <Link to={'/signup'} className="text-center text-xs text-gray-500 underline">
                        create an account
                    </Link>
                    <Link to={'/forgetpassword'} className="text-center text-xs text-gray-500 underline">
                        forget password
                    </Link>
                </div>
            </div>
            {
                logedIn && (
                    < div ref={modalRef}
                        className="fixed  w-full h-full  inset-0 z-50 grid place-content-center bg-black/50 p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modalTitle"
                    >
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                            <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl ">Login Successfully</h2>

                            <div className="mt-4">
                                <p className="text-pretty text-gray-700">
                                    You have successfully logged in. Redirecting to the home page Good Day Buddy...
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    )
}

export default Login