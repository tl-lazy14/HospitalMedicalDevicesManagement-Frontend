// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { ResponsivePie } from '@nivo/pie'

const PieChartRequest = ({ data, total }) => {
    const color = ['rgb(44, 160, 44)', 'rgb(255, 127, 14)', 'rgb(214, 39, 40)'];
    return (
        <ResponsivePie
            data={data}
            margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={color}
            borderWidth={1}
            borderColor={{ theme: 'background' }}
            arcLinkLabel={e => Math.round((e.value * 100 /total))+'%'}
            arcLinkLabelsTextColor="black"
            arcLinkLabelsOffset={2}
            arcLinkLabelsDiagonalLength={25}
            arcLinkLabelsStraightLength={30}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
            enableArcLabels={false}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 10,
                    translateY: 50,
                    itemsSpacing: 20,
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

export default PieChartRequest;