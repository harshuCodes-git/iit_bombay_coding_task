import React, { useState, useEffect } from "react";
import axios from "axios"; // Don't forget to import Axios!
import { FaCalendarAlt } from "react-icons/fa";

const ReportFilter = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [studentName, setStudentName] = useState("All");
  const [reports, setReports] = useState([]); // Fixed typo from 'seTreports' to 'setReports'
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/studentlog/get");
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="flex flex-col text-xl md:flex-row md:items-center w-full p-4 md:p-6  space-y-4 md:space-y-0 md:space-x-4">
      <label className="font-semibold pl-6 ">Filter Report Generated:</label>

      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
        <div className="flex items-center space-x-2">
          <FaCalendarAlt />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-purple-200 rounded-md  px-2 py-1 focus:outline-none w-full md:w-auto"
          />
          <span className="font-semibold">From</span>
        </div>

        <div className="flex items-center space-x-2">
          <FaCalendarAlt />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-purple-200 rounded-md px-2 py-1 focus:outline-none w-full md:w-auto"
          />
          <span className="font-semibold">To</span>
        </div>
      </div>

      <label className="font-semibold">Filter Student Name:</label>
      <select
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        className="bg-purple-200 rounded-md w-full md:w-36 px-2 py-1 focus:outline-none"
      >
        <option value="All">All</option>
        {reports.map((report, index) => (
          <option key={index} value={report.studentName}>
            {report.StudentName}
          </option>
        ))}
      </select>

      {loading && <p>Loading reports...</p>}
    </div>
  );
};

export default ReportFilter;
