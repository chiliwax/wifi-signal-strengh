import { Text } from '../Text/Text';
import { useSignalStrenghLogic } from './SignalStrengh.logic';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';
import { Dimensions, Platform, Pressable, View } from 'react-native';
import { useStrenghSignalStyle } from './SignalStrengh.design';
import { LineChart } from 'react-native-chart-kit';
import { useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import LottieAnimation from '../../../assets/142335-ship.json';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import ReText from '../ReText/ReText';

export const SignalStrengh: React.FC<any> = () => {
  const logic = useSignalStrenghLogic();
  const design = useStrenghSignalStyle();

  const chartHeight = useRef(0);

  return (
    <View style={design.container}>
      <View
        style={{
          display: 'flex',
          width: '80%',
          height: '50%',
        }}
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 60,
            position: 'absolute',
          }}
        >
          <View style={design.lottieContainer}>
            <LottieView
              autoPlay
              ref={null}
              style={{ width: 50, height: 50 }}
              source={logic.LottieAnimation}
            />
          </View>
        </View>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Circle
            cx={logic.Rayon}
            cy={logic.Rayon}
            r={logic.Rayon - logic.strokeWidth / 2}
            stroke={design.svg.circle.inactiveCircleColor}
            strokeWidth={logic.strokeWidth}
          />
          <logic.AnimatedCircle
            cx={logic.Rayon}
            cy={logic.Rayon}
            r={logic.Rayon - logic.strokeWidth / 2}
            originX={logic.Rayon}
            originY={logic.Rayon}
            rotation={-90}
            stroke={design.svg.circle.activeCircleColor}
            strokeWidth={logic.strokeWidth - 4}
            strokeLinecap="round"
            animatedProps={logic.animatedProps}
            strokeDasharray={`${logic.circumference} ${logic.circumference}`}
          />
          <SvgText
            fill={design.svg.text.color}
            fontSize={logic.fontSize}
            fontWeight="100"
            x={logic.Rayon}
            y={logic.Rayon - logic.fontSize / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            <logic.AnimatedTSpan animatedProps={logic.textAnimatedProps} />
          </SvgText>
          <SvgText
            fill={design.svg.text.color}
            fontSize={logic.fontSize / 3}
            fontWeight="100"
            x={logic.Rayon}
            y={logic.Rayon + 2}
            textAnchor="middle"
            alignmentBaseline="bottom"
          >
            <logic.AnimatedTSpan animatedProps={logic.textAvgAnimatedProps} />
          </SvgText>
          <SvgText
            fill={design.svg.text.color}
            fontSize={logic.fontSize / 3}
            fontWeight="100"
            x={logic.Rayon}
            y={logic.Rayon + logic.fontSize / 3 + 4}
            textAnchor="middle"
            alignmentBaseline="bottom"
          >
            <logic.AnimatedTSpan animatedProps={logic.textMinAnimatedProps} />
          </SvgText>
          <SvgText
            fill={design.svg.text.color}
            fontSize={logic.fontSize / 3}
            fontWeight="100"
            x={logic.Rayon}
            y={logic.Rayon + logic.fontSize}
            textAnchor="middle"
            alignmentBaseline="bottom"
          >
            <logic.AnimatedTSpan animatedProps={logic.textMaxAnimatedProps} />
          </SvgText>
        </Svg>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={logic.resetAvg} hitSlop={20}>
          <View style={[{ display: 'flex' }, design.button, design.secondary]}>
            <Text>Reset</Text>
          </View>
        </Pressable>
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          paddingTop: 40,
          paddingRight: 15,
          flex: 1,
        }}
        onLayout={(e) => (chartHeight.current = e.nativeEvent.layout.height)}
      >
        <PanGestureHandler onGestureEvent={logic.gestureHandler}>
          <Animated.View>
            <logic.AnimatedLineChart
              ref={logic.lineChartRef}
              data={{
                labels: [],
                datasets: [
                  {
                    data: logic.arrNum.length > 0 ? logic.arrNum : [0],
                  },
                  {
                    data: Array(logic.arrNum.length).fill(
                      logic.arrNum.reduce((a, b) => a + b, 0) /
                        logic.arrNum.length
                    ),
                    withDots: false,
                    color: () => design.svg.chart.avgColor,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 40} // from react-native
              height={chartHeight.current}
              yAxisLabel=""
              yAxisSuffix="%"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: design.svg.chart.backgroundColor,
                backgroundGradientFrom: design.svg.chart.backgroundColor,
                backgroundGradientTo: design.svg.chart.backgroundColor,
                propsForBackgroundLines: {
                  // strokeDasharray: "", // solid background lines with no dashes
                  stroke: design.svg.chart.dashlineColor,
                },
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => design.svg.chart.lineColor,
                labelColor: (opacity = 1) => design.svg.chart.text,
                style: {
                  borderRadius: 0,
                  padding: 0,
                },
                propsForDots: {
                  r:
                    logic.arrNum.length < 40
                      ? `${Math.min(60 / logic.arrNum.length, 4)}`
                      : '0',
                  strokeWidth: '2',
                  fill: '#ffa726',
                },
              }}
              bezier
              style={{
                padding: 0,
                marginVertical: 0,
                borderRadius: 0,
              }}
              onDataPointClick={(event) => {
                console.log('click' + event.value);
              }}
            />
            <Animated.View
              style={[design.svg.chart.lineInspector, logic.animatedStyle]}
            />
            <Animated.View
              style={[design.svg.chart.dataDisplayer, logic.animatedStyleData]}
            >
              <ReText style={design.retext} text={logic.dataCurrentPoint}/>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          marginBottom: 30,
          width: '100%',
          paddingHorizontal: 30,
          justifyContent: 'center',
        }}
      >
        <Pressable onPress={() => logic.limitData(null)} hitSlop={20}>
          <View
            style={[
              { display: 'flex' },
              design.minibutton,
              design.primary,
              logic.designPerNumber.s_all,
            ]}
          >
            <Text style={design.txtcenter}>All</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => logic.limitData(100)} hitSlop={0}>
          <View
            style={[
              { display: 'flex' },
              design.minibutton,
              design.primary,
              logic.designPerNumber.s_100,
            ]}
          >
            <Text style={design.txtcenter}>100</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => logic.limitData(50)} hitSlop={0}>
          <View
            style={[
              { display: 'flex' },
              design.minibutton,
              design.primary,
              logic.designPerNumber.s_50,
            ]}
          >
            <Text style={design.txtcenter}>50</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => logic.limitData(20)} hitSlop={0}>
          <View
            style={[
              { display: 'flex' },
              design.minibutton,
              design.primary,
              logic.designPerNumber.s_20,
            ]}
          >
            <Text style={design.txtcenter}>20</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => logic.limitData(10)} hitSlop={0}>
          <View
            style={[
              { display: 'flex' },
              design.minibutton,
              design.primary,
              logic.designPerNumber.s_10,
            ]}
          >
            <Text style={design.txtcenter}>10</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => logic.limitData(5)} hitSlop={0}>
          <View
            style={[
              { display: 'flex' },
              design.minibutton,
              design.primary,
              logic.designPerNumber.s_5,
            ]}
          >
            <Text style={design.txtcenter}>5</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
