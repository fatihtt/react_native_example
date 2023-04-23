import React, { createContext, useEffect, useState } from "react";
import { apiUrl } from "../modules/refs";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userState, setUserState] = useState({
        userLogged: false,
        userName: '',
        userToken: '',
        userID: null,
        userDepartmentID: null,
        userRole: '',
        errorMessage: null
    });

    const [kullaniciGirdi, setKullaniciGirdi] = useState(false);
    const [kullaniciID, setKullaniciID] = useState(0);
    const [kullaniciToken, setKullaniciToken] = useState('');
    const [kullaniciBirim, setKullaniciBirim] = useState(0);
    const [kullaniciRol, setKullaniciRol] = useState(null);
    const [kullaniciAdi, setKullaniciAdi] = useState(null);
    const [hataMesaji, setHataMesaji] = useState(null);

    const [talepler, setTalepler] = useState();

    const [splashState, setSplashstate] = useState(false);

    const changeSplash = (myBool) => {
        setSplashstate(myBool);
    }

    const erroraDus = (err) => {
        console.log("errora düştüm aney", err);
        setUserState({
            userLogged: false, userName: '', userToken: '', userRole: '', userID: null, userDepartmentID: null,
            errorMessage: err
        });
    }

    const tryLocalSignin = (navigation) => {
        AsyncStorage.getItem('token').then((response) => {
            const my_tok = response;
            if (my_tok) {
                setKullaniciToken(my_tok);
                axios.get(`${apiUrl}ben_neyim`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${my_tok}`
                    }
                }).then((response) => {
                    const cvp = response.data;
                    setKullaniciGirdi(true);
                    setKullaniciID(cvp.ID);
                    setKullaniciBirim(cvp.BirimID);
                    setKullaniciRol(cvp.RolAdi);
                    setKullaniciAdi(cvp.KullaniciAdi);
                    setUserState({
                        userToken: my_tok,
                        userLogged: true,
                        userName: cvp.KullaniciAdi,
                        userDepartmentID: cvp.BirimID,
                        userID: cvp.ID,
                        userRole: cvp.RolAdi,
                        errorMessage: null
                    });
                }).catch((err) => {
                    //erroraDus(err);
                    console.log(`Kullanici bilgi alis sirasinda hata! ${err}`);
                });
            }
        });
    }

    const userLogin = (email, password) => {
        try {
            changeSplash(true);
            axios.post(`${apiUrl}signin`, { email, password }).then((response) => {
                if (!(response.data.error)) {
                    setUserState({ ...userState, errorMessage: null });
                    const token = response.data;
                    setKullaniciToken(token);
                    axios.get(`${apiUrl}ben_neyim`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }).then((response) => {
                        // {"BirimID": 2, "ID": 1, "KullaniciAdi": "fatih", "RolAdi": "makenmudur"}
                        const cvp = response.data;
                        setKullaniciGirdi(true);
                        setKullaniciID(cvp.ID);
                        setKullaniciBirim(cvp.BirimID);
                        setKullaniciRol(cvp.RolAdi);
                        setKullaniciAdi(cvp.KullaniciAdi);
                        setUserState({
                            userToken: token,
                            userLogged: true,
                            userName: response.data.KullaniciAdi,
                            userDepartmentID: response.data.BirimID,
                            userID: response.data.ID,
                            userRole: response.data.RolAdi,
                            errorMessage: null
                        });
                    }).then(() => { AsyncStorage.setItem('token', token) }).catch((err) => {
                        changeSplash(false);
                        erroraDus(err);
                        console.log(`kullanici bilgi alis sirasinda hata! ${err}`);
                    });
                }
                else {
                    changeSplash(false);
                    console.log('hata var');
                    throw 'kullanici adi veya sifre hatali';
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).catch((err) => {
                changeSplash(false);
                erroraDus(err);
                console.log(`kullanici girisi sirasinda hata! ${err}`);
            });
        } catch (err) {
            changeSplash(false);
            erroraDus(err);
            console.log(`kullanici girisi sirasinda hata! ${err}`);
        }
    }

    const userLogout = () => {
        try {
            AsyncStorage.removeItem('token').then(() => erroraDus(null)).then(
                () => console.log('user logged out!')).then(
                    () => console.log(userState)
                ).catch((err) => console.log(err));
        } catch (err) {
            console.log(`logout sirasinda hata! ${err}`)
        }
    }

    const [bildirimler, setBildirimler] = useState();
    const [yeniBildirimSayisi, setYeniBildirimSayisi] = useState(0);

    useEffect(() => {
        if (!kullaniciID) return;

        let gorulmedi_sayisi = 0;
        if (!bildirimler || bildirimler.length < 1) return;

        bildirimler.map((item, index) => {
            if (item.Goruldu != 1) gorulmedi_sayisi++;
        });
        console.log(gorulmedi_sayisi);
        setYeniBildirimSayisi(gorulmedi_sayisi);
    }, [bildirimler]);

    const bildirimGuncelle = () => {
        try {
            AsyncStorage.getItem("token").then((response) => {
                token = response;
                console.log("token", token);
                if (!token || token === '') return console.log("token yok");

                axios.get(`${apiUrl}bildirimleri_al`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response) => { setBildirimler(response.data) }).catch((err) => { throw "axios error" });
            });
        } catch (err) {
            console.log("hata", err);
        }
    }

    useEffect(() => {
        const kullanicitoken = kullaniciToken;
        setInterval(function () {
            bildirimGuncelle();
        }, 10000);
    }, []);

    return (
        <UserContext.Provider value={{ userState, userLogin, tryLocalSignin, userLogout, splashState, changeSplash, yeniBildirimSayisi, kullaniciGirdi, kullaniciToken, kullaniciRol, kullaniciBirim, kullaniciAdi, bildirimler, kullaniciID, setTalepler, talepler, bildirimGuncelle }}>
            {children}
        </UserContext.Provider>
    )
}
export default UserContext;