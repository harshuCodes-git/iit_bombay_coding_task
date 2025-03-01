"use client";
import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReadingReport from "@/components/ReadingReport";
import DetailReport from "./DetailReport";

const DownloadReport = ({ solution }) => {
  const reportRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  function cleanAndParseJson(jsonString) {
    try {
      const cleanedString = jsonString.replace(/\\/g, "");
      return JSON.parse(cleanedString);
    } catch (error) {
      console.error("Error decoding JSON:", error);
      return {};
    }
  }

  const reportSolution = solution?.mainReport
    ? cleanAndParseJson(solution.mainReport)
    : {};

  const watermarkBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAA..."; // Replace with actual Base64

  const downloadPDF = async () => {
    if (!reportRef.current) {
      console.error("Error: Report content not found.");
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const now = new Date();
      const formattedDateTime =
        now.toLocaleDateString() + " " + now.toLocaleTimeString();

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text(`Student Report - ${solution.StudentName}`, 15, 15);
      pdf.text("Digital Audio Processing Task", 200, 15, { align: "right" });

      pdf.setFontSize(10);
      pdf.text(`Generated on: ${formattedDateTime}`, 15, 22);

      pdf.setGState(new pdf.GState({ opacity: 0.2 }));
      pdf.addImage(watermarkBase64, "PNG", 60, 100, 90, 90);
      pdf.setGState(new pdf.GState({ opacity: 1 }));

      pdf.addImage(imgData, "PNG", 0, 30, imgWidth, imgHeight);

      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFontSize(10);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(`Page ${i} of ${pageCount}`, 95, 290);
      }

      pdf.save(`Report_${solution.StudentName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="text-center">


      <Button
        onClick={downloadPDF}
        disabled={isDownloading}
        className={`mt-4 ${
          isDownloading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FileDown className="mr-2" />{" "}
        {isDownloading ? "Downloading..." : "Download Report"}
      </Button>
    </div>
  );
};

export default DownloadReport;
