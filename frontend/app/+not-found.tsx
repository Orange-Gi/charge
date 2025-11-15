import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '页面未找到' }} />
      <View style={styles.container}>
        <Text style={styles.title}>页面未找到</Text>
        <Link href="/" asChild>
          <Button mode="contained">返回首页</Button>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

