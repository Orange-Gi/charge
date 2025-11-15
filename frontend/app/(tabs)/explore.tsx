import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text>对话功能待实现</Text>
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

