"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

export default function ReportsTable() {
  const [reports, seTreports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/reports/get");
        seTreports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleRowClick = (id) => {
    router.push(`/report/${id}`);
  };

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <Table className="min-w-full bg-white border border-gray-300">
        <Thead>
          <Tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <Th className="py-3 px-6 text-left">Student ID</Th>
            <Th className="py-3 px-6 text-left">Audio Type</Th>
            <Th className="py-3 px-6 text-center">WCPM</Th>
            <Th className="py-3 px-6 text-center">Pronunciation Score</Th>
            <Th className="py-3 px-6 text-center">Speech Rate</Th>
            <Th className="py-3 px-6 text-center">Correct Words</Th>
            <Th className="py-3 px-6 text-center">Miscues</Th>
            <Th className="py-3 px-6 text-center">Percent Attempted</Th>
            <Th className="py-3 px-6 text-center">Date</Th>
          </Tr>
        </Thead>
        <Tbody className="text-gray-700 text-sm font-light">
          {reports.map((report) => (
            <Tr
              key={report.id}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRowClick(report.id)}
            >
              <Td className="py-3 px-6 text-left">{report.id}</Td>
              <Td className="py-3 px-6 text-left">{report.audio_type}</Td>
              <Td className="py-3 px-6 text-center">{report.wcpm}</Td>
              <Td className="py-3 px-6 text-center">{report.pron_score}</Td>
              <Td className="py-3 px-6 text-center">{report.speech_rate}</Td>
              <Td className="py-3 px-6 text-center">{report.no_corr}</Td>
              <Td className="py-3 px-6 text-center">{report.no_miscue}</Td>
              <Td className="py-3 px-6 text-center">
                {report.percent_attempt}%
              </Td>
              <Td className="py-3 px-6 text-center">{report.createdAt}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
