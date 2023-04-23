import React from "react";
import { View, StyleSheet, Dimensions, Image, Text } from "react-native";
import { glbStyle } from "./refs";

export const Roller = (props) => {
    return (
        <View style={props.splash ? styles.stView : glbStyle.stUnVisible}>
            <Image style={styles.stImage} source={require("../assets/splash.png")} />
        </View>
    )
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    stView: {
        position: 'absolute',
        left: 0, top: 0, width: deviceWidth, height: deviceHeight, zIndex: 101,
    },
    stImage: {
        width: deviceWidth, height: deviceHeight,
    }
})