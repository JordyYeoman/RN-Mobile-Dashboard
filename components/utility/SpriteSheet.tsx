import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  Easing,
  Image,
} from 'react-native';

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
  time: Animated.Value;
  internalAnimations: InternalAnimations;
  autoplay: boolean;
  currentAnimation: string;
  height: number;
  width: number;
  loaded: boolean;
}

export class SpriteSheet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const defaultAnimation =
      this.props.defaultAnimation ?? this.props.animations[0].name;

    const internalAnimations: InternalAnimations = {
      [defaultAnimation]: blankInternalAnimation,
    };

    this.state = {
      time: new Animated.Value(0.0),
      internalAnimations: internalAnimations,
      currentAnimation: defaultAnimation,
      height: defaultSize,
      width: defaultSize,
      loaded: false,
      autoplay: this.props.autoplay ?? true,
    };
  }

  componentWillUnmount() {
    this.stop();
  }

  play = ({name, loop, internalAnimations}: PlayConfig) => {
    if (name) {
      this.setState(prev => ({
        ...prev,
        currentAnimation: name,
      }));
    }

    const anim = (internalAnimations ?? this.state.internalAnimations)[
      name ?? this.state.currentAnimation ?? this.props.defaultAnimation
    ];
    this.state.time.setValue(anim.reverse ? anim.frames - 1 : 0);

    if (loop ?? anim.loop ?? false) {
      Animated.loop(
        Animated.timing(this.state.time, {
          toValue: anim.reverse ? 0 : anim.frames - 1,
          duration: (1000 * anim.frames) / (this.props.rate ?? defaultRate),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      Animated.timing(this.state.time, {
        toValue: anim.reverse ? 0 : anim.frames - 1,
        duration: (1000 * anim.frames) / (this.props.rate ?? defaultRate),
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (!finished) {
          return;
        } // if interrupted (e.g. fast refresh), stop looping
        anim.onComplete && anim.onComplete(); // call completion event listener if present
      });
    }
  };

  stop() {
    this.state.time.stopAnimation();
  }

  reset = () => {
    this.stop();
    this.state.time.setValue(0);
  };

  // When component mounts and updates, calculate container values
  genInterpolationRanges = (event: LayoutChangeEvent) => {
    if (this.state.loaded) {
      return;
    }

    const img = Image.resolveAssetSource(this.props.src);
    console.log('img: ', img);
    const layoutHeight = event.nativeEvent.layout.height; // Make height match the layout's height
    const width =
      (img.width / this.props.cols) *
      (layoutHeight / (img.height / this.props.rows));

    const internalAnimations: InternalAnimations = {};
    for (let anim of this.props.animations) {
      const nFrames = anim.frames ?? this.props.cols; // default, assume entire row is animation

      const internalAnimation: InternalAnimation = {
        frames: nFrames,
        in: SpriteSheet.getTimeRange(nFrames),
        outX: SpriteSheet.getOutX(nFrames, this.props.cols, width),
        outY: SpriteSheet.getOutY(nFrames, this.props.cols, layoutHeight),
        translateY: anim.row * layoutHeight,
        loop: anim.loop ?? true,
        reverse: anim.reverse ?? false,
        onComplete: anim.onComplete,
      };

      internalAnimations[anim.name] = internalAnimation;
    }

    this.setState({
      ...this.state,
      internalAnimations: internalAnimations,
      height: layoutHeight,
      width: width,
      loaded: true,
    });

    this.state.autoplay && this.play({internalAnimations: internalAnimations});
  };

  render() {
    return (
      <Animated.View
        style={[styles.container, this.props.style]}
        onLayout={this.genInterpolationRanges}>
        {
          <Animated.Image
            source={this.props.src}
            style={[
              styles.img,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                opacity: this.state.loaded ? 1.0 : 0.0,
                height: this.state.height * this.props.rows,
                width: this.state.width * this.props.cols,
                transform: [
                  {
                    translateX: this.state.time.interpolate({
                      inputRange:
                        this.state.internalAnimations[
                          this.state.currentAnimation
                        ].in,
                      outputRange:
                        this.state.internalAnimations[
                          this.state.currentAnimation
                        ].outX,
                    }),
                  },
                  {
                    translateY: Animated.add(
                      this.state.internalAnimations[this.state.currentAnimation]
                        .translateY,
                      this.state.time.interpolate({
                        inputRange:
                          this.state.internalAnimations[
                            this.state.currentAnimation
                          ].in,
                        outputRange:
                          this.state.internalAnimations[
                            this.state.currentAnimation
                          ].outY,
                      }),
                    ),
                  },
                ],
              },
            ]}
          />
        }
      </Animated.View>
    );
  }

  // Helper methods
  static getTimeRange = (nFrames: number) => {
    return SpriteSheet.getNumPairs(nFrames).slice(0, 2 * nFrames - 1);
  };

  static getOutX = (nFrames: number, cols: number, width: number) => {
    const outX = SpriteSheet.getNumPairs(nFrames).map(n => -(n % cols) * width);
    outX.shift(); // remove first element to shift phase with time value
    return outX;
  };

  static getOutY = (nFrames: number, cols: number, height: number) => {
    const outY = SpriteSheet.getNumPairs(nFrames).map(
      n => -Math.floor(n / cols) * height,
    );
    outY.shift(); // remove first element to shift phase with time value
    return outY;
  };

  static getNumPairs = (length: number) => {
    let arr: number[] = [];
    for (let i = 0; i < length; i += 1) {
      arr = arr.concat([i, i]);
    }
    return arr;
  };
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'skyblue',
  },
  img: {
    resizeMode: 'cover',
  },
});

export default SpriteSheet;
