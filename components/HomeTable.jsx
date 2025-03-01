"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useUUID } from "@/app/context/UUIDContext";
import LoadingComponent from "./LoadingComponent";
import { RefreshCw } from "lucide-react";
import SolutionDisplay from "@/components/SolutionDisplay";

const HomeTable = () => {
  const [reports, seTreports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [report, setReport] = useState(null);
  const [viewloading, setViewLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [storyName, setStoryName] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [response, setResponse] = useState([]);
  const [solution, setSolution] = useState(null);
  const [audioUploaded, setAudioUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { uuid } = useUUID();
  const [openRows, setOpenRows] = useState({});

  console.log(uuid);

  const [open, setOpen] = useState(false);

  const handleAudioUpload = () => {
    setAudioUploaded(true);
  };

  // Select audio file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to S3
  const uploadToS3 = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData);
      setFileUrl(response.data.url);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    } finally {
      setLoading(false);
      setOpen(false);
      setUploading(true);
    }
  };

  //ulpoad to student report tabke in dynamodb
  const uploadToStudentTables = async () => {
    if (!fileUrl) {
      alert("No uploaded file URL found!");
      return;
    }

    if (!userName || !storyName) {
      alert("Please provide your name and the story name!");
      return;
    }

    setLoading(true);
    const callTime = new Date(); // Record start time here
    setStartTime(callTime);

    try {
      // Start timing before generating the report
      const startTime = performance.now();
      const reportJSON = await generateReportSASAPI(fileUrl);
      const endTime = performance.now();

      // Calculate duration in seconds
      const duration = Math.round((endTime - startTime) / 1000);
      setTimeTaken(duration);

      // Ensure callTime is not null before using toISOString()
      await axios.post("/api/studentlog/save", {
        ...response.data,
        id: uuid,
        StudentName: userName,
        Story: storyName,
        audioFile: fileUrl,
        apiCallTime: callTime.toISOString(), // Use toISOString() for consistent date format
        responseTime: duration, // Pass as a number (in seconds)
        reportURL: fileUrl,
        mainReport: reportJSON,
      });

      alert("Report generated and saved successfully!");
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Report generation failed!");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // Generate Report from SAS API
  const generateReportSASAPI = async (reportURL) => {
    try {
      const response = await axios.post("/api/generate-report", {
        s3_url: reportURL,
      });
      const jsonString = JSON.stringify(response.data);
      setResponse(jsonString);
      setReport(jsonString);
      return jsonString; // Return the JSON as a string
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Report generation failed!");
      return null;
    } finally {
      setLoading(false);
    }
  };

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



        

  const [audioUploadedRows, setAudioUploadedRows] = useState({});

  // Toggle the dialog for a specific row
  const toggleDialog = (index) => {
    setOpenRows((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle only for the clicked row
    }));
  };

  // Toggle audioUploaded for a specific row
  const handleAudioUploadRow = (index) => {
    setAudioUploadedRows((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle only for the clicked row
    }));
  };

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div>
          <div className="min-h-screen bg-gray-50 p-4">
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
                    className="text-lg  underline font-medium hover:text-blue-600"
                  >
                    Recordings
                  </a>
                  <a
                    href="#reports"
                    className="text-lg font-medium hover:text-blue-600"
                  >
                    Reports
                  </a>
                </nav>
              </header>
              {/* Uploading data  */}
              <div className="p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Speech Assessment Report</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                  {uploading ? (
                    <Button onClick={() => uploadToStudentTables()}>
                      Submit Your Details
                    </Button>
                  ) : (
                    <div className="flex gap gap-2">
                      <Button
                        onClick={() => window.location.reload()}
                        className=""
                        variant="outline"
                      >
                        <RefreshCw /> Reload
                      </Button>
                      <DialogTrigger>
                        <Button
                          onClick={() => {
                            {
                              setOpen(true);
                            }
                            setUploading(false);
                          }}
                        >
                          Upload the details and Audio
                        </Button>
                      </DialogTrigger>
                    </div>
                  )}

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload the Details</DialogTitle>
                      <DialogDescription>
                        {/* User Inputs */}
                        <div className="mt-4">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                          />
                          <input
                            type="text"
                            placeholder="Story Name"
                            value={storyName}
                            onChange={(e) => setStoryName(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                          />
                        </div>

                        {/* File Upload Section */}
                        <div className="mt-4">
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                          />
                          <button
                            onClick={uploadToS3}
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded ml-2 disabled:opacity-50"
                          >
                            {loading ? "Uploading..." : "Upload Audio File"}
                          </button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

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
                        <Td className="py-3 px-6 text-left border border-gray-600">
                          {report.StudentName}
                        </Td>
                        <Td className="py-3 px-6 text-left border border-gray-600 ">
                          {report.Story}
                        </Td>
                        <Td className="py-3 px-4 text-left border border-gray-600">
                          <div className="flex w-30 items-center justify-center align-center">
                            {!audioUploadedRows[index] ? (
                              <div>
                                <p>Audio Uploaded</p>
                                <Button
                                  onClick={() => handleAudioUploadRow(index)}
                                  variant="download"
                                >
                                  Upload New
                                </Button>
                              </div>
                            ) : (
                              <p>
                                <div>
                                  <p>Upload now</p>
                                  <Dialog
                                    open={openRows[index] || false}
                                    onOpenChange={() => toggleDialog(index)}
                                  >
                                    {uploading ? (
                                      <Button
                                        onClick={() => uploadToStudentTables()}
                                      >
                                        Submit Your Details
                                      </Button>
                                    ) : (
                                      <div className="flex gap gap-2">
                                        <DialogTrigger>
                                          <Button
                                            onClick={() => {
                                              {
                                                setOpen(true);
                                              }
                                              setUploading(false);
                                            }}
                                          >
                                            Upload New
                                          </Button>
                                        </DialogTrigger>
                                      </div>
                                    )}

                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Upload the Details
                                        </DialogTitle>
                                        <DialogDescription>
                                          {/* User Inputs */}
                                          <div className="mt-4">
                                            <input
                                              type="text"
                                              placeholder="Your Name"
                                              value={userName}
                                              onChange={(e) =>
                                                setUserName(e.target.value)
                                              }
                                              className="border p-2 rounded mb-2 w-full"
                                            />
                                            <input
                                              type="text"
                                              placeholder="Story Name"
                                              value={storyName}
                                              onChange={(e) =>
                                                setStoryName(e.target.value)
                                              }
                                              className="border p-2 rounded mb-2 w-full"
                                            />
                                          </div>

                                          {/* File Upload Section */}
                                          <div className="mt-4">
                                            <input
                                              type="file"
                                              accept="audio/*"
                                              onChange={handleFileChange}
                                            />
                                            <button
                                              onClick={uploadToS3}
                                              disabled={loading}
                                              className="bg-blue-500 text-white px-4 py-2 rounded ml-2 disabled:opacity-50"
                                            >
                                              {loading
                                                ? "Uploading..."
                                                : "Upload Audio File"}
                                            </button>
                                          </div>
                                        </DialogDescription>
                                      </DialogHeader>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </p>
                            )}
                          </div>
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

export default HomeTable;
