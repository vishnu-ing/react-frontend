import React, { useEffect, useState } from 'react';
import { fetchVisaDocs, uploadVisaDocument } from '../api/axiosCustom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const DOC_ORDER = [
  { key: 'OPT Receipt', label: 'OPT Receipt' },
  { key: 'EAD Card', label: 'OPT EAD' },
  { key: 'I-983', label: 'I-983' },
  { key: 'I-20', label: 'I-20' },
];

const statusColor = (status) => {
  if (status === 'Approved') return 'success';
  if (status === 'Pending') return 'warning';
  if (status === 'Rejected') return 'error';
  return 'default';
};

const VisaStatus = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchVisaDocs();
      setDocs(res.data.reverse());
    } catch (err) {
      console.error(err);
      setError('Failed to load visa documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const findDoc = (type) => docs.find(d => d.type === type);

  const canUpload = (index) => {
    if (typeof index !== 'number' || index < 0 || index >= DOC_ORDER.length) return false;
    const current = findDoc(DOC_ORDER[index].key);
    if (index === 0) {
      return !(current && current.status === 'Approved');
    }
    if (current && current.status === 'Approved') return false;
    const prev = findDoc(DOC_ORDER[index - 1].key);
    return !!prev && prev.status === 'Approved';
  };


  const handleFile = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor(type);
    setError('');
    try {
      await uploadVisaDocument(file, type);
      await load();
    } catch (err) {
      console.error(err);
      setError('Upload failed');
    } finally {
      setUploadingFor(null);
    }
  };

  const renderMessage = (doc, index) => {
    if (!doc) {
      if (index === 0) return 'Please upload your OPT Receipt.';
      return 'Not uploaded yet.';
    }

    if (doc.status === 'Pending') {
      if (doc.type === 'OPT Receipt') return 'Waiting for HR to approve your OPT Receipt';
      if (doc.type === 'EAD Card') return 'Waiting for HR to approve your OPT EAD';
      if (doc.type === 'I-983') return 'Waiting for HR to approve and sign your I-983';
      if (doc.type === 'I-20') return 'Waiting for HR to approve your I-20';
    }

    if (doc.status === 'Approved') {
      if (doc.type === 'OPT Receipt') return 'Please upload a copy of your OPT EAD';
      if (doc.type === 'EAD Card') return 'Please download and fill out the I-983 form';
      if (doc.type === 'I-983') return 'Please send the I-983 to your school and upload the new I-20';
      if (doc.type === 'I-20') return 'All documents have been approved';
    }

    if (doc.status === 'Rejected') {
      return `Rejected by HR: ${doc.feedback || 'No feedback provided'}`;
    }

    return '';
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1">Visa Status Management</Typography>
        <Typography color="text.secondary">Manage work authorization documents (OPT flow). Upload documents one at a time — HR must approve each before you can proceed.</Typography>
      </Stack>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      <Grid container spacing={3}>
        {DOC_ORDER.map((d, idx) => {
          const doc = findDoc(d.key);
          return (
            <Grid item xs={12} key={d.key}>
              <Card>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="h6">{d.label}</Typography>
                          {doc && <Chip label={doc.status} color={statusColor(doc.status)} size="small" />}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">{renderMessage(doc, idx)}</Typography>
                        {doc && doc.fileUrl && (
                          <Button size="small" startIcon={<DownloadIcon />} href={doc.fileUrl} target="_blank" rel="noreferrer">View uploaded document</Button>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
                        {d.key === 'I-983' && (
                          <Stack direction="row" spacing={1}>
                            <Button size="small" startIcon={<DownloadIcon />} href="/assets/i983-empty.pdf" download>Empty</Button>
                            <Button size="small" startIcon={<DownloadIcon />} href="/assets/i983-sample.pdf" download>Sample</Button>
                          </Stack>
                        )}

                        <div>
                          <input
                            id={`file-${d.key}`}
                            type="file"
                            accept="application/pdf,image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFile(e, d.key)}
                            disabled={!canUpload(idx) || !!uploadingFor}
                          />
                          <label htmlFor={`file-${d.key}`}>
                            <Button
                              variant="contained"
                              component="span"
                              startIcon={<UploadFileIcon />}
                              disabled={!canUpload(idx) || !!uploadingFor}
                            >
                              {uploadingFor === d.key ? 'Uploading...' : 'Upload'}
                            </Button>
                          </label>
                        </div>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }} />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default VisaStatus;
