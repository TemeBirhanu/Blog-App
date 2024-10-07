import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier'; // For handling the file stream for cloudinary uploads

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage to avoid storing files on the local filesystem
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary file upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
    if (error) {
      console.log('Error uploading to Cloudinary:', error);
      return res.status(500).json({ message: 'Cloudinary upload failed' });
    }
    return res.status(200).json({ url: result.secure_url });
  });
  streamifier.createReadStream(file.buffer).pipe(uploadStream);
});

// Other API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Start the server
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
