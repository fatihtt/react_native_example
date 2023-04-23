import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import TaleplerScreen from './screens/Talepler';
import TalepScreen from './screens/TalepScreen';
import TalepOlusturScreen from './screens/TalepOlustur';
import TalepTumuScreen from './screens/TalepTumu';
import LogoutScreen from './screens/LogoutScreen';
import TalepKapaliScreen from './screens/TalepKapaliScreen';
import BildirimScreen from './screens/BildirimScreen';
import { UserProvider } from './context/UserContext';
import { headerRightCode } from './modules/refs';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{
          headerStyle: {
            backgroundColor: '#f4a20e',
            headerTintColor: '#01305c'
          },
        }} >
          <Stack.Screen options={{ title: 'Giriş' }} name='Login' component={LoginScreen} />


          <Stack.Screen options={({ navigation }) => ({
            gestureEnabled: false,
            headerTitle: 'Açık Talepler',
            headerRight: () => (
              <View style={styles.rightSideView}>
                <Pressable style={styles.rightSideElement} onPress={() => navigation.navigate('Bildirim')}>
                  <Ionicons name="notifications" size={28} color="black" />
                </Pressable>
                <Pressable style={styles.rightSideElement} onPress={() => navigation.navigate('Logout')}>
                  <Text>Çıkış</Text>
                </Pressable>
              </View>
            )
          })} name='Talepler' component={TaleplerScreen} />


          <Stack.Screen options={({ navigation }) => ({
            headerTitle: 'Talep Detayı',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('Logout')}><Text>Çıkış</Text></Pressable>
            )
          })} name='Talep' component={TalepScreen} />


          <Stack.Screen options={({ navigation }) => ({
            headerTitle: 'Yeni Talep',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('Logout')}><Text>Çıkış</Text></Pressable>
            )
          })} name='TalepOlustur' component={TalepOlusturScreen} />


          <Stack.Screen options={({ navigation }) => ({
            headerTitle: 'Sonlanmış Talepler',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('Logout')}><Text>Çıkış</Text></Pressable>
            )
          })} name='TalepTumu' component={TalepTumuScreen} />


          <Stack.Screen options={({ navigation }) => ({
            headerTitle: 'Sonlanmış Talep',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('Logout')}><Text>Çıkış</Text></Pressable>
            )
          })} name='TalepSonlanmis' component={TalepKapaliScreen} />


          <Stack.Screen options={({ navigation }) => ({
            headerTitle: 'Bildirimler',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('Logout')}><Text>Çıkış</Text></Pressable>
            )
          })} name='Bildirim' component={BildirimScreen} />


          <Stack.Screen name='Logout' component={LogoutScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSideView: {
    flexDirection: 'row', alignItems: 'center',
  },
  rightSideElement: {
    marginHorizontal: 7,
  }
});
