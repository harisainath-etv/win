import React from 'react';
import { LongPressGestureHandler } from 'react-native-gesture-handler';
import { SBImageItem } from './SBImageItem';
import Animated from 'react-native-reanimated';

export const SBItem = (props) => {
    const { style, index, pretty, ...animatedViewProps } = props;
    return (
        <LongPressGestureHandler>
            <Animated.View style={{ flex: 1 }} {...animatedViewProps}>
                    <SBImageItem style={style} index={index} />
            </Animated.View>
        </LongPressGestureHandler>
    );
};