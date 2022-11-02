import { v2 as cloudinary } from 'cloudinary';
const config = () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config(config());
export const uploadImage = async (image: string) => {
  try {
    const result = await cloudinary.uploader.upload(image);
    return result?.url || '';
  } catch (error) {
    return '';
  }
};
