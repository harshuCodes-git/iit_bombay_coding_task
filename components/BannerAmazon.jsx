import React from 'react'
import Link from "next/link";

const BannerAmazon = () => {
  return (
    <div>
      <header className="flex flex-wrap justify-between items-center mb-8 p-4">
        <div className="flex items-center gap-4">
          <img src="/file.svg" alt="Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-gray-800">
            Amazon School of Languages
          </h1>
        </div>

        {/* Responsive Navigation */}
        <nav className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-end mt-4 sm:mt-0">
          <Link
            href="/"
            className="text-lg font-medium hover:text-blue-600 underline text-center sm:text-left"
          >
            Recordings
          </Link>
          <Link
            href="/report-history"
            className="text-lg font-medium hover:text-blue-600 text-center sm:text-left"
          >
            Reports
          </Link>
        </nav>
      </header>
    </div>
  );
}

export default BannerAmazon
