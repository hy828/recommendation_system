import * as React from 'react';
import ReactEcharts from "echarts-for-react";
import { MenuItem, TextField, Paper, Grid, Divider } from '@mui/material';

export default function DataVisualization({ barChartOption, lineChartOption, pieChart1Option, pieChart2Option, pieChart3Option, pieChart4Option, productOptions, fetchData }) {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const [date, setDate] = React.useState(formattedDate);
  const [range, setRange] = React.useState(7);
  const [pid, setPid] = React.useState(1);
  const [productName, setProductName] = React.useState('漏报漏缴提醒');

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
  
  React.useEffect(() => {
    fetchData(date, range, pid, productName);
  }, [date, range, pid, productName]);

  const handleDateChange = (event) => {
    const selectedValue = event.target.value;
    setDate(selectedValue);
  };

  const handleRangeChange = (event) => {
    const selectedValue = event.target.value;
    setRange(selectedValue);
  };

  const handleProductChange = (event) => {
    const selectedValue = event.target.value;
    const product = productOptions.find(option => option.id === selectedValue);
    setPid(selectedValue);
    setProductName(product.label);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container columnSpacing={5} rowSpacing={1}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size='small'
            margin="dense"
            label="日期" 
            type="date"
            onChange={handleDateChange}
            defaultValue={formattedDate}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            fullWidth
            size='small'
            select
            margin="dense"
            label="范围" 
            onChange={handleRangeChange}
            defaultValue={7}
          >
            {rangeOptions.map((range) => (
              <MenuItem value={range.value}>{range.key}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            size='small'
            select
            margin="dense"
            label="产品" 
            onChange={handleProductChange}
            defaultValue={1}
          >
            {productOptions.map((productOption) => (
              <MenuItem value={productOption.id}>{productOption.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sx={{ pb: 3 }}>
          <ReactEcharts option={barChartOption} style={{ height: "300px" }}/>
        </Grid>
        <Grid item xs={6} sx={{ pb: 3 }}>
        <ReactEcharts option={lineChartOption} style={{ height: "300px"}}/>
        </Grid>
        <Grid item xs={3}>
        <ReactEcharts option={pieChart1Option} style={{ height: "200px", padding: 0}}/>
        </Grid>
        <Grid item xs={3}>
        <ReactEcharts option={pieChart2Option} style={{ height: "200px"}}/>
        </Grid>
        <Grid item xs={3}>
        <ReactEcharts option={pieChart3Option} style={{ height: "200px"}}/>
        </Grid>
        <Grid item xs={3}>
        <ReactEcharts option={pieChart4Option} style={{ height: "200px"}}/>
        </Grid>
      </Grid>
    </Paper>
  );
}
