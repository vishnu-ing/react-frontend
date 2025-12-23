import { IconButton, Tooltip, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

const DocumentRow = ({ label, value, defaultName }) => {
    if (!value) return <Typography variant="body2"><b>{label}:</b> Not Uploaded</Typography>;

    //url and file name, will change to s3 server later
    const isLocalFile = value instanceof File;
    const fileUrl = isLocalFile ? URL.createObjectURL(value) : `http://localhost:5000/${value}`;
    const fileName = isLocalFile ? value.name : value.split('\\').pop().split('/').pop();

    //preview, opens in tab
    const handlePreview = () => {
        window.open(fileUrl, '_blank'); 
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', fileName || defaultName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 150 }}>
                <b>{label}:</b> {fileName.length > 20 ? `${fileName.substring(0, 20)}...` : fileName}
            </Typography>
            
            <Tooltip title="Preview">
                <IconButton onClick={handlePreview} size="small" color="primary">
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Download">
                <IconButton onClick={handleDownload} size="small" color="secondary">
                    <DownloadIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
};

export default DocumentRow;