import { ScanCommand } from "@aws-sdk/client-dynamodb";
import client from "@/lib/dynamodb";

export async function GET() {
  const params = {
    TableName: process.env.NEXT_PUBLIC_STUDENT_TABLE,
  };

  try {
    const data = await client.send(new ScanCommand(params));
    const reports = data.Items.map((item) => ({
      StudentName: { S: StudentName },
      Story: { S: Story },
      audioFile: { S: audioFile },
      apiCallTime: { S: apiCallTime },
      responseTime: { N: (responseTime ?? 0).toString() },
      reportURL: { S: reportURL },
    }));
    return new Response(JSON.stringify(reports), { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return new Response(JSON.stringify({ message: "Error fetching reports" }), {
      status: 500,
    });
  }
}
