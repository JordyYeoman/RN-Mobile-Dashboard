import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';

interface Animation {
  name: string;
  row: number;
  frames?: number;
}

interface Props {
  src: any;
  rows?: number;
  cols: number;
  frameRate?: number;
  defaultAnimation: string;
  animations: Animation[];
  style?: StyleProp<ViewStyle>;
  frameHeight?: number;
  frameWidth?: number;
}

type InternalAnimations = {[key: string]: InternalAnimation};

interface InternalAnimation {
  frames: number;
  input: number[];
  output: number[];
  translateY: number;
}

interface State {
  time: Animated.Value;
  internalAnimations: InternalAnimations;
  currentAnimation: string;
  height: number;
  width: number;
  loaded: boolean;
  playing: boolean;
}

// Defaults - could be passed as props
const defaultFrameHeight: number = 150;
const defaultFrameWidth: number = 100;

const blankInternalAnimation: InternalAnimation = {
  frames: 0,
  input: [0, 0],
  output: [0, 0],
  translateY: 0,
};

// const defaultProps: Partial<Props> = {
//   rows: 1,
// };

export class SpriteSheet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const internalAnimations: InternalAnimations = {
      [this.props.defaultAnimation]: blankInternalAnimation,
    };

    this.state = {
      time: new Animated.Value(1.0),
      internalAnimations: internalAnimations,
      currentAnimation: this.props.defaultAnimation,
      height: this.props.frameHeight ?? defaultFrameHeight,
      width: this.props.frameWidth ?? defaultFrameWidth,
      loaded: false,
      playing: false,
    };
  }

  play() {
    this.state.time.setValue(0);

    Animated.timing(this.state.time, {
      toValue:
        this.state.internalAnimations[this.state.currentAnimation].frames - 1,
      duration: 250,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (!finished) {
        return;
      }
      if (!this.state.playing) {
        this.setState(prevState => ({
          ...prevState,
          playing: true,
        }));
      }
      // Loop animation by calling recursively
      this.play();
    });
  }

  stop() {
    this.state.time.stopAnimation();
  }

  // When component mounts and updates, calculate container values
  generateInterpolationRanges = (event: LayoutChangeEvent) => {
    if (this.state.loaded) {
      return;
    }

    const frameHeight = event.nativeEvent.layout.height;
    // const spriteSheetWidth = event.nativeEvent.layout.width;
    console.log('This is frame height: ', frameHeight);
    // console.log('this is spriteSheetWidth: ', spriteSheetWidth);
    // Generate data for animation frame loop
    const internalAnimations: InternalAnimations = {};
    for (let animation of this.props.animations) {
      const nFrames = animation.frames ?? this.props.cols;

      const internalAnimation: InternalAnimation = {
        frames: nFrames,
        input: getNumPairs(nFrames).slice(0, 2 * nFrames - 1),
        output: [0]
          .concat(getNumPairs(nFrames - 1))
          .map(i => -(i + 1) * frameHeight),
        translateY: animation.row * frameHeight,
      };

      internalAnimations[animation.name] = internalAnimation;
      console.log('InternalAnimation: ', internalAnimations['run']);
    }

    this.setState({
      ...this.state,
      internalAnimations: internalAnimations,
      height: frameHeight,
      width: frameHeight,
      loaded: true,
    });

    this.play();
  };

  render() {
    return (
      <View
        style={[styles.container, this.props.style]}
        onLayout={this.generateInterpolationRanges}>
        <Animated.Image
          source={this.props.src}
          style={[
            styles.img,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              opacity: this.state.loaded ? 1.0 : 0.0,
              height: this.state.height,
              width: this.state.width * this.props.cols,
              transform: [
                {
                  translateX: this.state.time.interpolate({
                    inputRange:
                      this.state.internalAnimations[this.state.currentAnimation]
                        .input,
                    outputRange:
                      this.state.internalAnimations[this.state.currentAnimation]
                        .output,
                  }),
                },
                {
                  translateY:
                    this.state.internalAnimations[this.state.currentAnimation]
                      .translateY,
                },
              ],
            },
          ]}
        />
      </View>
    );
  }
}

const getNumPairs = (length: number) => {
  const arr: number[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(i);
    arr.push(i);
  }
  return arr;
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'skyblue',
  },
  img: {
    resizeMode: 'contain',
  },
});

export default SpriteSheet;
