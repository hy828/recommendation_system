import * as React from 'react';
import ReactEcharts from "echarts-for-react";
import { MenuItem, TextField, Paper, Divider } from '@mui/material';

export default function DataVisualization({ lineChart1Option, lineChart2Option, productOptions, fetchData }) {
  const [pid, setPid] = React.useState(1); // 产品ID

  const handleProductChange = (event) => { // 产品选择框变化事件处理函数
    const selectedValue = event.target.value;
    const product = productOptions.find(option => option.id === selectedValue);
    setPid(selectedValue);
    fetchData(selectedValue, product.label); // 重新获取数据
  };

  return (
    <Paper sx={{ pt: 2, px: 3, maxHeight: 680 }}>
      {/* 产品选择框 */}
      <TextField
        sx={{ width: 450 }}
        size='small'
        select
        margin="dense"
        label="产品" 
        onChange={handleProductChange}
        value={pid}
      >
        {productOptions.map((productOption) => (
          <MenuItem value={productOption.id}>{productOption.label}</MenuItem>
        ))}
      </TextField>
      {/* 折线图 - 某个产品近30天销售情况 */}
      <ReactEcharts option={lineChart1Option} style={{ height: "300px"}}/>
      <Divider sx={{ mb: 2 }}/>
      {/* 折线图 - 各个产品类别近30天销售情况 */}
      <ReactEcharts option={lineChart2Option} style={{ height: "300px"}}/>
    </Paper>
  );
}
