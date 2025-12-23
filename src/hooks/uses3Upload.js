import { useState } from 'react';
import { uploadToS3 } from '../utils/uploadHelper'; 

export const useS3Upload = (formOnChange) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (file) => {
        if (!file) return;
        
        setIsUploading(true);
        try {
            const s3Url = await uploadToS3(file);
            formOnChange(s3Url); 
        } catch (err) {
            console.error("Upload Error:", err);
            alert("Failed to upload file to S3.");
        } finally {
            setIsUploading(false);
        }
    };

    return { handleUpload, isUploading };
};