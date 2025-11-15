import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="欢迎" />
        <Card.Content>
          <Text>欢迎, {user?.username}!</Text>
          <Text style={styles.role}>角色: {user?.role === 'admin' ? '管理员' : '普通用户'}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  role: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});

