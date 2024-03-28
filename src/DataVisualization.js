import * as React from 'react';
import * as echarts from 'echarts';

export default function DataVisualization() {
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const options = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    };
    // Use the specified configuration and data to render the chart
    chart.setOption(options);
    // Clean up when the component is unmounted
    return () => {
      chart.dispose();
    };
  }, []);

    return (
      <div ref={chartRef} style={{ width: '100%', height: '400px' }}>
          {/* Chart will be rendered here */}
      </div>
    )
}
