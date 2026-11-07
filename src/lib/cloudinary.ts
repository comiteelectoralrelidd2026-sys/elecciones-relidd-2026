export async function uploadToCloudinaryClient(file: File, folder: string = 'elecciones-relidd'): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'h1qllazn';
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '477839454574998';
  const apiSecret = 'sZS6_a5V5CTwud3u6O7Hl9P6aLY';

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

  // Use browser native Web Crypto API for SHA-1
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureStr);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folder);
  formData.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error?.message || 'Error al subir a Cloudinary');
  }

  const result = await res.json();
  return result.secure_url || result.url;
}
