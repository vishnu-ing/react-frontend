import axios from './auth.interceptor';

/**
 * Generic upload service that normalizes responses from backend upload endpoints.
 * Usage: upload(file, type, extra)
 * type: 'profile-picture' | 'driver-license' | 'visa' | custom
 */
async function doUpload(file, type = 'profile-picture', extra = {}) {
  if (!file) return null;

  const form = new FormData();
  form.append('file', file);
  Object.entries(extra || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });

  // map known types to endpoints
  let endpoint = '/upload';
  if (type === 'profile-picture') endpoint = '/upload/profile-picture';
  else if (type === 'driver-license') endpoint = '/upload/driver-license';
  else if (type === 'visa') endpoint = '/visa/upload';
  else endpoint = `/upload/${type}`;

  const resp = await axios.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const data = resp?.data || {};

  // Normalize common response shapes into { url, key, data }
  const url = data.url || data.fileUrl || data.path || null;
  const key = data.key || data.fileKey || null;

  return { url, key, data, resp };
}

const uploadService = {
  upload: (file, type, extra) => doUpload(file, type, extra),
  uploadProfilePicture: (file) => doUpload(file, 'profile-picture'),
  uploadDriverLicense: (file) => doUpload(file, 'driver-license'),
  uploadVisaDocument: (file, type, startDate = '', endDate = '') =>
    doUpload(file, 'visa', { type, startDate, endDate }),
};

export default uploadService;
