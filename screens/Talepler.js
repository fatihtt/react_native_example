import React, { useState, useContext, useEffect } from "react";
import { View, Text, SafeAreaView, Pressable, Alert, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import UserContext from "../context/UserContext";
import axios from "axios";
import { apiUrl, glbStyle } from "../modules/refs";
import moment from "moment/min/moment-with-locales";
import { useFocusEffect } from "@react-navigation/native";
import { Roller } from "../modules/Roller";
import { Ionicons } from '@expo/vector-icons';

const TaleplerScreen = ({ navigation }) => {
    const aciklamaCharLimit = 30;
    const yeniTalepYetkililer = ['birimsef', 'yonetim', "makenmudur"];
    const tumTalepYetkililer = ['birimsef', 'yonetim', 'makenmudur', 'makensef'];
    moment.locale('tr');

    const { splashState, changeSplash, kullaniciGirdi, kullaniciToken, kullaniciRol, yeniBildirimSayisi, setTalepler } = useContext(UserContext);

    const [requests, setRequests] = useState();

    const [refreshButtonVis, setRefreshButtonVis] = useState(true);

    useEffect(() => {
        if (!kullaniciGirdi) navigation.navigate('Login');
    }, [kullaniciGirdi]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (

                <Pressable style={refreshButtonVis ? glbStyle.stVisible : glbStyle.stUnVisible} onPress={() => { changeSplash(true); setRefreshButtonVis(false); talepleriAl() }}>
                    <Ionicons name="ios-refresh-circle-sharp" size={28} color="black" />
                </Pressable>),
            headerTitle: 'Açık Talepler',
            headerRight: () => (
                <View style={glbStyle.rightSideView}>
                    <Pressable style={glbStyle.rightSideElement} onPress={() => navigation.navigate('Bildirim')}>
                        <Ionicons name="notifications" size={28} color="black" />
                        {
                            yeniBildirimSayisi > 0 ? (
                                <Text style={glbStyle.stYeniBildirimSayisi}>{yeniBildirimSayisi}</Text>
                            ) : null
                        }
                    </Pressable>
                    <Pressable style={glbStyle.rightSideElement} onPress={() => navigation.navigate('Logout')}>
                        <Text>Çıkış</Text>
                    </Pressable>
                </View>
            )
        });
    }, [yeniBildirimSayisi, refreshButtonVis]);

    useFocusEffect(
        React.useCallback(() => {
            //setRefreshButtonVis(true);
            talepleriAl();
        }, [])
    );

    const talepleriAl = () => {
        try {
            axios.get(`${apiUrl}talep_listele`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${kullaniciToken}`
                }
            }).then((response) => {
                setRefreshButtonVis(true);
                if (response) {
                    setRequests(response.data);
                    setTalepler(response.data);
                    changeSplash(false);
                } else {
                    throw "talep listeleme basarisiz";
                }
            })
        } catch (err) {
            Alert.alert("oh no!", err);
            console.log(err);
        }
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerBackVisible: false
        });
    });

    return (
        <SafeAreaView>
            <Roller splash={splashState} />
            <ScrollView style={(tumTalepYetkililer.includes(kullaniciRol) || yeniTalepYetkililer.includes(kullaniciRol)) ? styles.stTalepScroll : styles.stTalepScroll2}>
                <View style={styles.stTalepContentView}>
                    {requests ? requests.map((request, index) => {
                        if (request.SonlandirmaSayisi === 0)
                            return (
                                <Pressable key={index} onPress={() => navigation.navigate('Talep', { request })}>
                                    <View style={styles.stTalepView}>
                                        <Text style={styles.stTalepMakine} >{request.Talep}</Text>
                                        <Text>{moment(request.Zaman).format('DD MMM, dd HH:mm')}</Text>
                                        <Text>{request.Aciklama.length < aciklamaCharLimit ? request.Aciklama : request.Aciklama.substr(0, aciklamaCharLimit) + "..."}</Text>
                                    </View>
                                </Pressable>
                            )
                    }) : null}
                </View>
            </ScrollView>
            <View style={styles.stViewFoot}>
                {
                    (yeniTalepYetkililer.includes(kullaniciRol)) ? (
                        <View>
                            <Pressable onPress={() => navigation.navigate('TalepOlustur')}>
                                <Text style={styles.stLinkText}>Yeni Talep Oluştur</Text>
                            </Pressable>
                        </View>
                    ) : null
                }
                {
                    (tumTalepYetkililer.includes(kullaniciRol)) ? (
                        <View>
                            <Pressable onPress={() => navigation.navigate('TalepTumu', { requests })}>
                                <Text style={styles.stLinkText}>Kapalı Talepler</Text>
                            </Pressable>
                        </View>
                    ) : null
                }
            </View>
        </SafeAreaView>
    )
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    stTalepScroll: {
        height: deviceHeight - 190,
    },
    stTalepScroll2: {
        height: deviceHeight - 10
    },
    stTalepContentView: {
        flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5,
    },
    stTalepView: {
        width: deviceWidth / 2.2,
        height: deviceHeight / 6,
        alignSelf: 'flex-start',
        backgroundColor: '#bab0b1',
        margin: 5,
        padding: 5,
        borderRadius: 5,
    },
    stTalepMakine: {
        fontSize: deviceWidth / 20,
        paddingBottom: 10, fontWeight: 'bold'
    },
    stLinkText: {
        fontSize: deviceWidth / 20, width: deviceWidth / 2.2, textAlign: 'center',
        backgroundColor: '#01305c', color: '#f4a20e', margin: 10, padding: 10, paddingVertical: 15,
    },
    stViewFoot: {
        flexDirection: 'row', width: deviceWidth - 150,
    },
    stRefreshImage: {
        width: 30, height: 30, marginRight: 30,
    },
})

export default TaleplerScreen;