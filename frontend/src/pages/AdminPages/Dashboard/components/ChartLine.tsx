/* eslint-disable @typescript-eslint/no-explicit-any */
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { MONTHS } from '../../../../constants/statistics';
type Props = {
   options: any;
};

const ChartLine = (props: Props) => {
   const lineOptions: Highcharts.Options = useMemo(
      () => ({
         chart: {
            type: 'line'
         },
         title: {
            text: props.options?.title,
            align: 'left'
         },
         xAxis: {
            categories: MONTHS.map((month) => month.text + ` ${props.options.year}`)
         },
         yAxis: [
            {
               // left y axis
               title: {
                  text: props.options.yTitle1
               },
               labels: {
                  align: 'left',
                  x: 3,
                  y: 16,
                  format: '{value:.,0f}'
               },
               showFirstLabel: false
            },
            {
               // right y axis
               linkedTo: 0,
               gridLineWidth: 0,
               opposite: true,
               title: {
                  text: props.options.yTitle2
               },
               labels: {
                  align: 'right',
                  x: -3,
                  y: 16,
                  format: '{value:.,0f}'
               },
               showFirstLabel: false
            }
         ],
         plotOptions: {
            line: {
               enableMouseTracking: true
            }
         },
         series: props.options?.series
      }),
      [props]
   );

   return <HighchartsReact highcharts={Highcharts} options={lineOptions} />;
};

export default ChartLine;
