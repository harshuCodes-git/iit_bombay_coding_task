"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Utility function for setting active class
  const getLinkClass = (path) =>
    pathname === path ? "text-red-600" : "hover:text-gray-800";

  return (
    <nav className="bg-white text-black shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-2xl font-bold">
            <Link href="/">Digital Audio Processing Task</Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className={getLinkClass("/")}>
              Recordings
            </Link>
            <Link
              href="/report-history"
              className={getLinkClass("/report-history")}
            >
              Report History All
            </Link>
            <Link
              href="/report-history-filtered"
              className={getLinkClass("/report-history-filtered")}
            >
              Report History Filtered
            </Link>
            <Link
              href="/report-page-model"
              className={getLinkClass("/report-page-model")}
            >
              Report Page/ Modal
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-2xl focus:outline-none"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <li>
            <Link
              href="/"
              className={`${getLinkClass(
                "/"
              )} block px-3 py-2 rounded-md text-base font-medium`}
            >
              Recordings
            </Link>
          </li>
          <li>
            <Link
              href="/report-history"
              className={`${getLinkClass(
                "/report-history"
              )} block px-3 py-2 rounded-md text-base font-medium`}
            >
              Report History All
            </Link>
          </li>
          <li>
            <Link
              href="/report-history-filtered"
              className={`${getLinkClass(
                "/report-history-filtered"
              )} block px-3 py-2 rounded-md text-base font-medium`}
            >
              Report History Filtered
            </Link>
          </li>
          <li>
            <Link
              href="/report-page-model"
              className={`${getLinkClass(
                "/report-page-model"
              )} block px-3 py-2 rounded-md text-base font-medium`}
            >
              Report Page/ Modal
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
