import { ScanCommand } from "@aws-sdk/client-dynamodb";
import client from "@/lib/dynamodb";

export async function GET() {
  const params = {
    TableName: process.env.NEXT_PUBLIC_STUDENT_TABLE,
  };

  try {
    const data = await client.send(new ScanCommand(params));
    const reports = data.Items.map((item) => ({
      StudentName: item.StudentName.S,
      Story: item.Story.S,
      audioFile: item.audioFile.S,
      apiCallTime: item.apiCallTime.S,
      responseTime: Number(item.responseTime.N),
      reportURL: item.reportURL.S,
      mainReport: item.mainReport?.S ? JSON.parse(item.mainReport.S) : null,
    }));
    return new Response(JSON.stringify(reports), { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return new Response(JSON.stringify({ message: "Error fetching reports" }), {
      status: 500,
    });
  }
}
