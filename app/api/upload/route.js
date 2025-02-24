import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `uploads/${Date.now()}-${file.name}`;

    // Upload file to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type || "audio/mpeg",
      })
    );

    // Generate Pre-Signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour

    console.log("✅ Pre-Signed URL:", signedUrl);

    return NextResponse.json({ url: signedUrl }, { status: 200 });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
