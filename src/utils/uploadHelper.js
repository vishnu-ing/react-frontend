import uploadService from '../api/uploadService';

export const uploadToS3 = async (file) => {
  if (!file) return null;
  const result = await uploadService.uploadProfilePicture(file);
  return result?.url || null;
};

export default uploadToS3;