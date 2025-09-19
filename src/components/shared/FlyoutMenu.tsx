"use client";

import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/oauth/AuthContext";
import AuthButton from "@/components/oauth/AuthButton";

const FlyoutMenu: FC<PropsWithChildren> = ({ children }) => {
  const [ open, setOpen ] = useState(false);
  const pathname = usePathname();

  const { loggedIn } = useAuth();

  // Close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger button */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="bg-white text-gray-800 border-none rounded shadow-md p-2 cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="5" width="28" height="3" rx="1.5" fill="#222" />
          <rect y="12.5" width="28" height="3" rx="1.5" fill="#222" />
          <rect y="20" width="28" height="3" rx="1.5" fill="#222" />
        </svg>
      </button>
      {/* Flyout menu */}
      <div
        className="fixed top-0 flex flex-col bg-gray-700 h-screen p-0 w-[260px] z-[2100]"
        style={{
          left: open ? 0 : -260,
          boxShadow: open ? "2px 0 12px rgba(0,0,0,0.12)" : undefined,
          transition: "left 0.3s cubic-bezier(.4,0,.2,1)"
        }}
      >
        <div className="flex justify-end p-3 pb-1">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="bg-none border-none text-2xl cursor-pointer"
          >
            &times;
          </button>
        </div>  
        <nav className="flex flex-col gap-2 py-2 border-b border-gray-600">
          <Link href="/" className="text-whiste hover:text-sky-300 font-medium">Calendar</Link>
          <Link href="/preferences" className="text-white hover:text-sky-300 font-medium">Preferences</Link>
        </nav>
        <div className="flex-grow overflow-y-auto mt-2">
          { !loggedIn && (
          <AuthButton />
        )}
          {children}
        </div>
      </div>
      {/* Overlay */}
      { open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed top-0 left-0 w-screen h-screen bg-gray-800 z-[2005]"
          style={{ background: "rgba(0,0,0,0.18)" }}
        ></div>
      )}
    </>
  );
};

export default FlyoutMenu;