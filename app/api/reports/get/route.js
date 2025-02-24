import { ScanCommand } from "@aws-sdk/client-dynamodb";
import client from "@/lib/dynamodb";

export async function GET() {
  const params = {
    TableName: process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME,
  };

  try {
    const data = await client.send(new ScanCommand(params));
    const reports = data.Items.map((item) => ({
      id: item.id.S,
      audio_type: item.audio_type.S,
      wcpm: Number(item.wcpm.N),
      pron_score: Number(item.pron_score.N),
      speech_rate: Number(item.speech_rate.N),
      no_corr: Number(item.no_corr.N),
      no_miscue: Number(item.no_miscue.N),
      percent_attempt: Number(item.percent_attempt.N),
      ins_details: item.ins_details.S,
      decoded_text: item.decoded_text.S,
      createdAt: new Date(Number(item.createdAt.N)).toLocaleString(),
    }));
    return new Response(JSON.stringify(reports), { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return new Response(JSON.stringify({ message: "Error fetching reports" }), {
      status: 500,
    });
  }
}
