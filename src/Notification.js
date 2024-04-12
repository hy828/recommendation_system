import * as React from 'react';
import { CssBaseline, Box, Paper, Typography, Stack, Button, ListItem, ListItemButton, ListItemText } from '@mui/material';
import NavigationBar from './NavigationBar';
import { FixedSizeList } from 'react-window';

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function Notification() {
  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ mx: 15, pt: 15 }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 550,
          }}>
            <Stack direction='row'>
              <Stack fullwidth sx={{ width: '30%' }}>
                <Button>提醒</Button>
                <Button>完</Button>
              </Stack>
              <FixedSizeList
                fullwidth
                sx={{ width: '70%' }}
                height={550}
                itemSize={46}
                itemCount={200}
                overscanCount={5}
              >
                {renderRow}
              </FixedSizeList>
            </Stack>
        </Paper>
      </Box>
    </Box>
  )
}