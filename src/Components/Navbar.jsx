import React from "react";
import { FloatingDock } from "./ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandFacebook,
  IconAlignBoxLeftBottom,
  IconHome,
  IconAperture,
  IconSettings
} from "@tabler/icons-react";

export default function Navbar() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      to: "/",
    },

    {
      title: "Firebase",
      icon: (
        <IconAlignBoxLeftBottom className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      to: "/firebase",
    },
    {
      title: "Aceternity UI",
      icon: (
        <img
          src="/logo.png"
          width={20}
          height={20}
          alt="Aceternity Logo" />
      ),
      to: "/",
    },
    {
      title: "Services",
      icon: (
        <IconAperture className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      to: "/services",
    },

    // {
    //   title: "Facebook",
    //   icon: (
    //     <IconBrandFacebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    //   ),
    //   to: "/about",
    // },
    // {
    //   title: "SignUp",
    //   icon: (
    //     <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    //   ),
    //   to: "/signup",
    // },
    {
      title: "Login",
      icon: (
        <img
          src="/login.png"
          width={20}
          height={20}
          alt="Aceternity Logo" />
      ),
      to: "/login",
    },
  ];
  return (
    <div className="flex items-center justify-end sm:justify-center my-2 sm:my-10 relative  w-full">
      <FloatingDock
        // only for demo, remove for production
        mobileClassName="translate-y-0"
        items={links} />
    </div>
  );
}

/*
<Link to="/" className="px-4">Home</Link>
<Link to="/about" className="px-4">About</Link>
<Link to="/services" className="px-4">Services</Link>
*/ 