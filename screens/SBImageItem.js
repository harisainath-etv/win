import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Image,
    Dimensions
} from 'react-native';

export const height = Dimensions.get('window').height;
export const SBImageItem = ({
    style,
    index: _index,
}) => {
    const index = (_index || 0) + 1;
    
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size="small" />
            <Image key={index} style={styles.image} source={require('../assets/images/beauty.png')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width:'100%',
        height: '100%'
    },
});