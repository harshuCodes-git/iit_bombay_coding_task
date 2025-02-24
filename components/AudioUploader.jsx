"use client"
import { useState } from "react";
import axios from "axios";

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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

  const generateReport = async () => {
    if (!fileUrl) {
      alert("No uploaded file URL found!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/generate-report", {
        s3_url: fileUrl,
      });
      setReport(response.data);
      alert("Report generated successfully!");
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Report generation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={uploadToS3} disabled={loading}>
        {loading ? "Uploading..." : "Upload Audio"}
      </button>

      {fileUrl && (
        <>
          <p>
            Uploaded File:{" "}
            <a href={fileUrl} target="_blank">
              {fileUrl}
            </a>
          </p>
          <audio controls>
            <source src={fileUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <button onClick={generateReport} disabled={loading}>
            {loading ? "Generating Report..." : "Generate Report"}
          </button>
        </>
      )}

      {report && (
        <div>
          <h2>Reading Report</h2>
          <p>
            <strong>Decoded Text:</strong> {report.decoded_text}
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
