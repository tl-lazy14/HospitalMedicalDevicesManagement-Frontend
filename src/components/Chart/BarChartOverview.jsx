import { ResponsiveBar } from '@nivo/bar'

const BarChartOverview = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={[
            'Yêu cầu sử dụng',
            'Lần sử dụng',
            'Hỏng',
            'Sửa chữa, bảo trì',
            'Yêu cầu mua sắm'
        ]}
        indexBy="Tháng"
        margin={{ top: 20, right: 135, bottom: 60, left: 60 }}
        padding={0.2}
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
            tickRotation: 0,
            legend: 'Tháng',
            legendPosition: 'middle',
            legendOffset: 40
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 3,
            tickRotation: 0,
            legend: 'Số lượng',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        isFocusable={false}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 2,
                itemsSpacing: 6,
                itemWidth: 90,
                itemHeight: 18,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 16,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
);

export default BarChartOverview;