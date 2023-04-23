import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { Button, Text, SafeAreaView, View, Alert, TextInput, Pressable, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import UserContext from "../context/UserContext";
import moment from "moment/min/moment-with-locales";
import { apiUrl } from "../modules/refs";
import axios from "axios";
import { glbStyle } from "../modules/refs";
import { Roller } from "../modules/Roller";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const TalepScreen = ({ route, navigation }) => {
    const gelismeEklemeYetkililer = ["makenmudur", "makenusta", "makensef"];
    const talepKapamaYetkililer = ["makensef", "makenmudur"];
    moment.locale('tr');

    const { splashState, changeSplash, kullaniciToken, kullaniciRol, yeniBildirimSayisi } = useContext(UserContext);

    const { request } = route.params;

    const [gelismeler, setGelismeler] = useState();

    useFocusEffect(
        React.useCallback(() => {
            changeSplash(true);
            gelismeAl();
        }, [])
    );


    // right header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: `Talep Detay #${request.ID}`,
            headerRight: () => (
                <View style={glbStyle.rightSideView}>

                    <Pressable style={glbStyle.rightSideElement} onPress={() => navigation.navigate('Logout')}>
                        <Text>Çıkış</Text>
                    </Pressable>
                </View>
            )
        });
    }, [yeniBildirimSayisi]);

    const gelismeAl = () => {
        try {
            axios.post(`${apiUrl}talep_gelismeler`, {
                ygTalepID: request.ID
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${kullaniciToken}`
                }
            }).then((response) => {
                setRefreshButtonStyle(true);
                if (response) {
                    setGelismeler(response.data);
                    changeSplash(false);
                    setGelismeLoading(false);
                } else {
                    throw "talep listeleme basarisiz";
                }
            });
        } catch (err) {
            Alert.alert("oh no!", err);
            console.log(err);
        }
    }

    const [yeniGelisme, setYeniGelisme] = useState();

    const yeniGelismeEkle = () => {
        try {
            if (yeniGelisme.length < 3) return Alert.alert("Hey!", "Yeni durum için açıklama giriniz");

            axios.post(`${apiUrl}yeni_talep_gelisme_g`, {
                ygTalepID: request.ID,
                ygGelismeAciklama: `"${yeniGelisme}"`
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${kullaniciToken}`
                }
            }).then((response) => {
                setGelismeler(response.data);
                Alert.alert("Wow", "Kayıt başarılı");
                setYeniGelisme('');
                changeSplash(false);
            }).catch((err) => alert(err));
        } catch (err) {
            alert(err);
        }
    }

    const [kptAciklama, setKptAciklama] = useState('');
    const [kptDegisen, setKptDegisen] = useState('');
    const [kptOnarilan, setKptOnarilan] = useState('');
    const [kptDurusSuresi, setKptDurusSuresi] = useState('');

    const talebiKapat = () => {
        try {
            if (!(kptAciklama && kptDurusSuresi && kptAciklama.length > 3)) throw 'açıklama ve duruş süresi';
            axios.post(`${apiUrl}yeni_talep_sonlandirma_g`, {
                ysTeknikTalepID: request.ID,
                ysAciklama: kptAciklama,
                ysMakineDurusSuresi: kptDurusSuresi,
                ysDegisen: kptDegisen,
                ysOnarilan: kptOnarilan
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${kullaniciToken}`
                }
            }).then((response) => {
                if (response.data === "kayıt başarılı") {
                    setKptAciklama(""); setKptDegisen(""); setKptOnarilan(""); setKptDurusSuresi("");
                    navigation.navigate('Talepler');
                }
                else alert(response.data);
            }).catch((err) => Alert.alert("Oopss!", "Hata" + err));

        } catch (err) {
            Alert.alert("Oops!", "Hata" + err);
        }
    }
    const [refreshButtonStyle, setRefreshButtonStyle] = useState(true);
    const [gelismeStyle, setGelismeStyle] = useState(styles.stVisible);
    const [stTalepKapama, setStTalepKapama] = useState(styles.stInVisible);
    const toggleSonlandir = () => {
        if (stTalepKapama === styles.stVisible) {
            setGelismeStyle(styles.stVisible); setStTalepKapama(styles.stInVisible);
        } else { setGelismeStyle(styles.stInVisible); setStTalepKapama(styles.stVisible); }
    }

    const [gelismeLoading, setGelismeLoading] = useState(true);
    return (
        <SafeAreaView>
            <Roller splash={splashState} />
            <View>
                <Text style={styles.stSectionHeader}>TALEP:</Text>
            </View>
            <View>
                <Text style={glbStyle.txtLine}>{request.Talep}</Text>
                <Text style={glbStyle.txtLine}>{`@${request.KaydedenKullanici}`}</Text>
                <Text style={glbStyle.txtLine}>{request.Aciklama}</Text>
                <Text style={glbStyle.txtLine}>{moment(request.Zaman).format('DD MMM, dd HH:mm')}</Text>
            </View>
            <View style={gelismeStyle}>
                <View style={styles.stGelismeView}>
                    <Text style={styles.stSectionHeader}>GELİŞMELER:</Text>
                    <Pressable style={refreshButtonStyle ? glbStyle.stVisible : glbStyle.stUnVisible} onPress={() => { setRefreshButtonStyle(false); setGelismeLoading(true); gelismeAl(); }}>
                        <Ionicons name="ios-refresh-circle-sharp" size={28} color="black" />
                    </Pressable>
                </View>
                <ScrollView style={styles.stScrollGelismeler}>
                    {gelismeLoading ? (<ActivityIndicator size="large" />) : null}
                    {
                        (gelismeler && gelismeler.length > 0) ? gelismeler.map((gelisme, index) => {
                            return (
                                <View key={gelisme.ID}>
                                    {(index === 0 || (moment(gelismeler[index - 1].Zaman).format("DD MMMM") !== moment(gelisme.Zaman).format("DD MMMM"))) ?
                                        <View>
                                            <Text style={styles.stGelismeTarih}>{moment(gelisme.Zaman).format("DD MMMM")}</Text>
                                        </View> : null
                                    }
                                    <View style={styles.gelismeLine}>
                                        <Text style={styles.txtLine}>{(moment(gelisme.Zaman).format("HH:mm"))}</Text>
                                        <Text style={styles.txtLine}>@{gelisme.Gonderen}</Text>
                                        <Text style={styles.txtLine}>{gelisme.Aciklama}</Text>
                                    </View>
                                </View >
                            )
                        }
                        ) : <Text>Henüz gelişme yok</Text>
                    }
                </ScrollView>
                {
                    gelismeEklemeYetkililer.includes(kullaniciRol) ? (
                        <View>
                            <Text style={styles.stGelismeTarih}>Yeni Gelişme:</Text>
                            <TextInput style={styles.stYeniGelismeInput} placeholder="yeni gelişme" value={yeniGelisme} onChangeText={(yt) => setYeniGelisme(yt)} />
                            <Pressable onPress={() => { changeSplash(true); yeniGelismeEkle(); }}><Text style={glbStyle.button}>Ekle</Text></Pressable>
                            {
                                talepKapamaYetkililer.includes(kullaniciRol) ? (
                                    <Button title=">> Talebi Kapat" onPress={toggleSonlandir} />
                                ) : null
                            }
                        </View>
                    ) : null
                }
            </View>
            <View style={stTalepKapama}>
                {
                    talepKapamaYetkililer.includes(kullaniciRol) ? (
                        <>
                            <Pressable><Text style={styles.stSectionHeader}>TALEP KAPATMA</Text></Pressable>
                            <View>
                                <TextInput style={glbStyle.txtInput} value={kptAciklama} onChangeText={setKptAciklama} placeholder="**açıklama" />
                                <TextInput style={glbStyle.txtInput} value={kptDegisen} onChangeText={setKptDegisen} placeholder="değişen" />
                                <TextInput style={glbStyle.txtInput} value={kptOnarilan} onChangeText={setKptOnarilan} placeholder="onarılan" />
                                <TextInput style={glbStyle.txtInput} value={kptDurusSuresi} onChangeText={setKptDurusSuresi} placeholder="**duruş süresi (saat)" />
                                <View style={styles.twoButton}>
                                    <Pressable onPress={() => talebiKapat()}><Text style={glbStyle.button}>Kaydet</Text></Pressable>
                                    <Pressable onPress={() => toggleSonlandir()}><Text style={glbStyle.button}>İptal</Text></Pressable>
                                </View>
                            </View>
                        </>
                    ) : null
                }
            </View>
        </SafeAreaView>
    )
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const stFontSize = deviceWidth / 25;

const styles = StyleSheet.create({
    stSectionHeader: {
        fontSize: stFontSize * 1.3,
        fontWeight: 'bold',
        margin: deviceWidth / 50,
    },
    stGelismeTarih: {
        fontSize: stFontSize * 1.1,
        fontWeight: 'bold',
        margin: deviceWidth / 40,
    },
    stGelismeBaslik: {
        fontSize: stFontSize * 1.1,
        fontWeight: 'bold',
    },
    stYeniGelismeInput: {
        borderBottomColor: '#f4a20e',
        borderBottomWidth: 1,
        marginHorizontal: 30,
        fontSize: stFontSize,
        padding: 5
    },
    stScrollGelismeler: {
        maxHeight: deviceHeight * 0.37,
    },
    stInVisible: {
        display: 'none',
    },
    stVisible: {
    },
    twoButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    stButton: {
        paddingBottom: 50,
    },
    txtLine: {
        margin: 3,
        marginHorizontal: 2,
        fontSize: stFontSize,
        flexWrap: 'wrap'
    },
    gelismeLine: {
        flexDirection: 'row', marginHorizontal: 5, width: deviceWidth - 110,
    },
    stRefreshImage: {
        width: 20, height: 20,
    },
    stGelismeView: {
        flexDirection: 'row', alignItems: 'center'
    }
});

export default TalepScreen;