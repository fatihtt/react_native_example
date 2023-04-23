import React, { useContext, useEffect, useState } from "react";
import { Pressable, Text, TextInput, View, Alert, SafeAreaView, StyleSheet, Dimensions } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import UserContext from "../context/UserContext";
import { apiUrl } from "../modules/refs";
import axios from "axios";
import { glbStyle } from "../modules/refs";
import { Roller } from "../modules/Roller";
import { Ionicons } from '@expo/vector-icons';

const TalepOlusturScreen = ({ navigation }) => {
    const secimeIzinVerilmeyenler = ['birimsef'];

    const { userState, splashState, changeSplash, kullaniciToken, kullaniciRol, kullaniciBirim, kullaniciAdi, yeniBildirimSayisi } = useContext(UserContext);

    const [dropDownDisable, setDropDownDisable] = useState(null);
    const [birimler, setBirimler] = useState(() => {
        axios.get(`${apiUrl}birimler`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${kullaniciToken}`
            }
        }).then((response) => { setBirimler(response.data) }).catch(() => Alert.alert('Oops!', 'Birimleri alırken hata oluştu'));
    });
    const [seciliBirimID, setSeciliBirimID] = useState();

    useEffect(() => {
        navigation.setOptions({
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

    useEffect(() => {
        if (secimeIzinVerilmeyenler.includes(kullaniciRol)) {
            setSeciliBirimID(kullaniciBirim);
            setDropDownDisable('disable');
        }
    }, []);

    const [makineTechizat, setMakineTechizat] = useState(null);
    const [talepAciklama, setTalepAciklama] = useState(null)

    const talepEkle = () => {
        console.log(seciliBirimID, makineTechizat, talepAciklama, kullaniciToken);
        try {
            // ytBirimID, ytTalepBasligi, ytTalepAciklama
            console.log(seciliBirimID);
            const ytBirimID = seciliBirimID;
            const ytTalepBasligi = makineTechizat;
            const ytTalepAciklama = talepAciklama;

            if (!ytBirimID || !ytTalepBasligi || !ytTalepAciklama) throw 'birim, makine veya açıklama okunamadı!';

            axios.post(`${apiUrl}yeni_talep_g`, {
                ytBirimID,
                ytTalepBasligi,
                ytTalepAciklama
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${kullaniciToken}`
                }
            }).then((response) => {
                changeSplash(false);
                Alert.alert('Wow!', "Kayıt başarılı!");
                navigation.navigate('Talepler');
            }).catch((err) => { changeSplash(false); Alert.alert('Oops!', `Talep kaydı sırasında hata! ${err}`) });

        } catch (err) {
            changeSplash(false);
            Alert.alert('Oops!', `Talep eklerken hata oluştu! ${err}`);
        }
    }

    return (
        <SafeAreaView>
            <Roller splash={splashState} />
            <View>
                <Dropdown
                    disable={dropDownDisable}
                    placeholder='Birim seçiniz...'
                    data={birimler}
                    labelField='BirimAdi'
                    valueField='ID'
                    value={seciliBirimID}
                    onChange={item => {
                        setSeciliBirimID(item.ID);
                    }}
                    style={styles.stDropDown}

                />
                <TextInput editable={false} style={glbStyle.txtInput} >@{kullaniciAdi}</TextInput>
                <TextInput style={glbStyle.txtInput} value={makineTechizat} onChangeText={setMakineTechizat} placeholder='Makine / Teçhizat' />
                <TextInput style={glbStyle.txtInput} value={talepAciklama} onChangeText={setTalepAciklama} placeholder='Açıklama' />
                <Pressable onPress={() => { changeSplash(true); talepEkle() }}><Text style={glbStyle.button} >Kaydet</Text></Pressable>
            </View>
        </SafeAreaView>
    )
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    stDropDown: {
        margin: 10,
        marginHorizontal: 40,
        paddingVertical: 10,
        borderColor: '#f4a20e', borderBottomWidth: 1,
    }
});

export default TalepOlusturScreen;
