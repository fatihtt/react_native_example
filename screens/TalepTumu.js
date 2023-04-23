import React, { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View, Alert, Dimensions, ScrollView } from "react-native";
import UserContext from "../context/UserContext";
import moment from "moment/min/moment-with-locales";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { glbStyle } from "../modules/refs";
import { Ionicons } from '@expo/vector-icons';

const TalepTumuScreen = ({ route, navigation }) => {

    const aciklamaCharLimit = 15;
    const { requests } = route.params;
    const requests2 = requests.filter(function (item) {
        return item.SonlandirmaZamani != null
    });
    let requestsShorted = requests;
    moment.locale('tr');

    const { yeniBildirimSayisi } = useContext(UserContext);

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

    LocaleConfig.locales['tr'] = {
        monthNames: [
            'Ocak',
            'Şubat',
            'Mart',
            'Nisan',
            'Mayıs',
            'Haziran',
            'Temmuz',
            'Ağustos',
            'Eylül',
            'Ekim',
            'Kasım',
            'Aralık'
        ],
        monthNamesShort: ['Ock', 'Şub', 'Mrt', 'Nis', 'May', 'Haz', 'Tem', 'Ağs', 'Eyl', 'Eki', 'Kas', 'Ara'],
        dayNames: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
        dayNamesShort: ['Pzt', 'Sl', 'Çrş', 'Prş', 'Cu', 'Cts', 'Pz'],
        today: "Bugün"
    };
    LocaleConfig.defaultLocale = 'tr';

    const [curMonth, setCurMonth] = useState();

    useEffect(() => { applyFilter("Tümü") }, []);


    //filtreleme
    const filtreSecenekler = ["Tümü", "Son 1 Gün", "Son 7 Gün", "Son 30 Gün"];
    const [curFilter, setCurFilter] = useState("Tümü");
    const [filteredRequests, setFilteredRequests] = useState(requests);
    let filtreSecenekCounts = filtreSecenekler.map((item, index) => {
        let s;
        switch (index) {
            case 0:
                s = requests2.length;
                break;
            case 1:
                s = requests2.filter(function (item) {
                    return moment(item.SonlandirmaZamani) > (moment(new Date()).subtract(1, 'days'));
                }).length;
                break;
            case 2:
                s = requests2.filter(function (item) {
                    return moment(item.SonlandirmaZamani) > (moment(new Date()).subtract(7, 'days'));
                }).length;
                break;
            case 3:
                s = requests2.filter(function (item) {
                    return moment(item.SonlandirmaZamani) > (moment(new Date()).subtract(30, 'days'));
                }).length;
                break;
        }
        return s;
    });
    const applyFilter = (criterion) => {
        let filtered;
        switch (criterion) {
            case filtreSecenekler[0]:
                setFilteredRequests(requests2);
                break;
            case filtreSecenekler[1]:
                filtered = requests2.filter(function (item) {
                    return moment(item.SonlandirmaZamani) > (moment(new Date()).subtract(1, 'days'));
                });
                setFilteredRequests(filtered);
                break;
            case filtreSecenekler[2]:
                filtered = requests2.filter(function (item) {
                    return moment(item.SonlandirmaZamani) > (moment(new Date()).subtract(7, 'days'));
                });
                setFilteredRequests(filtered);
                break;
            case filtreSecenekler[3]:
                filtered = requests2.filter(function (item) {
                    return moment(item.SonlandirmaZamani) > (moment(new Date()).subtract(30, 'days'));
                });
                setFilteredRequests(filtered);
                break;
            default:
                //
                setFilteredRequests(requests2);
        }
    }

    const [filterButtonStyles, setFilterButtonStyles] = useState(() => {
        return filtreSecenekler.map((item, index) => { return 0 === index ? styles.filterElement : styles.filterElement2 });
    });
    const filterButtonPressed = (indexx) => {
        setFilterButtonStyles(filtreSecenekler.map((item, index) => { return indexx === index ? styles.filterElement : styles.filterElement2 }));
    }

    return (
        <SafeAreaView>
            <Calendar style={glbStyle.stUnVisible}
                onDayPress={day => {
                    console.log('selected day', day);
                }}

                onMonthChange={month => {
                    console.log('month changed', month);
                }}
                dayComponent={({ date, state }) => {
                    return (
                        <View>
                            <Pressable onPress={(vl) => console.log(vl)} style={{ textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black' }}>
                                <Text>
                                    {date.day}
                                </Text>
                            </Pressable>
                        </View>
                    );
                }}
            />
            <View style={styles.filterView}>
                {
                    filtreSecenekler.map((item, index) => {
                        return (
                            <Pressable onPress={() => {
                                filterButtonPressed(index);
                                applyFilter(filtreSecenekler[index]);
                            }} key={index}>
                                <Text style={filterButtonStyles[index]}>{item} ({filtreSecenekCounts[index]})</Text>
                            </Pressable>
                        )
                    })
                }
            </View>
            <ScrollView style={styles.stContentScroll}>
                <View style={styles.stSafe}>
                    {
                        (filteredRequests.length < 1) ? (<Text>Henüz sonlandırılmış talep yok</Text>) : (
                            filteredRequests.sort(function (a, b) { return new Date(b.Zaman) - new Date(a.Zaman) }).map((request, index) => {
                                if (request.SonlandirmaSayisi > 0) {
                                    return (
                                        <View style={styles.stRowView} key={index}>
                                            <Text style={styles.stCellHead}>{request.Talep}</Text>
                                            <Text style={styles.stCell}>{request.Aciklama.substr(0, aciklamaCharLimit) + ".."}</Text>
                                            <Text style={styles.stCell}>{moment(request.Zaman).format('DD MMM')}</Text>
                                            <Text style={styles.stCell}>{moment(request.SonlandirmaZamani).format('DD MMM')}</Text>
                                            <Pressable onPress={() => navigation.navigate('TalepSonlanmis', { request })}><Text style={styles.stCell}>Detay</Text></Pressable>
                                        </View>
                                    )
                                }
                            })
                        )
                    }
                </View>
            </ScrollView >
        </SafeAreaView>
    )
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    stContentScroll: {
        minHeight: deviceHeight,
    },
    stRowView: {
        flexDirection: 'row', margin: 10, justifyContent: 'flex-end', width: deviceWidth - 20,
    },
    stCellHead: {
        fontWeight: 'bold',
        marginHorizontal: 5,
        flex: 1,
    },
    stCell: {
        marginHorizontal: 5,
    },
    stSafe: {
        marginBottom: 230,
    },
    filterView: {
        flexDirection: 'row', marginHorizontal: 5, flexWrap: 'wrap', minHeight: 40,
    },
    filterElement: {
        height: 30, alignContent: 'center', alignItems: 'center',
        margin: 5, padding: 5, color: 'white', flex: 1,
        borderRadius: 10, lineHeight: 20, backgroundColor: 'red'
    },
    filterElement2: {
        height: 30, alignContent: 'center', alignItems: 'center',
        margin: 5, padding: 5, color: 'white', flex: 1,
        borderRadius: 10, lineHeight: 20, backgroundColor: 'green'
    },
    redBackground: { backgroundColor: 'red' }
})

export default TalepTumuScreen;