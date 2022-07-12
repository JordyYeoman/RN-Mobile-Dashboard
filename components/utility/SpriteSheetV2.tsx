/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import React, {useEffect, useState} from 'react';

interface Animation {
  name: string;
  row: number;
  frames?: number;
  loop?: boolean;
  reverse?: boolean;
  onComplete?: () => void;
}

interface PlayConfig {
  name?: string;
  loop?: boolean;
  internalAnimations?: InternalAnimations;
}

type InternalAnimations = {[key: string]: InternalAnimation};

interface InternalAnimation {
  frames: number;
  in: number[];
  outX: number[];
  outY: number[];
  translateY: number;
  loop: boolean;
  reverse: boolean;
  onComplete?: () => void;
}

const blankInternalAnimation: InternalAnimation = {
  frames: 0,
  in: [0, 0],
  outX: [0, 0],
  outY: [0, 0],
  translateY: 0,
  loop: true,
  reverse: false,
};

interface Props {
  src: any;
  rows: number;
  cols: number;
  defaultAnimation: string;
  animations: Animation[];
  autoplay?: boolean;
  rate?: number;
  style?: StyleProp<ViewStyle>;
}

// Defaults - could be passed as props
const defaultSize = 1000;
const defaultRate = 30;

interface State {
  //   time: Animated.Value;
  internalAnimations: InternalAnimations;
  autoplay: boolean;
  currentAnimation: string;
  height: number;
  width: number;
  loaded: boolean;
}

// Setup
const internalAnims: InternalAnimations = {
  //   [defaultAnimation]: blankInternalAnimation,
};

// const defaultAnimation = defaultAnimation ?? animations[0].name;

const SpriteSheetV2 = ({
  defaultAnimation,
  animations,
}: {
  defaultAnimation: string;
  animations: Animation[];
}) => {
  const offset = useSharedValue(0);
  const [time, setTime] = useState(0);
  const [internalAnimations, setInternalAnimations] =
    useState<InternalAnimations>(internalAnims);
  const [currentAnimation, setCurrentAnimation] = useState(defaultAnimation);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [autoplay, setAutoPlay] = useState(true);

  useEffect(() => {}, []);

  const play = ({name, loop, internalAnimations}: PlayConfig) => {
    if (name) {
      setCurrentAnimation(name);
    }

    const anim = internalAnimations?.[name ?? currentAnimation];
    setTime(anim?.reverse ? anim.frames - 1 : 0);

    if (loop) {
      offset.value = withTiming(time, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
    }
  };

  //
  //
  //   stop() {
  //     this.state.time.stopAnimation();
  //   }

  //   reset = () => {
  //     this.stop();
  //     this.state.time.setValue(0);
  //   };
  //
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value * 255}],
    };
  });

  return (
    <>
      <Animated.View style={[animatedStyles]} />
    </>
  );
};

export default SpriteSheetV2;
