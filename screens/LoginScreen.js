import React, { useContext, useEffect, useState } from "react";
import { Text, SafeAreaView, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import UserContext from "../context/UserContext";
import { glbStyle } from "../modules/refs";
import { useFocusEffect } from "@react-navigation/native";
import { Roller } from "../modules/Roller";

const LoginScreen = ({ navigation }) => {
    const { userState, userLogin, userLogout, tryLocalSignin, splashState, changeSplash, kullaniciGirdi } = useContext(UserContext);

    useEffect(() => {
        navigation.navigate('Talepler');
    }, [kullaniciGirdi]);

    useFocusEffect(
        React.useCallback(() => {
            if (kullaniciGirdi) navigation.navigate('Talepler');
            else {
                changeSplash(true);
                tryLocalSignin(navigation);
            }
        }, [])
    );

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return (
        <SafeAreaView>
            <Roller splash={splashState} />
            <TextInput autoCorrect={false} style={glbStyle.txtInput} placeholder='E - Mail' value={email} onChangeText={(vl) => setEmail(vl)} />
            <TextInput autoCorrect={false} secureTextEntry={true} style={glbStyle.txtInput} placeholder='şifre' value={password} onChangeText={(vl) => setPassword(vl)} />
            <Pressable onPress={() => { userLogin(email, password); }}>
                <Text style={glbStyle.button}>Giriş</Text>
            </Pressable>
            <Pressable style={glbStyle.stUnVisible} onPress={() => tryLocalSignin()}>
                <Text>Bana tıkla asynstor var mı gör</Text>
            </Pressable>
            <Pressable style={glbStyle.stUnVisible} onPress={() => userLogout()}>
                <Text>Bana tıkla logout yap</Text>
            </Pressable>
            <Pressable style={glbStyle.stUnVisible} onPress={() => navigation.navigate('Talepler')}>
                <Text>Bana tıkla taleplere geç</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

});

export default LoginScreen;