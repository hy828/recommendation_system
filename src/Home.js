import * as React from 'react';
import { CssBaseline, Box } from '@mui/material';
import DataVisualization from './DataVisualization';
import NavigationBar from './NavigationBar';

export default function Home() {
  const [barChartOption, setBarChartOption] = React.useState({});
  const [lineChartOption, setLineChartOption] = React.useState({});
  const [pieChart1Option, setPieChart1Option] = React.useState({});
  const [pieChart2Option, setPieChart2Option] = React.useState({});
  const [pieChart3Option, setPieChart3Option] = React.useState({});
  const [pieChart4Option, setPieChart4Option] = React.useState({});
  const [productOptions, setProductOptions] = React.useState([]);

  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${today.getFullYear()}-${month}-${day}`;

  React.useEffect(() => {
    fetchData(formattedDate, 7, 1, '漏报漏缴提醒');
  }, []);

  const fetchData = async (date, range, pid, productName) => {
    try {
      // console.log(range, pid);
      const response = await fetch('http://127.0.0.1:5000/data_visualization/get_product_options');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const products = data.products;
      setProductOptions(products);
      // console.log(productOptions);

      const queryParams = new URLSearchParams({
        date: date,
        range: range,
        pid: pid,
      });
      const response2 = await fetch('http://127.0.0.1:5000/data_visualization/get_chart_data?' + queryParams.toString());
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data2 = await response2.json();

      const barChartData = data2.result1;
      const lineChartData = data2.result2;
      const pieChartData1 = data2.result3['报税'];
      const pieChartData2 = data2.result3['发票'];
      const pieChartData3 = data2.result3['算薪'];
      const pieChartData4 = data2.result3['咨询'];

      const bar = {
        title: {
          text: '产品销售情况',
          subtext: date
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          bottom: 25
        },
        xAxis: {
          type: 'category',
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
          text: '产品近期销售情况',
          subtext: productName
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          bottom: 30
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
            type: 'line',
          }
        ]
      };

      const pie1 = {
        title: {
          text: '报税',
          subtext: date
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          bottom: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            startAngle: 180,
            endAngle: 360,
            top: '-10%',
            left: '-20%',
            right: '-20%',
            bottom: '-70%',
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: pieChartData1
          }
        ]
      };

      const pie2 = {
        title: {
          text: '发票',
          subtext: date
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          bottom: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            startAngle: 180,
            endAngle: 360,
            top: '-10%',
            left: '-20%',
            right: '-20%',
            bottom: '-70%',
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: pieChartData2
          }
        ]
      };

      const pie3 = {
        title: {
          text: '算薪',
          subtext: date
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          bottom: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            startAngle: 180,
            endAngle: 360,
            top: '-10%',
            left: '-20%',
            right: '-20%',
            bottom: '-70%',
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: pieChartData3
          }
        ]
      };

      const pie4 = {
        title: {
          text: '咨询',
          subtext: date
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          bottom: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            startAngle: 180,
            endAngle: 360,
            top: '-10%',
            left: '-20%',
            right: '-20%',
            bottom: '-70%',
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: pieChartData4
          }
        ]
      };

      setBarChartOption(bar);
      setLineChartOption(line);
      setPieChart1Option(pie1);
      setPieChart2Option(pie2);
      setPieChart3Option(pie3);
      setPieChart4Option(pie4);
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box  sx={{ ml: 30, my: 3, mr: 5 }}>
        <DataVisualization barChartOption={barChartOption} lineChartOption={lineChartOption} pieChart1Option={pieChart1Option} pieChart2Option={pieChart2Option} pieChart3Option={pieChart3Option} pieChart4Option={pieChart4Option} productOptions={productOptions} fetchData={fetchData}/>
      </Box>
    </Box>
  );
}