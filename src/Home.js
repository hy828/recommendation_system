import * as React from 'react';
import { CssBaseline, Box } from '@mui/material';
import DataVisualization from './DataVisualization';
import NavigationBar from './NavigationBar';

export default function Home() {
  const [lineChart1Option, setLineChart1Option] = React.useState({}); // 折线图1的配置
  const [lineChart2Option, setLineChart2Option] = React.useState({}); // 折线图2的配置
  const [productOptions, setProductOptions] = React.useState([]); // 产品选项

  React.useEffect(() => {
    fetchData2();
    fetchData1(1, '漏报漏缴提醒');
  }, []);

  const getDates = (days) => { // 获取最近days天的日期组成的数组
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - days);

    const dates = [];
    for (let date = thirtyDaysAgo; date <= today; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    return dates.map(date => date.toLocaleDateString());
  }

  const fetchData1 = async (pid, productName) => {
    // 向后端请求数据，获取产品pid近30天销售数据
    const response = await fetch('http://127.0.0.1:5000/data_visualization/get_chart_data1?pid=' + encodeURIComponent(pid));
    if (!response.ok) {
      window.alert('无法获取产品 ' + productName + ' 近30天销售数据');
      return;
    }
    const data = await response.json();

    const lineChartData = data.result;
    const dates = getDates(30); // 日期，x轴

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
          data: lineChartData.map(item => item.value),
          type: 'line',
        }
      ]
    };

    setLineChart1Option(line1);
  };

  const fetchData2 = async () => {
    // 向后端请求数据，获取产品类别近30天销售数据
    const response = await fetch('http://127.0.0.1:5000/data_visualization/get_chart_data2');
    if (!response.ok) {
      window.alert('无法获取产品类别近30天销售数据');
      return;
    }
    const data = await response.json();

    const lineChartData = data.result;
    const dates = getDates(30); // 日期，x轴
    const products = data.products; // 产品选项
    setProductOptions(products);

    const line = {
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
      series: lineChartData
    };

    setLineChart2Option(line);
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box  sx={{ ml: 30, my: 3, mr: 5 }}>
        <DataVisualization lineChart1Option={lineChart1Option} lineChart2Option={lineChart2Option} productOptions={productOptions} fetchData={fetchData1}/>
      </Box>
    </Box>
  );
}