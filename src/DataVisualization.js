import * as React from 'react';
import { Container, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ReactEcharts from "echarts-for-react";

export default function DataVisualization() {
  const [barChartOption, setBarChartOption] = React.useState({});
  const [lineChartOption, setLineChartOption] = React.useState({});

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const today = new Date();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const formattedDate = `${today.getFullYear()}-${month}-${day}`;

      const queryParams = new URLSearchParams({
        date: formattedDate,
        range: 7,
        pid: 13
      });
      const response = await fetch('http://127.0.0.1:5000/dataVisualization/getChartData?' + queryParams.toString());
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();

      const barChartData = data.result1;
      const lineChartData = data.result2;

      const bar = {
        title: {
          text: '产品功能销售情况',
          subtext: formattedDate
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {  // Ensure xAxis labels are hidden
            show: false
          },
          data: barChartData.map(item => item.name),
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: barChartData.map(item => item.value)
          }
        ]
      };
      
      const line = {
        title: {
          text: '产品功能近期销售情况'
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: lineChartData.map(item => item.name)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: lineChartData.map(item => item.value),
            type: 'line'
          }
        ]
      };
      setBarChartOption(bar);
      setLineChartOption(line);
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  return (
    <Container sx={{ margin: 5, paddingTop: 7 }}>
      <Stack fullWidth direction="row" sx={{ mb:5 }}>
        {/* <DatePicker
          label="Controlled picker"
          // value={value}
          // onChange={(newValue) => setValue(newValue)}
          sx={{ width: "50%" }}
        /> */}
        <FormControl sx={{ width: "50%" }}>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            // onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack fullWidth direction="row">
        <ReactEcharts option={barChartOption} style={{ height: "400px", width: "50%" }}/>
        <ReactEcharts option={lineChartOption} style={{ height: "400px", width: "50%" }}/>
      </Stack>
    </Container>
      
  );
}
