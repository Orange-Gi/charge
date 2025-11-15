import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store } from '../src/store/store';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// 防止启动画面自动隐藏
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // 延迟隐藏启动画面
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </Provider>
  );
}

