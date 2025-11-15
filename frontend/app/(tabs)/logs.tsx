import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function LogsScreen() {
  return (
    <View style={styles.container}>
      <Text>日志管理功能待实现</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

