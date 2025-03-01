"use client";
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FileDown } from "lucide-react";
import { TbReportSearch } from "react-icons/tb";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReadingReport from "@/components/ReadingReport";
import DetailReport from "./DetailReport";

const GeneratePDF = ({ solution }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reportRef = useRef(null);

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

  if (!reportSolution) {
    return <p>No report data available.</p>;
  }

  const handleDownloadClick = () => {
    setIsOpen(true);

    setTimeout(() => {
      setIsOpen(false);
      downloadPDF();
    }, 10); // Close the dialog after 1 second and trigger PDF download
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(`Student Report - ${solution.StudentName}`, 15, 15);
    pdf.text("Digital Audio Processing Task", 200, 15, { align: "right" });

    const now = new Date();
    pdf.setFontSize(10);
    pdf.text(
      `Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
      15,
      22
    );

    pdf.addImage(imgData, "PNG", 0, 30, imgWidth, imgHeight);

    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${pageCount}`, 95, 290);
    }

    pdf.save(`Report_${solution.StudentName}.pdf`);
  };

  return (
    <>
      <div className="">
        <Button
          onClick={handleDownloadClick}
          className="cursor-pointer underline"
          variant="download"
        >
          <FileDown />  Download PDF
        </Button>
      </div>
      <div className="max-w-full">
        <Dialog open={isOpen} className="max-w-full">
          <DialogContent className="max-w-full sm:max-w-3xl lg:max-w-6xl w-full overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Reports of {solution.StudentName}</DialogTitle>
              <DialogDescription>Details of the report</DialogDescription>
            </DialogHeader>

            <div ref={reportRef} className="p-4 space-y-6">
              <ReadingReport solution={solution} />
              <DetailReport solution={reportSolution} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default GeneratePDF;
