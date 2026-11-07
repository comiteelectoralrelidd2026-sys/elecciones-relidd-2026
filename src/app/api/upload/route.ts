import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'elecciones-relidd';

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'h1qllazn';
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '477839454574998';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'sZS6_a5V5CTwud3u6O7Hl9P6aLY';

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    const cFormData = new FormData();
    cFormData.append('file', file);
    cFormData.append('api_key', apiKey);
    cFormData.append('timestamp', timestamp.toString());
    cFormData.append('folder', folder);
    cFormData.append('signature', signature);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: cFormData
    });

    if (!uploadRes.ok) {
      const errData = await uploadRes.json();
      return NextResponse.json({ error: errData.error?.message || 'Error al subir a Cloudinary' }, { status: 500 });
    }

    const data = await uploadRes.json();
    return NextResponse.json({
      url: data.secure_url || data.url,
      public_id: data.public_id,
      format: data.format,
      bytes: data.bytes
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error en el servidor' }, { status: 500 });
  }
}
