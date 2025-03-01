import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { s3_url } = await req.json();

    if (!s3_url) {
      return NextResponse.json({ error: "Missing S3 URL" }, { status: 400 });
    }

    console.log("🔹 Original S3 URL:", s3_url);

    // Convert the bucket-style URL to path-style
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET; // Ensure this is set in .env.local
    const region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-south-1";

    const newS3Url = s3_url.replace(
      `https://${bucketName}.s3.${region}.amazonaws.com/`,
      `https://s3.${region}.amazonaws.com/${bucketName}/`
    );

    console.log("✅ Converted S3 URL:", newS3Url);

    const apiUrl =
      "https://505a4vjhyk.execute-api.ap-south-1.amazonaws.com/prod/scoring";
    const apiKey = process.env.NEXT_PUBLIC_PROVIDED_API_KEY;

    const response = await axios.post(
      apiUrl,
      {
        s3_url: newS3Url,
        reference_text_id: "EN-OL-RC-247-1",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": apiKey,
        },
      }
    );

    console.log("✅ SAS API Response:", response.data);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("❌ SAS API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}

