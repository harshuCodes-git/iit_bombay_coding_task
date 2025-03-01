"use client";
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FileDown } from "lucide-react";
import { TbReportSearch } from "react-icons/tb";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReadingReport from "@/components/ReadingReport";
import DetailReport from "./DetailReport";
import GeneratePDF from "./GeneratePDF";

const DownloadPDF = ({ solution }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reportRef = useRef(null); // Reference for capturing report

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

  // Toggle function to open/close the dialog
  const handleDialogToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to generate PDF with image watermark, header & footer
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    // Capture the content as an image
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    // Get current date & time
    const now = new Date();
    const formattedDateTime =
      now.toLocaleDateString() + " " + now.toLocaleTimeString();

    // Add Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);

    // Left-side text (Student Report)
    pdf.text(`Student Report - ${solution.StudentName}`, 15, 15);

    // Right-side text (Digital Audio Processing Task)
    pdf.text("Digital Audio Processing Task", 200, 15, { align: "right" });

    // Date and time below the report title
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${formattedDateTime}`, 15, 22);

    // Load watermark image
    const watermark = new Image();
    watermark.src = "./waterMarkLogo.png"; // Ensure the image is in the `public/` folder

    watermark.onload = () => {
      const watermarkWidth = 100; // Adjust as needed
      const watermarkHeight = 100; // Adjust as needed
      const centerX = (pdf.internal.pageSize.width - watermarkWidth) / 2;
      const centerY = (pdf.internal.pageSize.height - watermarkHeight) / 2;

      // Set transparency
      pdf.setGState(new pdf.GState({ opacity: 0.2 }));

      // Add the watermark
      pdf.addImage(
        watermark,
        "PNG",
        centerX,
        centerY,
        watermarkWidth,
        watermarkHeight
      );

      // Reset opacity
      pdf.setGState(new pdf.GState({ opacity: 1 }));

      // Add the captured content
      pdf.addImage(imgData, "PNG", 0, 30, imgWidth, imgHeight);

      // Add footer with page numbers
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFontSize(10);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(`Page ${i} of ${pageCount}`, 95, 290);
      }

      // Save the PDF after everything is added
      pdf.save(`Report_${solution.StudentName}.pdf`);
    };
  };

  return (
    <>
      <div className="  grid grid-cols-2 gap-3">
        <Button
          onClick={handleDialogToggle}
          className=" cursor-pointer underline"
          variant="outline"
        >
          <TbReportSearch width={30} height={30} /> View Report
        </Button>

        <GeneratePDF solution={solution} />
      </div>
      <div className="max-w-full">
        <Dialog open={isOpen} onOpenChange={setIsOpen} className="max-w-full">
          <DialogContent className="max-w-full sm:max-w-3xl lg:max-w-6xl w-full overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Reports of {solution.StudentName}</DialogTitle>
              <DialogDescription>Details of the report</DialogDescription>
            </DialogHeader>

            {/* Report Section (Capturing Full Content for PDF) */}
            <div ref={reportRef} className="p-4  space-y-6">
              <ReadingReport solution={solution} />
              <DetailReport solution={reportSolution} />
            </div>

            {/* Buttons: PDF Download & Close */}
            <div className="flex justify-between mt-4">
              <Button
                onClick={downloadPDF}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Download PDF
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default DownloadPDF;
