import * as React from 'react';
import { CssBaseline, Box } from '@mui/material';
import DataVisualization from './DataVisualization';
import NavigationBar from './NavigationBar';

export default function Home() {
  const [barChartOption, setBarChartOption] = React.useState({});
  const [lineChartOption, setLineChartOption] = React.useState({});
  const [productOptions, setProductOptions] = React.useState([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (range=7, pid=1) => {
    try {
      console.log(range, pid);
      const response = await fetch('http://127.0.0.1:5000/dataVisualization/getProductOptions');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const products = data.products;
      setProductOptions(products);
      // console.log(productOptions);

      const today = new Date();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const formattedDate = `${today.getFullYear()}-${month}-${day}`;

      const queryParams = new URLSearchParams({
        date: formattedDate,
        range: range,
        pid: pid,
      });
      const response2 = await fetch('http://127.0.0.1:5000/dataVisualization/getChartData?' + queryParams.toString());
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data2 = await response2.json();

      const barChartData = data2.result1;
      const lineChartData = data2.result2;

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
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box  sx={{ mx: 10, pt: 12 }}>
        <DataVisualization barChartOption={barChartOption} lineChartOption={lineChartOption} productOptions={productOptions} fetchData={fetchData}/>
      </Box>
    </Box>
  );
}