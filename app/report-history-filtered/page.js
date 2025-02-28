"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useUUID } from "@/app/context/UUIDContext";
import { AudioPlayer } from "@/components/AudioPlayComponent";
import Navbar from "@/components/Navbar";
import ReportFilter from "@/components/ReportFilter";
import LoadingComponent from "@/components/LoadingComponent";
import SolutionDisplay from "@/components/SolutionDisplay";
import { FaCalendarAlt } from "react-icons/fa";

const Page = () => {
  const [reports, seTreports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [solution, setSolution] = useState(null);
  const { uuid } = useUUID();

//   console.log(uuid);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/studentlog/get");
        seTreports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const addTime = (
    isoString,
    timeToAdd = { hours: 0, minutes: 0, seconds: 0 }
  ) => {
    const date = new Date(isoString);

    date.setHours(date.getHours() + (timeToAdd.hours || 0));
    date.setMinutes(date.getMinutes() + (timeToAdd.minutes || 0));
    date.setSeconds(date.getSeconds() + (timeToAdd.seconds || 0));

    return date.toISOString();
  };

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [studentName, setStudentName] = useState("All");
  const [filteRreports, setFilterReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/studentlog/get");
        setFilterReports(res.data);
        setFilteredReports(res.data); // Initially show all reports
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Combined Filter Logic for Date Range and Name
  useEffect(() => {
    const filterReports = () => {
      let filtered = reports;

      // Filter by Date Range
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.apiCallTime);
        const isDateInRange =
          (!fromDate || reportDate >= new Date(fromDate)) &&
          (!toDate || reportDate <= new Date(toDate));
        return isDateInRange;
      });

      // Filter by Student Name
      if (studentName !== "All") {
        filtered = filtered.filter(
          (report) => report.StudentName === studentName
        );
      }

      setFilteredReports(filtered);
    };

    filterReports();
  }, [fromDate, toDate, studentName, reports]);

  // Reset Filters
  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setStudentName("All");
    setFilteredReports(reports);
  };


  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div>
          <Navbar />

          <div className="min-h-screen bg-gray-50 p-4 pt-28">
            <div className="max-w-7xl mx-auto p-4">
              <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <img src="/file.svg" alt="Logo" className="w-12 h-12" />
                  <h1 className="text-2xl font-bold">
                    Amazon School of Languages
                  </h1>
                </div>
                <nav className="flex gap-8">
                  <a
                    href="#recordings"
                    className="text-lg font-medium hover:text-blue-600"
                  >
                    Recordings
                  </a>
                  <a
                    href="#reports"
                    className="text-lg font-medium underline hover:text-blue-600"
                  >
                    Reports
                  </a>
                </nav>
              </header>

              {/* Components calls */}
              {/* <ReportFilter/> */}
              {/* Filter method  */}

              <div className="p-4 md:p-6 space-y-4">
                <div className="flex flex-col text-xl md:flex-row md:items-center w-full space-y-4 md:space-y-0 md:space-x-4">
                  <label className="font-semibold pl-6">
                    Filter Report Generated:
                  </label>

                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <span className="font-semibold">From</span>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt />
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="bg-purple-200 rounded-md  px-2 py-1 focus:outline-none w-full md:w-auto"
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

                  <label className="font-semibold">Filter Student Name:</label>
                  <select
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="bg-purple-200 rounded-md w-full md:w-36 px-2 py-1 focus:outline-none"
                  >
                    <option value="All">All</option>
                    {reports.map((report, index) => (
                      <option key={index} value={report.StudentName}>
                        {report.StudentName}
                      </option>
                    ))}
                  </select>
                </div>

                {loading && <p>Loading reports...</p>}

                {!loading && (
                  <div className="overflow-x-auto">
                    <Table className="min-w-full  bg-white rounded-xl shadow-lg overflow-hidden">
                      <Thead className="bg-purple-500 border border-gray-800 text-white font-semibold text-lg">
                        <Tr>
                          <Th className="py-4 px-6 text-center border border-gray-800">
                            Student Name
                          </Th>
                          <Th className="py-4 px-6 text-center border border-gray-800">
                            Story Read
                          </Th>
                          <Th className="py-4 px-6 text-center border border-gray-800">
                            Audio File
                          </Th>
                          <Th className="py-4 px-6 text-center border border-gray-800">
                            API call time
                          </Th>
                          <Th className="py-4 px-6 text-center border border-gray-800">
                            API response Time
                          </Th>
                          <Th className="py-4 px-6 text-center border border-gray-800">
                            Report
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredReports.map((report, index) => (
                          <Tr
                            key={index}
                            className="border border-gray-600 hover:bg-gray-100 cursor-pointer"
                          >
                            <Td className="py-3 px-6 text-center border border-gray-600">
                              {report.StudentName}
                            </Td>
                            <Td className="py-3 px-6 text-center border border-gray-600 ">
                              {report.Story}
                            </Td>
                            <Td className="py-3 px-4 text-center border border-gray-600">
                              <AudioPlayer audioFile={report.audioFile} />
                            </Td>

                            <Td className="py-3 px-6 text-center border border-gray-600 ">
                              {formatDateTime(report.apiCallTime)}
                            </Td>
                            <Td className="py-2 px-4 text-center border border-gray-600 ">
                              {report.responseTime}
                            </Td>

                            <Td className="py-3 px-6 text-center">
                              {report.reportURL && (
                                <div className="mt-4 ">
                                  <p>
                                    <SolutionDisplay solution={report} />
                                  </p>

                                  {formatDateTime(
                                    addTime(report.apiCallTime, {
                                      seconds: report.responseTime,
                                    })
                                  )}
                                </div>
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
