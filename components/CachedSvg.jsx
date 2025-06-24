import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CachedSvg = ({ uri, width = 200, height = 200 }) => {
  const [svgXml, setSvgXml] = useState(null);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const cached = await AsyncStorage.getItem(uri);
        if (cached) {
          setSvgXml(cached);
        } else {
          const response = await fetch(uri);
          const text = await response.text();
          await AsyncStorage.setItem(uri, text);
          setSvgXml(text);
        }
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };

    loadSvg();
  }, [uri]);

  return (
    <View>
      {svgXml ? (
        <SvgXml xml={svgXml} width={width} height={height} />
      ) : (
        <ActivityIndicator size="small" color={'grey'} />
      )}
    </View>
  );
};
