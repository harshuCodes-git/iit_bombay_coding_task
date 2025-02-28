"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportPage({ params }) {
  const { id } = params;
  const [mainReport, setMainReport] = useState(null);

  useEffect(() => {
    // Fetch the report by ID
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/studentlog/get`);
        const data = await res.json();
        const report = data.find((item) => item.id === id);

        if (report) {
          setMainReport(report.mainReport);
        } else {
          console.error("Report not found");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Report for ID: {id}</h1>
      {mainReport ? (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(mainReport, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
