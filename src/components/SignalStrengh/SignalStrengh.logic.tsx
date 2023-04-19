import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Circle, TSpan } from 'react-native-svg';
import { ThemeContext } from '../../contexts/theme.context';
import { Platform, ViewStyle } from 'react-native';
import ShipLottieAnimation from '../../../assets/142335-ship.json';
import RocketLottieAnimation from '../../../assets/99382-rocket-all-orange-privacy-website.json';
import WormLottieAnimation from '../../../assets/117915-slow-worm-snail.json';
import TurtleLottieAnimation from '../../../assets/63541-turtle.json';
import DirigibleLottieAnimation from '../../../assets/63381-dirigible.json';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { LineChart } from 'react-native-chart-kit';
import { runOnJS } from 'react-native-reanimated';
import { withDelay } from 'react-native-reanimated';
import { cancelAnimation } from 'react-native-reanimated';
import { Text } from '../Text/Text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTSpan = Animated.createAnimatedComponent(TSpan);
const AnimatedLineChart = Animated.createAnimatedComponent(LineChart);

export const useSignalStrenghLogic = () => {
  const arrNumMock = useMemo(() => Array.from({length: 150}, () => Math.floor(Math.random() * 100)), []);
  const INTERVAL_TIMEOUT = 3000;
  //states
  const [arrNum, setArrNum] = useState<number[]>([]);
  const [limit, setLimit] = useState<number | null>(20);
  //hooks
  const { colors } = useContext(ThemeContext);

  const Rayon = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * (Rayon - strokeWidth / 2);
  const offset = useSharedValue(circumference);
  const percent = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const dataCurrentPoint = useSharedValue(0);
  const opacity = useSharedValue(0);
  const flip = useSharedValue(0);
  const points = useSharedValue<
    Array<{
      value: number;
      x: number;
      y: number;
    }>
  >([]);

  const _x = useDerivedValue(() => {
    return `x : ${x.value.toFixed(2)}`;
  }, [x,y,dataCurrentPoint]);
  const _y = useDerivedValue(() => {
    return `y : ${y.value.toFixed(2)}`;
  }, [x,y,dataCurrentPoint]);
  const _dataCurrentPoint = useDerivedValue(() => {
    return `data: ${dataCurrentPoint.value.toFixed(2)} %`;
  }, [x,y,dataCurrentPoint]);

  const avg = useDerivedValue(() => {
    return (arrNum.reduce((a, b) => a + b, 0) / arrNum.length || 0).toFixed(2);
  }, [arrNum]);
  const avgMin = useDerivedValue(() => {
    const minArr = arrNum
      .sort((a, b) => a - b)
      .filter((v, i, a) => {
        return i <= Math.floor(a.length / 100);
      });
    const res = (
      minArr.reduce((a, b) => a + b, 0) / minArr.length || 0
    ).toFixed(2);
    return res;
  }, [arrNum]);

  const avgMax = useDerivedValue(() => {
    const maxArr = arrNum
      .sort((a, b) => b - a)
      .filter((v, i, a) => {
        return i <= Math.floor(a.length / 100);
      });

    const res = (
      maxArr.reduce((a, b) => a + b, 0) / maxArr.length || 0
    ).toFixed(2);
    return res;
  }, [arrNum]);

  const fontSize = 20;

  const percentRef = useRef(percent);
  const offsetRef = useRef(offset);
  const lineChartRef = useAnimatedRef<LineChart>();

  //reanimated

  const animatedProps = useAnimatedProps(() => {
    offset.value = circumference - (percent.value / 100) * circumference;
    return {
      strokeDashoffset: withTiming(offset.value, { duration: 200 }),
    };
  });
  const textAnimatedProps = useAnimatedProps(() => {
    return {
      children: `${percent.value}%`,
    };
  });
  const textAvgAnimatedProps = useAnimatedProps(() => {
    return {
      children: `avg : ${avg.value}%`,
    };
  });
  const textMinAnimatedProps = useAnimatedProps(() => {
    return {
      children: `1%Min : ${avgMin.value}%`,
    };
  });
  const textMaxAnimatedProps = useAnimatedProps(() => {
    return {
      children: `1%Max : ${avgMax.value}%`,
    };
  });

  const fetchWifiStrengh = useCallback(() => {
    NetInfo.fetch('wifi').then((state) => {
      if (
        (state.details as any).strength 
        //&& (state.details as any).strength !== percent.value
      ) {
        console.log((state.details as any).strength);
        percent.value = (state.details as any).strength;
        percentRef.current.value = (state.details as any).strength;
        setArrNum([...arrNum, (state.details as any).strength]);
      }
    });
  }, [percentRef, offsetRef, arrNum]);

  useEffect(() => {
    const interval = setInterval(fetchWifiStrengh, INTERVAL_TIMEOUT);
    return () => clearInterval(interval);
  }, [fetchWifiStrengh]);

  const resetAvg = () => {
    setArrNum([parseInt(percent.value.toString())]);
  };

  const limitData = (value?: number | null) => {
    setLimit(value);
  };
  const designPerNumber = useMemo(() => {
    return {
      s_all: {
        backgroundColor: limit === null ? colors.green : colors.primary,
      } as ViewStyle,
      s_100: {
        backgroundColor: limit === 100 ? colors.green : colors.primary,
      } as ViewStyle,
      s_50: {
        backgroundColor: limit === 50 ? colors.green : colors.primary,
      } as ViewStyle,
      s_20: {
        backgroundColor: limit === 20 ? colors.green : colors.primary,
      } as ViewStyle,
      s_10: {
        backgroundColor: limit === 10 ? colors.green : colors.primary,
      } as ViewStyle,
      s_5: {
        backgroundColor: limit === 5 ? colors.green : colors.primary,
      } as ViewStyle,
    };
  }, [limit]);

  const LottieAnimation = useMemo(() => {
    const value = arrNum[arrNum.length - 1];
    switch (true) {
      case value >= 0 && value < 20:
        return WormLottieAnimation;
      case value >= 20 && value < 40:
        return TurtleLottieAnimation;
      case value >= 40 && value < 60:
        return ShipLottieAnimation;
      case value >= 60 && value < 80:
        return DirigibleLottieAnimation;
      case value >= 80 && value <= 100:
        return RocketLottieAnimation;
      default:
        return RocketLottieAnimation;
    }
  }, [arrNum]);

  useEffect(() => {
    if (lineChartRef.current) points.value = lineChartRef.current.getDotsInfo();
  });

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; LastX: number; max: number; min: number; flip: number }
  >({
    onStart: (event, ctx) => {
      ctx.max = Math.max(...points.value.map((e) => e.y));
      ctx.min = Math.min(...points.value.map((e) => e.y));
      ctx.flip = (ctx.max + ctx.min) / 2;
      flip.value = ctx.flip;
      const goalX = points.value
        .map((e) => e.x)
        .reduce((prev, current) =>
          Math.abs(current - event.x) < Math.abs(prev - event.x)
            ? current
            : prev
        );
      const goalY = points.value.reduce((prev, current) =>
        Math.abs(current.x - event.x) < Math.abs(prev.x - event.x)
          ? current
          : prev
      ).y;
      const data = points.value.reduce((prev, current) =>
        Math.abs(current.x - event.x) < Math.abs(prev.x - event.x)
          ? current
          : prev
      ).value;
      x.value = withTiming(goalX);
      y.value = withTiming(goalY < ctx.flip ? goalY : goalY - 50);
      dataCurrentPoint.value = data;
      opacity.value = withTiming(1);
    },
    onActive: (event, ctx) => {
      ctx.max = Math.max(...points.value.map((e) => e.y));
      ctx.min = Math.min(...points.value.map((e) => e.y));
      ctx.flip = (ctx.max + ctx.min) / 2;
      flip.value = ctx.flip;
      const goalX = points.value
        .map((e) => e.x)
        .reduce((prev, current) =>
          Math.abs(current - event.x) < Math.abs(prev - event.x)
            ? current
            : prev
        );
      const goalY = points.value.reduce((prev, current) =>
        Math.abs(current.x - event.x) < Math.abs(prev.x - event.x)
          ? current
          : prev
      ).y;
      const data = points.value.reduce((prev, current) =>
        Math.abs(current.x - event.x) < Math.abs(prev.x - event.x)
          ? current
          : prev
      ).value;
      if (ctx.LastX !== goalX) {
        if (points.value.length > 19) {
          x.value = event.x;
        }
        x.value = withDelay(
          Math.min(points.value.length, 100),
          withTiming(goalX, { duration: 150 })
        );
        console.log(goalY < ctx.flip);
        y.value = withDelay(
          Math.min(points.value.length, 100),
          withTiming(goalY < ctx.flip ? goalY : goalY - 50, { duration: 150 })
        );
        dataCurrentPoint.value = data;
      }
      ctx.LastX = goalX;
    },
    onFinish: () => {
      flip.value = 0;
      opacity.value = withTiming(0);
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
      opacity: opacity.value,
    };
  });
  const animatedStyleData = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value > 200 ? x.value - 74 : x.value - 1,
        },
        {
          translateY: -(35/2) + 5,
        },
      ],
      borderTopLeftRadius: x.value >= 200 || (x.value >= 200 && y.value >= flip.value) ? 5 : 0,
      borderTopRightRadius: x.value <= 200 || (x.value <= 200 && y.value >= flip.value) ? 5 : 0,
      borderBottomLeftRadius: x.value >= 200 || (x.value >= 200 && y.value >= flip.value) ? 5 : 0,
      borderBottomRightRadius: x.value <= 200 || (x.value <= 200 && y.value >= flip.value) ? 5 : 0,
      opacity: opacity.value,
    };
  });

  return {
    AnimatedCircle,
    AnimatedTSpan,
    AnimatedLineChart,
    Rayon,
    strokeWidth,
    circumference,
    animatedProps,
    fontSize,
    textAnimatedProps,
    textAvgAnimatedProps,
    textMinAnimatedProps,
    textMaxAnimatedProps,
    resetAvg,
    arrNum: limit ? ((Platform.OS === 'ios' ? arrNumMock : arrNum).slice(-limit)) : (Platform.OS === 'ios' ? arrNumMock : arrNum),
    limitData,
    designPerNumber,
    LottieAnimation: LottieAnimation,
    gestureHandler,
    animatedStyle,
    lineChartRef,
    animatedStyleData,
    x: _x,
    y: _y,
    dataCurrentPoint: _dataCurrentPoint,
  };
};
