import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';

interface File {
  uri: string;
  name: string;
  type: string;
}

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // 允许所有文件类型
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const file: File = {
          uri: asset.uri,
          name: asset.name || 'unknown',
          type: asset.mimeType || 'application/octet-stream',
        };
        onFileSelected(file);
      }
    } catch (error) {
      console.error('文件选择错误:', error);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.content}>
          <Text style={styles.label}>选择BLF文件</Text>
          <Button
            mode="outlined"
            onPress={handlePickFile}
            icon="upload"
          >
            选择文件
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    marginBottom: 16,
    fontSize: 16,
  },
});
