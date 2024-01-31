import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
type Props = {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   options: any;
};

const ChartColumn = (props: Props) => {
   const barOptions: Highcharts.Options = useMemo(
      () => ({
         chart: {
            type: 'bar'
         },
         title: {
            text: props.options?.title,
            align: 'left'
         },
         xAxis: {
            type: 'category',
            title: {
               text: null
            },
            gridLineWidth: 1,
            lineWidth: 0
         },
         yAxis: {
            min: 0,
            title: {
               text: props.options?.yTitle,
               align: 'high'
            },
            labels: {
               overflow: 'justify'
            },
            gridLineWidth: 0
         },
         tooltip: {
            valueSuffix: props.options?.suffix
         },
         plotOptions: {
            bar: {
               dataLabels: {
                  enabled: true
               },
               groupPadding: 0.1
            }
         },
         series: props.options?.series
      }),
      [props]
   );
   return <HighchartsReact highcharts={Highcharts} options={barOptions} />;
};

export default ChartColumn;
