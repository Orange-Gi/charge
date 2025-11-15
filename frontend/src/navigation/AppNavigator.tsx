import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../hooks/useAuth';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import RAGScreen from '../screens/RAGScreen';
import TrainingScreen from '../screens/TrainingScreen';
import LogsScreen from '../screens/LogsScreen';
import Sidebar from '../components/Sidebar';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#2196F3',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen
        name="首页"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="对话"
        component={ChatScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="chat" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="充电分析"
        component={AnalysisScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="battery-charging" size={24} color={color} />,
        }}
      />
      {isAdmin && (
        <>
          <Drawer.Screen
            name="RAG管理"
            component={RAGScreen}
            options={{
              drawerIcon: ({ color }) => <Icon name="book" size={24} color={color} />,
            }}
          />
          <Drawer.Screen
            name="训练管理"
            component={TrainingScreen}
            options={{
              drawerIcon: ({ color }) => <Icon name="school" size={24} color={color} />,
            }}
          />
          <Drawer.Screen
            name="日志管理"
            component={LogsScreen}
            options={{
              drawerIcon: ({ color }) => <Icon name="list" size={24} color={color} />,
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}

