import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';


const screenWidth = Dimensions.get('window').width;

export const BarraDeTiempo = ({ duracion = 10, onTerminar }) => {
  const anchoAnimado = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Reinicia la barra al 100%
    anchoAnimado.setValue(100);

    // Anima la barra de 100% a 0%
    Animated.timing(anchoAnimado, {
      toValue: 0,
      duration: duracion * 1000, // en milisegundos
      useNativeDriver: false,
    }).start(() => {
      if (onTerminar) onTerminar();
    });
  }, [duracion]);

  const anchoInterpolado = anchoAnimado.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.contenedor}>
      <Animated.View style={[styles.barra, { width: anchoInterpolado }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    height: 20,
    width: screenWidth * 0.8,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 60
  },
  barra: {
    height: 20,
    backgroundColor: '#DD750C',
  },
});

