"use client";
import React, { useState } from "react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import ReadingReport from "@/components/ReadingReport";
import DetailReport from "./DetailReport";

const SolutionDisplay = ({ solution }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reportSolution = solution.mainReport;

  if (!reportSolution) {
    return <p>No report data available.</p>;
  }

  // Toggle function to open/close the dialog
  const handleDialogToggle = () => {
    setIsOpen((prev) => !prev);
  };


  return (
    <>
      <p
        onClick={handleDialogToggle}
        className="text-blue-700 cursor-pointer underline"
      >
        View Report
      </p>
      <div className="max-w-full ">
        <Dialog open={isOpen} onOpenChange={setIsOpen} className="max-w-full">
          <DialogContent className="max-w-full sm:max-w-3xl lg:max-w-6xl w-full overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Reports of {solution.StudentName}</DialogTitle>
              <DialogDescription>Details of the report</DialogDescription>
            </DialogHeader>

            {/* Carousel Setup */}
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <ReadingReport
                    solution={solution}
                  />
                </CarouselItem>
                <CarouselItem>
                  <DetailReport solution={reportSolution} />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="bg-green-400 border " />
              <CarouselNext className="bg-green-400  border " />
            </Carousel>

            {/* Updated Button Position and Functionality */}
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => {
                  const nextButton = document.querySelector(
                    ".carousel-next-button"
                  );
                  nextButton?.click(); // Trigger the next carousel item
                }}
              >
                More Detail
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* <div className="p-4 bg-white rounded-lg shadow-md mt-4 max-w-full overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Report Details</h2>
        <ul className="space-y-2 text-sm sm:text-base">
          <li>
            <strong>File ID:</strong> {solution.file_id ?? "N/A"}
          </li>
          <li>
            <strong>Audio Type:</strong> {solution.audio_type ?? "N/A"}
          </li>
          <li>
            <strong>Decoded Text:</strong> {solution.decoded_text ?? "N/A"}
          </li>
          <li>
            <strong>Number of Words:</strong> {solution.no_words ?? "N/A"}
          </li>
          <li>
            <strong>Number of Deletions:</strong> {solution.no_del ?? "N/A"}
          </li>
          <li>
            <strong>Number of Insertions:</strong> {solution.no_ins ?? "N/A"}
          </li>
          <li>
            <strong>Number of Substitutions:</strong>{" "}
            {solution.no_subs ?? "N/A"}
          </li>
          <li>
            <strong>Number of Miscues:</strong> {solution.no_miscue ?? "N/A"}
          </li>
          <li>
            <strong>Number of Corrections:</strong> {solution.no_corr ?? "N/A"}
          </li>
          <li>
            <strong>Words Correct Per Minute (WCPM):</strong>{" "}
            {solution.wcpm ?? "N/A"}
          </li>
          <li>
            <strong>Speech Rate:</strong> {solution.speech_rate ?? "N/A"}
          </li>
          <li>
            <strong>Pronunciation Score:</strong> {solution.pron_score ?? "N/A"}
          </li>
          <li>
            <strong>Comprehension Score:</strong>{" "}
            {solution.compr_score ?? "N/A"}
          </li>
          <li>
            <strong>Percent Attempt:</strong>{" "}
            {solution.percent_attempt ? `${solution.percent_attempt}%` : "N/A"}
          </li>
        </ul>
      </div> */}
    </>
  );
};

export default SolutionDisplay;
