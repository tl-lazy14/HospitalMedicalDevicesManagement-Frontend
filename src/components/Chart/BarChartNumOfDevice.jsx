import { ResponsiveBar } from '@nivo/bar'

const BarChartNumOfDevice = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={[
            'Số thiết bị',
        ]}
        indexBy="Tháng"
        margin={{ top: 20, right: 100, bottom: 60, left: 140 }}
        padding={0.3}
        borderWidth={2}
        groupMode="grouped"
        layout="vertical"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'category10' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 6,
            tickPadding: 5,
            tickRotation: -40,
            legend: 'Tháng',
            legendPosition: 'middle',
            legendOffset: 52
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 3,
            tickRotation: 0,
            legend: 'Số thiết bị',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        enableGridX={true}
        enableGridY={false}
        labelSkipWidth={10}
        labelSkipHeight={12}
        labelTextColor='white'
        isFocusable={false}
    />
);

export default BarChartNumOfDevice;