import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { Text } from 'react-native-paper';

export default function Sidebar(props: any) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.role}>{user?.role === 'admin' ? '管理员' : '普通用户'}</Text>
      </View>
      {props.state.routes.map((route: any, index: number) => {
        const focused = props.state.index === index;
        return (
          <DrawerItem
            key={route.key}
            label={route.name}
            focused={focused}
            onPress={() => props.navigation.navigate(route.name)}
          />
        );
      })}
      <DrawerItem
        label="退出登录"
        onPress={handleLogout}
        style={styles.logout}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logout: {
    marginTop: 'auto',
  },
});

