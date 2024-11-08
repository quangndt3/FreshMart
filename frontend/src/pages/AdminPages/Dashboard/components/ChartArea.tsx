/* eslint-disable @typescript-eslint/no-explicit-any */
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { formatMstoDate } from '../../../../helper';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';

// Kích hoạt các module cần thiết
HC_exporting(Highcharts);
HC_exportData(Highcharts);

// Interface mô tả kiểu của đối tượng tooltip
interface TooltipObject {
   x: number;
   y: number;
}

// Hàm formatter cho tooltip
function tooltipFormatter(this: TooltipObject): string {
   const { day, dayOfWeek, month } = formatMstoDate(this.x);
   return (
      dayOfWeek +
      ', Ngày ' +
      day +
      ', tháng ' +
      month +
      ', ' +
      'Doanh thu: ' +
      this.y.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
   );
}
const ChartArea = (props: any) => {
   const defaultColors = [
      '#7cb5ec',
      '#434348',
      '#90ed7d',
      '#f7a35c',
      '#8085e9',
      '#f15c80',
      '#e4d354',
      '#2b908f',
      '#f45b5b',
      '#91e8e1'
   ];
   const chartColors = Highcharts.getOptions()?.colors || defaultColors;

   const areaOptions = useMemo(
      () => ({
         chart: {
            zoomType: 'x'
         },
         title: {
            text: props.options?.title,
            align: 'left'
         },
         subtitle: {
            text:
               document.ontouchstart === undefined
                  ? 'Click and drag in the plot area to zoom in'
                  : 'Pinch the chart to zoom in',
            align: 'left'
         },
         xAxis: {
            type: 'datetime'
         },
         yAxis: {
            title: {
               text: 'Exchange rate'
            }
         },
         legend: {
            enabled: false
         },
         tooltip: {
            formatter: tooltipFormatter
         },
         plotOptions: {
            area: {
               fillColor: {
                  linearGradient: {
                     x1: 0,
                     y1: 0,
                     x2: 0,
                     y2: 1
                  },
                  stops: [
                     [0, chartColors[0]],
                     [1, Highcharts.color(chartColors[2]).setOpacity(0).get('rgba')]
                  ]
               },
               marker: {
                  radius: 2
               },
               lineWidth: 1,
               states: {
                  hover: {
                     lineWidth: 1
                  }
               },
               threshold: null
            }
         },

         series: [
            {
               type: 'area',
               name: 'Doanh thu theo ngày',
               data: [...(props.options?.data || [])]
            }
         ]
      }),
      [props]
   );
   return <HighchartsReact highcharts={Highcharts} options={areaOptions} />;
};

export default ChartArea;
