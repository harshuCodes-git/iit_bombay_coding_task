"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useUUID } from "@/app/context/UUIDContext";
import { AudioPlayer } from "@/components/AudioPlayComponent";
import Navbar from "@/components/Navbar";
import ReadingReport from "@/components/ReadingReport";
import ReportFilter from "@/components/ReportFilter";
import Link from "next/link";
import LoadingComponent from "@/components/LoadingComponent";
import SolutionDisplay from "@/components/SolutionDisplay";

const Page = () => {
  const [reports, seTreports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [solution, setSolution] = useState(null);
  const { uuid } = useUUID();

  console.log(uuid);

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

  const clickOnURL = (id) => {
    router.push(`/report/${id}`);
  };

  // checking audio file is working or not

  const generateReport = async (reportfileUrl) => {
    if (!reportfileUrl) {
      alert("No uploaded file URL found!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/generate-report", {
        s3_url: reportfileUrl,
      });
      setSolution(response.data);
      alert("Report generated successfully!");

      // Scroll to the section with id "generated-report"
      document.getElementById("generated-report");
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Report generation failed!");
    } finally {
      setLoading(false);
    }
  };

  const renderAudioOrPlaceholder = (audioFile) => {
    if (!audioFile) {
      return <div>Not uploaded</div>;
    }
    return (
      <div className="flex w-30">
        <audio controls>
          <source src={audioFile} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  };

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

  const handleRowClick = (id) => {
    router.push(`/report/${id}`);
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
                    {reports.map((report, index) => (
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
                            <div className="mt-4">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
