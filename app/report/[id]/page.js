import axios from "axios";

async function getReportData(id) {
  // Use Absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Fetch reports
  const res = await axios.get(`${baseUrl}/api/reports/get`);

  // Find the report by ID
  return res.data.find((report) => report.id === id);
}

export default async function ReportPage({ params }) {
  // Await params to avoid sync error
  const { id } = await params;
  const report = await getReportData(id);

  if (!report) {
    return <div>Report not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Report Details</h1>
      <div className="mt-4 p-4 bg-white rounded-md shadow-md">
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
        <p className="mt-4">
          <strong>Decoded Text:</strong> {report.decoded_text}
        </p>
      </div>
    </div>
  );
}
