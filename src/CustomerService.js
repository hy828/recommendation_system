import * as React from 'react';
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, Button, Box, CssBaseline, InputBase, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';

const defaultTheme = createTheme();

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  // padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
          width: '20ch',
      },
    },
  },
}));

const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    '16 Mar, 2019',
    'Elvis Presley',
    'Tupelo, MS',
    'VISA ⠀•••• 3719',
    312.44,
  ),
  createData(
    1,
    '16 Mar, 2019',
    'Paul McCartney',
    'London, UK',
    'VISA ⠀•••• 2574',
    866.99,
  ),
  createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
  createData(
    3,
    '16 Mar, 2019',
    'Michael Jackson',
    'Gary, IN',
    'AMEX ⠀•••• 2000',
    654.39,
  ),
  createData(
    4,
    '15 Mar, 2019',
    'Bruce Springsteen',
    'Long Branch, NJ',
    'VISA ⠀•••• 5919',
    212.79,
  ),
];

function RecordDialog({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>添加跟进记录</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="date"
              name="date"
              label="日期"
              type="date"
              fullWidth
              variant="standard"
              defaultValue={formattedDate}
            />
          </Grid>
          <Grid xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="customerName"
              name="customerName"
              label="客户名称"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="username"
              name="username"
              label="负责人"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="item"
              name="item"
              label="事项"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="content"
              name="content"
              label="内容"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="result"
              name="result"
              label="结果"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button type="submit">完成</Button>
      </DialogActions>
    </Dialog>
  );
}

function ReminderDialog({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>添加待办事项</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="date"
              name="date"
              label="日期"
              type="date"
              fullWidth
              variant="standard"
              defaultValue={formattedDate}
            />
          </Grid>
          <Grid xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="customerName"
              name="customerName"
              label="客户名称"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="username"
              name="username"
              label="负责人"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="item"
              name="item"
              label="事项"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="content"
              name="content"
              label="内容"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="result"
              name="result"
              label="结果"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button type="submit">完成</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function CustomerManagement() {
  const [openRecordDialog, setOpenRecordDialog] = React.useState(false);
  const [openReminderDialog, setOpenReminderDialog] = React.useState(false);

  const handleOpenRecordDialog = () => {
    setOpenRecordDialog(true);
  };

  const handleCloseRecordDialog = () => {
    setOpenRecordDialog(false);
  };

  const handleOpenReminderDialog = () => {
    setOpenReminderDialog(true);
  };

  const handleCloseReminderDialog = () => {
    setOpenReminderDialog(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ mt: 2, padding: 1 }}>
        <CssBaseline />
        <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
          客户服务
        </Typography>
        <Stack direction="row" sx={{ flexGrow: 1, mb: 5 }}>
          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box>
            <Button variant="contained" sx={{ mr: 3 }} onClick={handleOpenRecordDialog}>添加记录</Button>
            <Button variant="contained" onClick={handleOpenReminderDialog}>添加待办事项</Button>
            <RecordDialog open={openRecordDialog} handleClose={handleCloseRecordDialog} />
            <ReminderDialog open={openReminderDialog} handleClose={handleCloseReminderDialog} />
          </Box>
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell>客户名称</TableCell>
              <TableCell>负责人</TableCell>
              <TableCell>事项</TableCell>
              <TableCell>内容</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.shipTo}</TableCell>
                <TableCell>{row.paymentMethod}</TableCell>
                <TableCell>{`$${row.amount}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </ThemeProvider>
  );
}