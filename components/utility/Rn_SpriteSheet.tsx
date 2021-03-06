import React from 'react';
import {
  StyleSheet,
  Image,
  Animated,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  Easing,
  Platform,
} from 'react-native';

interface Animation {
  name: string;
  row: number;
  frames?: number;
  startFrame?: number;
  endFrame?: number;
  loop?: boolean;
  reverse?: boolean;
  flipAnimation?: boolean;
  onComplete?: () => void;
}

interface PlayConfig {
  name?: string;
  loop?: boolean;
  iAnims?: InternalAnims;
}

type InternalAnims = {[key: string]: InternalAnim};

interface InternalAnim {
  frames: number;
  in: number[];
  outX: number[];
  outY: number[];
  translateY: number;
  loop: boolean;
  reverse: boolean;
  onComplete?: () => void;
}

const blankIAnim: InternalAnim = {
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
  cols: number;
  rows: number;
  anims: Animation[];
  autoplay?: boolean;
  rate?: number;
  defaultAnim?: string;
  curAnim?: string;
  style?: StyleProp<ViewStyle>;
}

const defaultSize = 1000;
const defaultRate = 30;

interface State {
  time: Animated.Value;
  iAnims: InternalAnims;
  autoplay: boolean;
  curAnim: string;
  height: number;
  width: number;
  loaded: boolean;
}

export class Rn_SpriteSheet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const defAnim = this.props.defaultAnim ?? this.props.anims[0].name;
    const iAnims: InternalAnims = {
      [defAnim]: blankIAnim,
    };

    // Setup initialState with default 0 values
    // + currentAnimation if it exists
    this.state = {
      time: new Animated.Value(0.0),
      iAnims: iAnims,
      curAnim: this.props.curAnim ?? defAnim,
      height: defaultSize,
      width: defaultSize,
      loaded: false,
      autoplay: this.props.autoplay ?? true,
    };
  }

  // Kill animation when component unmounts
  componentWillUnmount() {
    this.stop();
  }

  // Spritesheet animation - control animation state
  play = ({name, loop, iAnims}: PlayConfig) => {
    if (name) {
      this.setState(prev => ({
        ...prev,
        curAnim: name,
      }));
    }

    const anim = (iAnims ?? this.state.iAnims)[
      name ?? this.state.curAnim ?? this.props.defaultAnim
    ];
    const useDriver = Platform.OS === 'android' ? true : false;
    this.state.time.setValue(anim.reverse ? anim.frames - 1 : 0);

    if (loop ?? anim.loop ?? false) {
      Animated.loop(
        Animated.timing(this.state.time, {
          toValue: anim.reverse ? 0 : anim.frames - 1,
          duration: (1000 * anim.frames) / (this.props.rate ?? defaultRate),
          easing: Easing.linear,
          useNativeDriver: useDriver,
        }),
      ).start();
    } else {
      Animated.timing(this.state.time, {
        toValue: anim.reverse ? 0 : anim.frames - 1,
        duration: (1000 * anim.frames) / (this.props.rate ?? defaultRate),
        easing: Easing.linear,
        useNativeDriver: useDriver,
      }).start(({finished}) => {
        if (!finished) return; // if interrupted (e.g. fast refresh), stop looping
        anim.onComplete && anim.onComplete(); // call completion event listener if present
      });
    }
  };

  stop = () => {
    this.state.time.stopAnimation();
  };

  reset = () => {
    this.stop();
    this.state.time.setValue(0);
  };

  genInterpolationRanges = (event: LayoutChangeEvent) => {
    if (this.state.loaded) return;

    const img = Image.resolveAssetSource(this.props.src);
    const layoutHeight = event.nativeEvent.layout.height; // Make height match the layout's height
    const width =
      (img.width / this.props.cols) *
      (layoutHeight / (img.height / this.props.rows));

    const iAnims: InternalAnims = {};
    // Loop over each animation object and create the animation params
    for (let anim of this.props.anims) {
      const nFrames = anim.frames ?? this.props.cols; // default, assume entire row is animation
      const outY = Rn_SpriteSheet.getOutY(
        nFrames,
        this.props.cols,
        layoutHeight,
      );
      let outX = Rn_SpriteSheet.getOutX(nFrames, this.props.cols, width);
      if (anim?.startFrame) {
        // Get the width of each frame
        // let animationFrameWidth = Math.abs(outX[1]); // index 0 will always be 0 so we need to ignore it.
        outX.shift(); // remove first el since it's 0 and our start frame is not 0
        // Get starting X pos for first frame
        let startFrameXPos = outX[0] * anim.startFrame;
        // Grab the rest of the frames and loop over them to get correct X positions.
        let restOfFrames = outX.slice(2);
        // Create new animation frames X positions arr
        let newOutX = [startFrameXPos];
        restOfFrames.map(xVal => {
          newOutX.push(startFrameXPos + xVal);
        });
        // // Add last 2 frames since we removed the initial 0 X-position frame
        newOutX.push(newOutX[newOutX.length - 1] + outX[0]);
        newOutX.push(newOutX[newOutX.length - 2] + outX[0]);
        outX = newOutX;
      }
      // Check if animation is flipped?
      if (anim.flipAnimation) {
        let newOutX = outX.map(xVal => {
          return xVal * -1;
        });
        outX = newOutX;
      }

      const iAnim: InternalAnim = {
        frames: nFrames,
        in: Rn_SpriteSheet.getTimeRange(nFrames),
        outX: outX,
        outY: outY,
        translateY: -anim.row * layoutHeight,
        loop: anim.loop ?? true,
        reverse: anim.reverse ?? false,
        onComplete: anim.onComplete,
      };

      iAnims[anim.name] = iAnim;
    }

    this.setState({
      ...this.state,
      iAnims: iAnims,
      height: layoutHeight,
      width: width,
      loaded: true,
    });

    this.state.autoplay && this.play({iAnims: iAnims});
    console.log(iAnims);
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
                  // {scaleX: -1},
                  {
                    translateX: this.state.time.interpolate({
                      inputRange: this.state.iAnims[this.state.curAnim].in,
                      outputRange: this.state.iAnims[this.state.curAnim].outX,
                    }),
                  },
                  {
                    translateY: Animated.add(
                      this.state.iAnims[this.state.curAnim].translateY,
                      this.state.time.interpolate({
                        inputRange: this.state.iAnims[this.state.curAnim].in,
                        outputRange: this.state.iAnims[this.state.curAnim].outY,
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

  static getTimeRange = (nFrames: number) => {
    return Rn_SpriteSheet.getNumPairs(nFrames).slice(0, 2 * nFrames - 1);
  };

  static getOutX = (nFrames: number, cols: number, width: number) => {
    const outX = Rn_SpriteSheet.getNumPairs(nFrames).map(
      n => -(n % cols) * width,
    );
    outX.shift(); // remove first element to shift phase with time value
    return outX;
  };

  static getOutY = (nFrames: number, cols: number, height: number) => {
    const outY = Rn_SpriteSheet.getNumPairs(nFrames).map(
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
  },
  img: {},
});
