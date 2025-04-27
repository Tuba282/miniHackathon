import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconBrandGithubFilled, IconBrandGoogleFilled, IconChecks } from "@tabler/icons-react"
import {
    auth, createUserWithEmailAndPassword, GoogleAuthProvider,
    signOut,
    signInWithPopup,
    GithubAuthProvider, doc, db, setDoc, serverTimestamp, addDoc, collection,

} from '../firebaseConfig.js'

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const addImage = useRef();
    const modalRef = useRef(null);
    const goto = useNavigate();


    const handleSubmit = async (e) => {


        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const imageFile = await uploadImge(addImage.current.files[0]);
            setMessage("User created successfully!");
            setError("");
            // Use addDoc to add a new user without overwriting
            await addDoc(collection(db, "users"), {
                id: auth.currentUser.uid,
                displayName: e.target[0].value,
                email,
                photoURL: imageFile,
                isAdmin: false,
                timestamp: serverTimestamp(),
            });

            localStorage.setItem("userName", e.target[0].value);
            localStorage.setItem("userImage", imageFile);

        } catch (error) {
            setError(error.message);

        }

    }
    // ------------------ upload image in cloudinary helping function ------------------
    const uploadImge = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "uploadPreset");
        formData.append("cloud_name", "dzq61zzxb");

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dzq61zzxb/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            console.log("Image upload response: ", data);
            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error("Image URL not found");
            }
        } catch (error) {
            console.log("Image upload error:", error);
            return null;
        }
    };
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            await signOut(auth)
            console.log("user successfully signOut from Google");
            const credentials = await signInWithPopup(auth, provider);

            setMessage("User created successfully!");
            setError("");
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                id: auth.currentUser.uid,
                displayName: credentials.user.displayName,
                email: credentials.user.email,
                photoURL: credentials.user.photoURL,
                isAdmin: false,
                timestamp: serverTimestamp(),
            });


            localStorage.setItem("userImage", credentials.user.photoURL || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
            localStorage.setItem("userName", credentials.user.displayName)



        } catch (error) {
            setError(error.message);
        }

    }
    const signInWithGithub = async () => {
        const provider = new GithubAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            await signOut(auth)
            console.log("user successfully signOut from Google");
            const credentials = await signInWithPopup(auth, provider);

            localStorage.setItem("userImage", credentials.user.photoURL || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg");
            localStorage.setItem("userName", credentials.user.displayName)
            setMessage("User created successfully!");
            setError("");
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                id: auth.currentUser.uid,
                displayName: credentials.user.displayName,
                email: credentials.user.email,
                photoURL: credentials.user.photoURL,
                isAdmin: false,
                timestamp: serverTimestamp(),
            });


        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                modalRef.current.classList.remove("flex");
                modalRef.current.classList.add("hidden");


                goto("/signup");
            }, 1000);
        }

    }
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                setError("");
                setMessage("");
            }, 2000); // 2 seconds

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [error, message]);


    return (
        <section className="px-4 py-24 mx-auto max-w-7xl">
            <div className="w-full mx-auto space-y-5 sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12 bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-4xl font-semibold text-center text-gray-900">Sign up</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="block mb-1 text-xs font-medium text-gray-700">Name</span>
                        <input className="form-input w-full placeholder:text-gray-600 text-black p-1 border border-gray-300 outline-none text-xs" type="text" placeholder="Your full name" required />
                    </label>
                    <label className="block">
                        <span className="block mb-1 text-xs font-medium text-gray-700">Your Email</span>
                        <input className="form-input w-full placeholder:text-gray-600 text-black  p-1 border border-gray-300 outline-none text-xs" type="email" placeholder="Ex. james@bond.com" onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="block mb-1 text-xs font-medium text-gray-700">Create a password</span>
                        <input className="form-input w-full  text-gray-600 p-1 border border-gray-300 outline-none text-xs" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <label className="flex justify-between items-center gap-3 my-4">
                        <span className="w-50 block mb-1 text-xs font-medium text-gray-700">
                            Add Image
                        </span>
                        <input ref={addImage} className="hidden" type="file" />
                        <span
                            className="w-50 form-input rounded font-medium placeholder:text-black text-gray-100 text-center p-1 border bg-black border-gray-300 outline-none text-xs transition delay-150 duration-250 ease-in-out hover:scale-90"

                        >
                            Click me
                        </span>
                    </label>
                    <input type="submit" className="w-full bg-black text-white p-2 rounded transition delay-150 duration-250 ease-in-out hover:scale-90" value="Sign Up" />
                </form>

                {/* Error Modal */}
                {error && (
                    <div
                        ref={modalRef}
                        className="fixed w-full h-full inset-0 z-50 grid place-content-center bg-black/50 p-4 transition-opacity duration-300"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modalTitle"
                    >
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                            <h2 id="modalTitle" className="text-xl font-bold text-red-600 sm:text-2xl">Error !!</h2>
                            <div className="mt-4">
                                <p className="text-pretty text-gray-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message Modal */}
                {message && (
                    <div
                        ref={modalRef}
                        className="fixed w-full h-full inset-0 z-50 grid place-content-center bg-black/50 p-4 transition-opacity duration-300"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modalTitle"
                    >
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                            <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl capitalize">
                                Account Successfully Created
                            </h2>
                            <div className="mt-4">
                                <p className="text-pretty text-gray-700">
                                    {message} Redirecting to the login page. Good Day Buddy...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-full flex justify-between items-center py-6 border-b border-gray-200">
                    <span onClick={signInWithGoogle} className="w-[45%] cursor-pointer py-3 flex gap-3 bg-[#0AACBE] rounded text-white items-center justify-center transition delay-150 duration-250 ease-in-out hover:scale-90">
                        <IconBrandGoogleFilled />Google
                    </span>
                    <span onClick={signInWithGithub} className="w-[45%] cursor-pointer py-3 flex gap-3 bg-[#0AACBE] rounded text-white items-center justify-center transition delay-150 duration-250 ease-in-out hover:scale-90">
                        <IconBrandGithubFilled />Github
                    </span>
                </div>
                <Link className=" text-center text-xs text-gray-500 underline" to={'/login'}>
                    Already have an account? Login

                </Link>
            </div>
        </section>


    )
}

export default SignUp
