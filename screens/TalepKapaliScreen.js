import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { apiUrl } from "../modules/refs";
import UserContext from "../context/UserContext";
import { glbStyle } from "../modules/refs";
import moment from "moment/min/moment-with-locales";
import { Ionicons } from '@expo/vector-icons';


const TalepKapaliScreen = ({ route, navigation }) => {
    moment.locale('tr');


    const { request, talep } = route.params;

    const { userState, kullaniciToken, yeniBildirimSayisi } = useContext(UserContext);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Kapalı Talepler',
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
    }, [yeniBildirimSayisi]);

    const [requestKapatma, setRequestKapatma] = useState(() => {
        try {
            if (!request) throw "Talep tespit edilemedi";
            /*
            {
                "ID": 4,
                "TeknikTalepID": 11,
                "KullaniciID": 1,
                "TeknikOnay": 0,
                "BirimOnay": 0,
                "Aciklama": "",
                "Zaman": "2022-08-01T02:27:18.000Z",
                "MakineDurusSuresi": 2,
                "Degisen": null,
                "Onarilan": null,
                "Kullanici": "fatih"
            }
            */
            axios.post(`${apiUrl}talep_kapama`, {
                talepID: request.ID
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${kullaniciToken}`
                }
            }).then((response) => { setRequestKapatma(response.data[0]) }).catch((err) => { Alert.alert("Oops", "Talep kapatma bilgileri alınırken hata!" + err) })

        } catch (err) {
            Alert.alert("Oops", "Talep kapatma bilgileri alınamadı." + err);
        }
    });

    return (
        <SafeAreaView style={styles.stContentMain}>
            <View style={styles.stViewRow}>
                <Text style={styles.stTextLeft}>Makine:</Text>
                <Text style={styles.stTextRigh}>{request.Talep}</Text>
            </View>
            <View style={styles.stViewRow}>
                <Text style={styles.stTextLeft}>Açıklama:</Text>
                <Text style={styles.stTextRigh}>{request.Aciklama}</Text>
            </View>
            <View style={styles.stViewRow}>
                <Text style={styles.stTextLeft}>Talep Zamanı:</Text>
                <Text style={styles.stTextRigh}>{moment(request.Zaman).format('DD MMM, dd HH:mm')}</Text>
            </View>
            {
                requestKapatma ? (
                    <>
                        <View style={styles.stViewRow}>
                            <Text style={styles.stTextLeft}>Bitiş Zamanı:</Text>
                            <Text style={styles.stTextRigh}>{moment(requestKapatma.Zaman).format('DD MMM, dd HH:mm')}</Text>
                        </View>
                        <View style={styles.stViewRow}>
                            <Text style={styles.stTextLeft}>Bitiş Düzenleyen:</Text>
                            <Text style={styles.stTextRigh}>@{requestKapatma.Kullanici}</Text>
                        </View>
                        <View style={styles.stViewRow}>
                            <Text style={styles.stTextLeft}>Bitiş Açıklama:</Text>
                            <Text style={styles.stTextRigh}>{requestKapatma.Aciklama}</Text>
                        </View>
                        <View style={styles.stViewRow}>
                            <Text style={styles.stTextLeft}>Değişen Parçalar</Text>
                            <Text style={styles.stTextRigh}>{requestKapatma.Degisen ? requestKapatma.Degisen : "-Yok-"}</Text>
                        </View>
                        <View style={styles.stViewRow}>
                            <Text style={styles.stTextLeft}>Onarılan Parçalar</Text>
                            <Text style={styles.stTextRigh}>{requestKapatma.Onarilan ? requestKapatma.Onarilan : "-Yok-"}</Text>
                        </View>
                        <View style={styles.stViewRow}>
                            <Text style={styles.stTextLeft}>Duruş Süresi (saat):</Text>
                            <Text style={styles.stTextRigh}>{requestKapatma.MakineDurusSuresi}</Text>
                        </View>
                    </>
                ) : null
            }
        </SafeAreaView >
    )
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    stContentMain: {
        marginVertical: 30, maxWidth: deviceWidth,
    },
    stViewRow: {
        flexDirection: 'row', maxWidth: deviceWidth,
    },
    stTextLeft: {
        minWidth: 120, margin: 5,
    },
    stTextRigh: {
        flex: 1, margin: 5,
    }
});

export default TalepKapaliScreen;