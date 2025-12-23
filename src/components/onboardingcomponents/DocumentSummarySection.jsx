import { Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

const DocumentSummarySection = () => {
    const { watch } = useFormContext();
    const profilePic = watch("profilePicture"); 
    const optReceipt = watch("optReceipt");
    const driverLicense = watch("driverLicense");
    //temp for now might not need when aws server is up
    const handleDownload = async (e, fileUrl, fileName) => {
        e.preventDefault();
        
        try {
            if (fileUrl.startsWith('blob:')) {
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
            }
            const response = await fetch(fileUrl);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName; // This forces the name we want
                document.body.appendChild(link);
                link.click();
                
                // Cleanup
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error("Download failed:", error);
                // Fallback: just open the tab if fetch fails
                window.open(fileUrl, '_blank');
            }
    }

    const getFileName = (file) => {
        if (!file) return null;
        if (file instanceof File) return file.name;
        if (typeof file === 'object') {
            if (file.fileName || file.originalName) return file.fileName || file.originalName;
            if (file.fileUrl || file.path) return extractNameFromUrl(file.fileUrl || file.path);
        }

        if (typeof file === 'string') {
            return extractNameFromUrl(file);
        }

        return "Document Uploaded";
    };

    const extractNameFromUrl = (url) => {
        if (!url) return "";
        //split by / or \ and take the last part
        return url.split(/[/\\]/).pop(); 
    };

    //Generate a preview URL
    const getFileUrl = (file) => {
        if (!file) return "";
        if (file instanceof File) return URL.createObjectURL(file);
        let url = "";
        if (typeof file === 'string') url = file;
        else if (file?.fileUrl) url = file.fileUrl;
        else if (file?.path) url = file.path;
        else if (file?.url) url = file.url;

        //change this for aws server
        if (url && !url.startsWith('http') && !url.startsWith('blob')) {
            return `http://localhost:5000/${url}`; 
        }
        return url;
    };

    const SummaryRow = ({ label, file }) => {
        const fileName = getFileName(file);
        const fileUrl = getFileUrl(file);
        const hasFile = !!fileName;

        return (
            <Stack 
                direction="row" 
                alignItems="center" 
                spacing={2} 
                sx={{ 
                    p: 2, 
                    bgcolor: 'white', 
                    borderRadius: 1, 
                    border: '1px solid #e0e0e0' 
                }}
            >
                <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 140 }}>
                    {label}:
                </Typography>
                
                <Typography 
                    variant="body2" 
                    sx={{ 
                        flexGrow: 1, 
                        fontStyle: hasFile ? 'normal' : 'italic', 
                        color: hasFile ? 'text.primary' : 'text.secondary',
                        wordBreak: 'break-all'
                    }}
                >
                    {fileName || "Not Uploaded"}
                </Typography>

                {hasFile && (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Preview">
                            <IconButton 
                                component="a" 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                color="primary"
                                size="small"
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Download">
                            <IconButton 
                                onClick={(e) => handleDownload(e, fileUrl, fileName)}
                                color="primary"
                                size="small"
                            >
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )}
            </Stack>
        );
    };

    return (
        <Stack spacing={2} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6">Document Summary</Typography>
            <Stack spacing={1}>
                <SummaryRow label="Profile Picture" file={profilePic} />
                <SummaryRow label="Work Auth Doc" file={optReceipt} />
                <SummaryRow label="Driver's License" file={driverLicense} />
            </Stack>
        </Stack>
    );
};

export default DocumentSummarySection;