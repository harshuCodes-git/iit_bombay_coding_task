
"use client"
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white-600 text-black shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-2xl font-bold">
            <Link href="/">Main </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-gray-300">
              Recordings
            </Link>
            <Link href="/about" className="hover:text-gray-300">
              Report History All
            </Link>
            <Link href="/services" className="hover:text-gray-300">
              Report History Filtered
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
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
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
            >
              Recordings
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
            >
              Report History All
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
            >
              Report History Filtered
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
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
