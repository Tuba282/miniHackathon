
import React, { useState, useEffect } from "react";
// import { auth, getDoc, doc, db } from "../firebaseConfig.js"
import { Sidebar, SidebarBody, SidebarLink } from "../Components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,IconError404Off,IconChecklist,IconClick
} from "@tabler/icons-react";
import { cn } from "/lib/utils";
import { motion } from "motion/react";
import { Outlet, Link } from "react-router-dom";

export function SidebarDemo() {
   
    const [open, setOpen] = useState(false);
    const [userName, setUserName] = useState("Anonymous");
    const [userImage, setUserImage] = useState("https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg");

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName");
        const storedUserImage = localStorage.getItem("userImage");
        console.log("Stored userName:", storedUserName);
        console.log("Stored userImage:", storedUserImage);

        if (storedUserName) {
            setUserName(storedUserName);
        }
        if (storedUserImage) {
            setUserImage(storedUserImage);
        }
    }, []);


    motion
    const links = [
        {
            label: "Dashboard",
            to: "/",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Tasks",
            to: "/tasks",
            icon: (
                <IconChecklist className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Add Task",
            to: "/addtask",
            icon: (
                <IconClick className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "Page404",
            to: "*",
            icon: (
                <IconError404Off className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
        {
            label: "login",
            to: "/login",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
            ),
        },
    ];
    
    return (
        <div
            className={cn(
                "mx-auto flex h-screen w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200  md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                

            )}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} to={link.to} />
                            ))}
                        </div>
                    </div>
                    <div>
                    <SidebarLink
                            link={{
                                label: userName,
                                to: "/profile",
                                icon: (
                                    <img
                                        src={userImage || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"}
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="w-full h-full overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}
export const Logo = () => {
    return (
        <Link
            to="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            <img src="/logo.png" className="h-8 w-8 shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-[ZCOOL] font-extrabold tracking-wide text-white whitespace-pre text-shadow-2xs text-shadow-black dark:text-white">
                Task Tracker App
            </motion.span>
        </Link>
    );
};
export const LogoIcon = () => {
    return (
        <Link
            to="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            <img src="/logo.png" className="h-8 w-8 shrink-0" />
        </Link>
    );
};
