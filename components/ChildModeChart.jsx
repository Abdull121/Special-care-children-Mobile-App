// import React from 'react';
// import { View, Text } from 'react-native';
// import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
// import * as scale from 'd3-scale';

// const MoodChart = ({ data, period }) => {
//   // Define colors for different moods
//   const moodColors = {
//     happy: '#4CAF50',
//     unhappy: '#FF9800',
//     anxious: '#9C27B0',
//     sad: '#2196F3',
//   };

//   // Format data for stacked bar chart
//   const chartData = Object.keys(moodColors).map((mood) => ({
//     values: data.map((item) => item[mood] || 0),
//     color: moodColors[mood],
//   }));

//   // Format X-axis labels
//   const xAxisLabels = period === 'weekly' 
//     ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     : Array.from({ length: data.length }, (_, i) => `Week ${i + 1}`);

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center' }}>
//         Mood Chart - {period.charAt(0).toUpperCase() + period.slice(1)}
//       </Text>
      
//       <View style={{ height: 300, flexDirection: 'row' }}>
//         <YAxis
//           data={chartData[0].values}
//           contentInset={{ top: 20, bottom: 20 }}
//           svg={{ fill: 'grey', fontSize: 12 }}
//           numberOfTicks={5}
//         />
        
//         <View style={{ flex: 1, marginLeft: 10 }}>
//           <BarChart
//             style={{ flex: 1 }}
//             data={chartData}
//             gridMin={0}
//             spacingInner={0.4}
//             spacingOuter={0.4}
//             contentInset={{ top: 20, bottom: 20 }}
//             yAccessor={({ item }) => item}
//           >
//             <Grid direction={Grid.Direction.HORIZONTAL} />
//           </BarChart>
          
//           <XAxis
//             data={data}
//             scale={scale.scaleBand}
//             formatLabel={(value, index) => xAxisLabels[index]}
//             contentInset={{ left: 30, right: 30 }}
//             svg={{ fill: 'grey', fontSize: 12, rotation: -45, originY: 30 }}
//           />
//         </View>
//       </View>

//       {/* Legend */}
//       <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
//         {Object.entries(moodColors).map(([mood, color]) => (
//           <View key={mood} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
//             <View style={{ width: 12, height: 12, backgroundColor: color, marginRight: 5 }} />
//             <Text style={{ fontSize: 12 }}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default MoodChart;