import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const { file, fileName } = formData;

    if (!file) {
      return NextResponse.json({ error: "No hay archivo" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // 1. LIMPIEZA DEL NOMBRE DEL ARCHIVO
    // Quitamos espacios, acentos y caracteres extraños
    const cleanFileName = fileName
      .toLowerCase()
      .normalize("NFD")               // Descompone caracteres con acentos
      .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
      .replace(/\s+/g, "-")            // Cambia espacios por guiones
      .replace(/[^a-z0-0.\-]/g, "");   // Quita todo lo que no sea letra, número o punto

    // 2. Nombre único
    const uniqueName = `${Date.now()}-${cleanFileName}`;
    const filePath = path.join(uploadDir, uniqueName);

    // 3. Convertir y guardar
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), "base64");
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      url: `/uploads/${uniqueName}` 
    });
  } catch (error) {
    console.error("Error al subir:", error);
    return NextResponse.json({ error: "Error al guardar imagen" }, { status: 500 });
  }
}