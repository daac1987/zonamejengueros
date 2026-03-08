import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { file } = await req.json();

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // Subida a Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'zona_mejengueros', // Organiza tus fotos en una carpeta
      resource_type: 'auto',
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error: any) {
    console.error("Error en Cloudinary:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}