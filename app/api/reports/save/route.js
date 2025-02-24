import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import client from "@/lib/dynamodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const data = await req.json();

  // Generate a unique ID for the report
  const reportId = uuidv4();

  const params = {
    TableName: process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME,
    Item: {
      id: { S: reportId },
      audio_type: { S: data.audio_type },
      wcpm: { N: data.wcpm.toString() },
      pron_score: { N: data.pron_score.toString() },
      speech_rate: { N: data.speech_rate.toString() },
      no_corr: { N: data.no_corr.toString() },
      no_miscue: { N: data.no_miscue.toString() },
      percent_attempt: { N: data.percent_attempt.toString() },
      ins_details: { S: data.ins_details || "None" },
      decoded_text: { S: data.decoded_text },
      createdAt: { N: Date.now().toString() },
    },
  };

  try {
    await client.send(new PutItemCommand(params));
    return new Response(
      JSON.stringify({ message: "Report saved successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error saving report:", error);
    return new Response(JSON.stringify({ message: "Error saving report" }), {
      status: 500,
    });
  }
}
