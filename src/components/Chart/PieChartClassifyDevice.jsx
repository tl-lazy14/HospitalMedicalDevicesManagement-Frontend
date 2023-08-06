// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { ResponsivePie } from '@nivo/pie'

const PieChartClassifyDevice = ({ data, total }) => {

    return (
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'category10' }}
            borderWidth={1}
            borderColor={{ theme: 'background' }}
            arcLinkLabel={e => Math.round((e.value * 100 /total))+'%'}
            arcLinkLabelsTextColor="black"
            arcLinkLabelsOffset={2}
            arcLinkLabelsDiagonalLength={25}
            arcLinkLabelsStraightLength={45}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
            enableArcLabels={false}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 65,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: 'black',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle'
                }
            ]}
        />
    )
}

export default PieChartClassifyDevice;