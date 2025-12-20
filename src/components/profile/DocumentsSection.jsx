import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";

export default function DocumentsSection({ data }) {
  return (
    <>
      <Typography variant="h6"  sx= {{color:'black'}}>Documents</Typography>
      <List dense>
        {data.map((d, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={d.type} secondary={d.fileName} />
            <Button component="a" href={d.fileName} target="_blank">
              Preview
            </Button>
            <Button component="a" href={d.fileName} download>
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
}

