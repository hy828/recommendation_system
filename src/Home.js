import * as React from 'react';
import { CssBaseline, Box } from '@mui/material';
import DataVisualization from './DataVisualization';
import NavigationBar from './NavigationBar';

export default function Home() {
  const [lineChart1Option, setLineChart1Option] = React.useState({});
  const [lineChart2Option, setLineChart2Option] = React.useState({});
  const [productOptions, setProductOptions] = React.useState([]);

  React.useEffect(() => {
    fetchData(1, '漏报漏缴提醒');
  }, []);

  const fetchData = async (pid, productName) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/data_visualization/get_chart_data?pid=' + encodeURIComponent(pid));
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();

      const lineChartData1 = data.result1;
      const lineChartData2 = data.result2;
      const dates = data.dates;
      const products = data.products;
      setProductOptions(products);

      const line1 = {
        title: {
          text: '产品 ' + productName + ' 近30天销售情况',
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          bottom: 30,
        },
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: lineChartData1.map(item => item.value),
            type: 'line',
          }
        ]
      };

      const line2 = {
        title: {
          text: '产品各个类别近30天销售情况',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['报税', '发票', '算薪', '咨询']
        },
        grid: {
          bottom: 30,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates
        },
        yAxis: {
          type: 'value'
        },
        series: lineChartData2
      };

      setLineChart1Option(line1);
      setLineChart2Option(line2);
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box  sx={{ ml: 30, my: 3, mr: 5 }}>
        <DataVisualization lineChart1Option={lineChart1Option} lineChart2Option={lineChart2Option} productOptions={productOptions} fetchData={fetchData}/>
      </Box>
    </Box>
  );
}