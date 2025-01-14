import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function saveFile(file: File, oldUrl?: string): Promise<string> {
  if (oldUrl) {
    const publicId = oldUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'business_settings' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    file.arrayBuffer().then(buffer => {
      uploadStream.write(Buffer.from(buffer));
      uploadStream.end();
    });
  });

  return (result as any).secure_url;
}

export default cloudinary;