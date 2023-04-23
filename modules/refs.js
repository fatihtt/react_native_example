import React, { useContext } from "react";
import { StyleSheet, Dimensions, Button } from "react-native";
import UserContext from "../context/UserContext";

export const apiUrl = 'https://iskit-serv.herokuapp.com/';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const stLineHeight = deviceHeight / 15;
const stMargin = 10;
const stFontSize = deviceWidth / 25;

export const glbStyle = StyleSheet.create({
    button: {
        width: deviceWidth / 3, height: stLineHeight,
        lineHeight: stLineHeight, textAlign: 'center',
        fontSize: stFontSize,
        margin: stMargin,
        backgroundColor: '#f4a20e',
        alignSelf: 'center'
    },
    txtInput: {
        borderBottomColor: '#f4a20e',
        borderBottomWidth: 1,
        margin: stMargin,
        marginHorizontal: stMargin * 4,
        fontSize: stFontSize,
        paddingVertical: 10,
    },
    txtLine: {
        textShadowColor: 'black',
        textShadowOffset: { width: 0.3, height: 0.3 },
        textShadowRadius: 1,
        margin: stMargin / 3,
        marginHorizontal: stMargin * 2,
        fontSize: stFontSize,
    },
    stUnVisible: {
        display: 'none'
    },
    stVisible: {
    },
    rightSideView: {
        flexDirection: 'row', alignItems: 'center',
    },
    rightSideElement: {
        marginHorizontal: 7,
    },
    stYeniBildirimSayisi: {
        position: 'absolute', top: -7, right: 0, backgroundColor: 'rgba(255, 0, 0, 0.9)',
        padding: 3, fontWeight: 'bold', borderRadius: 7, overflow: "hidden", color: 'white'
    }
});