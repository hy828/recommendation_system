import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ReactEcharts from "echarts-for-react";
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Container, Stack, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

export default function DataVisualization({ barChartOption, lineChartOption, productOptions, fetchData }) {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const rangeOptions = [
    {
      key: '近7天',
      value: 7,
    },
    {
      key: '近30天',
      value: 30,
    },
    {
      key: '近90天',
      value: 90
    }
  ];
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRangeChange = (event) => {
    const selectedValue = event.target.value;
    console.log('当前选择的范围:', selectedValue);
    fetchData(selectedValue, 1);
  };

  const handleProductChange = (event) => {
    const selectedValue = event.target.value;
    console.log('当前选择的范围:', selectedValue);
    fetchData(7, selectedValue);
  };

  return (
    <Container>
      <Stack fullWidth direction="row" sx={{ mb:5 }}>
        <Container sx={{ width: 1/2 }}>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker />
          </LocalizationProvider> */}
        </Container>
        <Stack fullWidth direction="row" sx={{ width: 1/2 }}>
          <Container sx={{ width: 0.3 }}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="dateRange">范围</InputLabel>
              <Select
                labelId="dateRange"
                id="dateRange"
                // value={age}
                label="range"
                onChange={handleRangeChange}
                defaultValue={7}
              >
                {rangeOptions.map((range) => (
                  <MenuItem value={range.value}>{range.key}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Container>
          <Container sx={{ width: 0.7 }}>
            <FormControl sx={{ width: "90%" }}>
              <InputLabel id="product">产品</InputLabel>
              <Select
                labelId="product"
                id="product"
                // value={age}
                label="pid"
                onChange={handleProductChange}
                defaultValue={1}
              >
                {productOptions ? 
                  (productOptions.map((productOption) => (
                    <MenuItem value={productOption.id}>{productOption.name}</MenuItem>
                  )))
                : "Not loaded yet"}
              </Select>
            </FormControl>
          </Container>
        </Stack>
      </Stack>
      <Stack fullWidth direction="row">
        <ReactEcharts option={barChartOption} style={{ height: "400px", width: "50%" }}/>
        <ReactEcharts option={lineChartOption} style={{ height: "400px", width: "50%" }}/>
      </Stack>
    </Container>
      
  );
}
