 
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';


const streamUpload = (buffer, folder, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: mimetype.startsWith('video') ? 'video' : 'image',
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

export default streamUpload;
