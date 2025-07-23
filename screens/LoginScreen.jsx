import { Dimensions, Image, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import LoginComponent from '../components/LoginInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function LoginScreen({ navigation }) {


  //num random para bichito
  const randomNumber = Math.floor(Math.random() * 5) + 1;  

  const backColors = ['#FFD953', '#FFDB4E', '#FE8062', '#DCCAFF', '#FF6B87']
  const backColorsImage = ['#00B461', '#F87218', '#2A91DE', '#FF762C', '#924CC7']
  const backColorsOscuros = ['#00744C', '#a73407ff', '#09448dff', '#a73407ff', '#673091ff'] 
  

  return (
    <SafeAreaView style={{...styles.container, backgroundColor: backColors[randomNumber - 1]}}>
          {randomNumber === 1 ? <Image source={require('../assets/bichitos/1.png')} style={{width: screenWidth * .9, height: 300, objectFit: 'cover',}}/>
          : randomNumber === 2 ? <Image source={require('../assets/bichitos/2.png')} style={{width: screenWidth * .9, height: 300, objectFit: 'cover',}}/>
          : randomNumber === 3 ? <Image source={require('../assets/bichitos/3.png')} style={{width: screenWidth * .9, height: 300, objectFit: 'cover',}}/>
          : randomNumber === 4 ? <Image source={require('../assets/bichitos/4.png')} style={{width: screenWidth * .9, height: 300, objectFit: 'cover',}}/>
          : randomNumber === 5 ? <Image source={require('../assets/bichitos/5.png')} style={{width: screenWidth * .9, height: 300, objectFit: 'cover',}}/>
          : null
        }
        <View style={{alignItems: 'center',backgroundColor: backColorsImage[randomNumber - 1], width: screenWidth * .9, borderBottomRightRadius: 40, borderBottomLeftRadius: 40}}>
          <Text style={{fontFamily: 'Roboto', color: '#fafafa', fontSize: 20}}>MiClase</Text>
          <Text style={{fontFamily: 'Roboto', color: '#fafafa', fontSize: 35, marginBottom: 20}}>Iniciar sesión</Text> 
          <LoginComponent randomNumber={randomNumber} backColor={backColorsImage[randomNumber - 1]} backColorOscuro={backColorsOscuros[randomNumber - 1]} />
          <StatusBar style="dark" />
          <Text style={{fontSize: 18, fontFamily: 'Roboto', color: '#fafafa', marginTop: 30}}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}><Text style={{fontSize: 18, fontFamily: 'Roboto', color: backColorsOscuros[randomNumber - 1], marginTop: 5, marginBottom: 20}}>Crear cuenta</Text></TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
