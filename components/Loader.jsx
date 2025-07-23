import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const Loader = ({ size = 'large', color = 'grey' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F5',
  },
});
