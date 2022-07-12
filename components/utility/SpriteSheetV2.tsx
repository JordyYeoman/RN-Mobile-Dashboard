import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import React, {useState} from 'react';

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

function SpriteSheetV2({defaultAnimation}: {defaultAnimation: string}) {
  const offset = useSharedValue(0);
  const [time, setTime] = useState(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value * 255}],
    };
  });

  // Setup
  const internalAnimations: InternalAnimations = {
    [defaultAnimation]: blankInternalAnimation,
  };

  return (
    <>
      <Animated.View style={[animatedStyles]} />
    </>
  );
}

export default SpriteSheetV2;
