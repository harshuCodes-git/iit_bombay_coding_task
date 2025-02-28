import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaCalendarAlt } from "react-icons/fa";

const ReportFilter = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [studentName, setStudentName] = useState("All");
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/studentlog/get");
        setAllReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filtering Logic
  const filteredReports = useMemo(() => {
    return allReports.filter((report) => {
      const reportDate = new Date(report.apiCallTime);

      const isDateInRange =
        (!fromDate || reportDate >= new Date(fromDate)) &&
        (!toDate || reportDate <= new Date(toDate));

      const isNameMatch =
        studentName === "All" || report.StudentName === studentName;

      return isDateInRange && isNameMatch;
    });
  }, [fromDate, toDate, studentName, allReports]);

  // Reset Filters
  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setStudentName("All");
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col text-xl md:flex-row md:items-center w-full space-y-4 md:space-y-0 md:space-x-4">
        <label className="font-semibold pl-6">Filter Report Generated:</label>

        {/* Date Filter */}
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <span className="font-semibold">From</span>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-purple-200 rounded-md px-2 py-1 focus:outline-none w-full md:w-auto"
            />
          </div>

          <span className="font-semibold">To</span>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-purple-200 rounded-md px-2 py-1 focus:outline-none w-full md:w-auto"
            />
          </div>
        </div>

        {/* Name Filter */}
        <label className="font-semibold">Filter Student Name:</label>
        <select
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="bg-purple-200 rounded-md w-full md:w-36 px-2 py-1 focus:outline-none"
        >
          <option value="All">All</option>
          {[...new Set(allReports.map((report) => report.StudentName))].map(
            (name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            )
          )}
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-500 text-white rounded-md px-4 py-1 hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>

      {loading && <p>Loading reports...</p>}

      {!loading && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Student Name</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Report Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{report.StudentName}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(report.apiCallTime).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{report.details}</td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No reports found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportFilter;
