import React, { useContext, useEffect, useState } from "react";
import { Button, Pressable, SafeAreaView, StyleSheet, Text, View, Dimensions, Alert } from "react-native";
import UserContext from "../context/UserContext";
import moment from "moment/min/moment-with-locales";
import { HeaderBackButton } from "@react-navigation/elements";
import axios from "axios";
import { apiUrl } from "../modules/refs";

const BildirimScreen = ({ navigation }) => {
    moment.locale('tr');


    navigation.setOptions({
        headerLeft: () => (
            <HeaderBackButton label="Açık Talepler" labelVisible={true} onPress={() => navigation.navigate('Talepler')} />
        )
    });

    const { bildirimler, kullaniciID, talepler, kullaniciToken, bildirimGuncelle } = useContext(UserContext);
    const [suzulmusBildirimler, setSuzulmusBildirimler] = useState();

    useEffect(() => {
        if (bildirimler && bildirimler.length > 1) {
            setSuzulmusBildirimler(bildirimler.map((item, index) => {
                //console.log(item);
                if (item.Ilgililer.includes(kullaniciID)) return item;
            }));
        }
    }, [bildirimler]);

    useEffect(() => {
        if (talepler) console.log(talepler.length);
        else console.log("talepler yok");
    }, [talepler]);

    const bildirimeGit = (bildirimID, bildirimsLink, request) => {
        try {
            console.log("bildirimID", bildirimID);
            axios.post(`${apiUrl}bildirim_goruldu_ekle`, {
                bildirimID: bildirimID
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${kullaniciToken}`
                }
            }).then((response) => {
                bildirimGuncelle();
            }).then(() => { navigation.navigate(bildirimsLink, { request }); }).catch((err) => { Alert.alert("Oops", "Hata " + err); });
        } catch (err) {
            Alert.alert("Oops", "Hata " + err);
        }
    }

    return (
        <SafeAreaView>
            <Text>Bildirimler</Text>
            <View>
                {suzulmusBildirimler ? suzulmusBildirimler.map((item, index) => {
                    let request;
                    let bildirimsLink;
                    if (talepler) {
                        request = talepler.find(x => x.ID === item.TalepID);
                        bildirimsLink = request.SonlandirmaSayisi === 0 ? "Talep" : "TalepSonlanmis";
                    }
                    else {
                        request = null;
                        bildirimsLink = 'Talepler';
                    }
                    return (
                        <Pressable key={index} onPress={() => { bildirimeGit(item.ID, bildirimsLink, request); }}>
                            <View style={[styles.stNotif, item.Goruldu != 1 ? styles.stNew : null]}>
                                <Text style={styles.stNotItem}>
                                    {moment(item.Zaman).format('DD MMM, dd HH:mm')}
                                </Text>
                                <Text style={styles.stNotItem}>
                                    {item.Text}
                                </Text>
                            </View>
                        </Pressable>
                    )
                }) : (<Text>Henüz bildirim yok.</Text>)}
            </View>
        </SafeAreaView>
    )
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const stFontSize = deviceWidth / 27;
const styles = StyleSheet.create({
    stNew: {
        backgroundColor: '#f4a20e',
    },
    stNotif: {
        width: deviceWidth - 4,
        height: 80, marginHorizontal: 3, marginVertical: 1, padding: 5, borderWidth: 1, borderColor: 'black',
    },
    stNotItem: {
        fontSize: stFontSize,
        padding: 3,
    }
});

export default BildirimScreen;