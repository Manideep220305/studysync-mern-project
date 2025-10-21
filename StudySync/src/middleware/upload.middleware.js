import multer from 'multer';

// We configure multer to store the uploaded file in memory.
// This is temporary storage before we send it to Cloudinary.
const storage = multer.memoryStorage();

// This is our multer middleware.
// .single('file') means it will look for a single file in the request
// under a field named "file".
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  },
});

export default upload;
