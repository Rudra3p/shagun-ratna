// import r2 from "@/lib/r2";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { fileName, fileType } = await req.json();

//     // 1. Define the unique path (Key) where the file will live in R2
//     const fileKey = `uploads/${Date.now()}-${fileName}`;

//     // 2. Prepare the command
//     const command = new PutObjectCommand({
//       Bucket: process.env.R2_BUCKET_NAME,
//       Key: fileKey,
//       ContentType: fileType,
//     });

//     // 3. Generate the secure, temporary upload link
//     const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

//     // 4. Send the URL and the final intended Key back to the client
//     return NextResponse.json({ 
//       signedUrl, 
//       fileKey 
//     });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
//   }
// }