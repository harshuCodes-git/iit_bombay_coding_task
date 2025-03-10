import client from "@/lib/dynamodb";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const {
    StudentName,
    Story,
    audioFile,
    apiCallTime,
    responseTime,
    reportURL,
  } = await request.json();

  // Debugging: Log all incoming data
  console.log("studentName:", StudentName );
  console.log("Story:", Story );
  console.log("audioFile:", audioFile);
  console.log("apiCallTime:", apiCallTime);
  console.log("responseTime:", responseTime);
  console.log("reportURL:", reportURL);

  // Check for missing fields
  if (!StudentName || !Story || !audioFile || !apiCallTime || !reportURL) {
    console.error("Missing required fields in request");
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const params = {
    TableName: process.env.NEXT_PUBLIC_STUDENT_TABLE,
    Item: {
      StudentName: { S: StudentName },
      Story: { S: Story },
      audioFile: { S: audioFile },
      apiCallTime: { S: apiCallTime },
      responseTime: { N: (responseTime ?? 0).toString() },
      reportURL: { S: reportURL },
    },
  };

  try {
    const command = new PutItemCommand(params);
    await client.send(command);
    return NextResponse.json(
      { message: "Report saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}
