import axiosInstance from '../api/auth.interceptor';

export const uploadToS3 = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file); 
  const token = localStorage.getItem('token'); //going to manually attach token, seem to randomly fall off
  try {
    const response = await axiosInstance.post("/upload/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
    });

    return response.data.url; 
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error(error.response?.data?.message || "Upload failed");
  }
};