import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import DataVisualization from './DataVisualization';
import NavigationBar from './NavigationBar';
import CustomerService from './CustomerService';

const defaultTheme = createTheme();

export default function Home() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavigationBar />
      <Container>
        <DataVisualization />
        <CustomerService />
      </Container>
    </ThemeProvider>
  );
}