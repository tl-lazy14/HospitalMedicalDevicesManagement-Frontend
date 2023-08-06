import { ResponsiveLine } from '@nivo/line'

const LineChartInventory = ({ data }) => (
    <ResponsiveLine
        data={data}
        margin={{ top: 30, right: 30, bottom: 50, left: 90 }}
        
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Tháng',
            legendOffset: 40,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Tổng tiền (VND)',
            legendOffset: -80,
            legendPosition: 'middle'
        }}
        colors={{ scheme: 'category10' }}
        pointSize={8}
        pointColor='white'
        pointBorderWidth={2}
        pointBorderColor='#3498db'
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.4}
        useMesh={true}
    />
);

export default LineChartInventory;