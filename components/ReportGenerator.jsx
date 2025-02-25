"use client";

import { useState } from "react";
import axios from "axios";
import { useUUID } from "@/app/context/UUIDContext";

export default function ReportGenerator() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [storyName, setStoryName] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const {uuid}=useUUID();

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
    }
  };

  // Generate Report from SAS API
  const generateReport = async () => {
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
      const response = await axios.post("/api/generate-report", {
        s3_url: fileUrl,
      });
      setReport(response.data);

      // Calculate time taken and call time
      const endTime = new Date();
      const duration = (endTime - callTime) / 1000;
      setTimeTaken(duration);

      // Ensure callTime is not null before using toISOString()
      await axios.post("/api/studentlog/save", {
        ...response.data,
        id: uuid,
        StudentName: userName,
        Story: storyName,
        audioFile: fileUrl,
        apiCallTime: callTime.toISOString(), // Use toISOString() for consistent date format
        responseTime: duration, // Pass as a number
        reportURL: fileUrl,
      });
      alert("Report generated and saved successfully!");
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Report generation failed!");
    } finally {
      setLoading(false);
    }
  };

  // Function to display decoded text with color coding
  const renderDecodedText = (decodedText, wordScores) => {
    const scoreMap = {};
    wordScores.forEach(([word, score]) => {
      scoreMap[word.toLowerCase()] = score;
    });

    const words = decodedText.split(" ");
    return words.map((word, index) => {
      const score = scoreMap[word.toLowerCase()] || 0;
      let className = "";

      if (score === 1) {
        className = "text-green-600";
      } else if (score >= 0.6) {
        className = "text-orange-500";
      } else {
        className = "text-red-600 line-through";
      }

      return (
        <span key={index} className={`${className} mx-1`}>
          {word}
        </span>
      );
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Speech Assessment Report</h1>

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
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button
          onClick={uploadToS3}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Audio"}
        </button>
      </div>

      {/* Display Uploaded Audio */}
      {fileUrl && (
        <div className="mt-4">
          <p className="text-green-600">
            File Uploaded:{" "}
            <a href={fileUrl} target="_blank" className="underline">
              {fileUrl}
            </a>
          </p>
          <audio controls className="mt-2">
            <source src={fileUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
          >
            {loading ? "Generating Report..." : "Generate Report"}
          </button>
        </div>
      )}

      {/* Display Report */}
      {report && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-lg font-bold mb-2">Reading Report</h2>
          <p>
            <strong>Audio Type:</strong> {report.audio_type}
          </p>
          <p>
            <strong>Words Correct Per Minute (WCPM):</strong> {report.wcpm}
          </p>
          <p>
            <strong>Pronunciation Score:</strong> {report.pron_score}
          </p>
          <p>
            <strong>Speech Rate:</strong> {report.speech_rate}
          </p>
          <p>
            <strong>Correct Words:</strong> {report.no_corr}
          </p>
          <p>
            <strong>Miscues:</strong> {report.no_miscue}
          </p>
          <p>
            <strong>Percent Attempted:</strong> {report.percent_attempt}%
          </p>
        </div>
      )}
    </div>
  );
}
