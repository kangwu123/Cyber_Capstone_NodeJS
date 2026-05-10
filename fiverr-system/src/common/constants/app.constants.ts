import 'dotenv/config';

export const PORT = process.env.PORT || 3069;
export const DATABASE_URL = process.env.DATABASE_URL || '';

export const FOLDER_IMAGE = "public/images";

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
