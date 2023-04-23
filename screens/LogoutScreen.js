import React, { useContext, useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import UserContext from "../context/UserContext";

const LogoutScreen = ({ navigation }) => {
    const { userState, userLogout } = useContext(UserContext);
    useEffect(() => {
        userLogout();
        navigation.navigate('Login');
    }, []);
    return (
        <SafeAreaView>
            <Text> Çıkış Yapılıyor </Text>
        </SafeAreaView>
    )
}

export default LogoutScreen;