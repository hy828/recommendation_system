import * as React from 'react';
import ReactEcharts from "echarts-for-react";
import { MenuItem, TextField, Paper, Grid, Divider } from '@mui/material';

export default function DataVisualization({ lineChart1Option, lineChart2Option, productOptions, fetchData }) {
  const [pid, setPid] = React.useState(1);
  const [productName, setProductName] = React.useState('漏报漏缴提醒');

  React.useEffect(() => {
    fetchData(pid, productName);
  }, [pid, productName]);

  const handleProductChange = (event) => {
    const selectedValue = event.target.value;
    const product = productOptions.find(option => option.id === selectedValue);
    setPid(selectedValue);
    setProductName(product.label);
  };

  return (
    <Paper sx={{ pt: 2, px: 3, maxHeight: 680 }}>
      <TextField
        sx={{ width: 450 }}
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
      <ReactEcharts option={lineChart1Option} style={{ height: "300px"}}/>
      <Divider sx={{ mb: 2 }}/>
      <ReactEcharts option={lineChart2Option} style={{ height: "300px"}}/>
    </Paper>
  );
}
