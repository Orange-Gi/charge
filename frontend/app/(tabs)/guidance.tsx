import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, ProgressBar, Text } from 'react-native-paper';
import FileUpload from '../../src/components/FileUpload';
import Chart from '../../src/components/Chart';
import { useAnalysis } from '../../src/hooks/useAnalysis';

interface File {
  uri: string;
  name: string;
  type: string;
}

export default function AnalysisScreen() {
  const [file, setFile] = useState<File | null>(null);
  const { startAnalysis, progress, result, thinking, loading } = useAnalysis();

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleStartAnalysis = async () => {
    if (file) {
      await startAnalysis(file);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="充电分析" />
        <Card.Content>
          <FileUpload onFileSelected={handleFileSelected} />
          
          {file && (
            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleStartAnalysis}
                disabled={loading}
                style={styles.button}
              >
                开始分析
              </Button>
            </View>
          )}

          {loading && (
            <View style={styles.progress}>
              <Text>分析进度: {progress}%</Text>
              <ProgressBar progress={progress / 100} />
            </View>
          )}

          {thinking && (
            <Card style={styles.thinkingCard}>
              <Card.Title title="思考过程" />
              <Card.Content>
                <Text>{thinking}</Text>
              </Card.Content>
            </Card>
          )}

          {result && (
            <View style={styles.result}>
              <Card>
                <Card.Title title="分析结果" />
                <Card.Content>
                  {result.data && <Chart data={result.data} />}
                  {result.summary && (
                    <Text style={styles.summary}>{result.summary}</Text>
                  )}
                </Card.Content>
              </Card>
            </View>
          )}
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
  actions: {
    marginTop: 16,
  },
  button: {
    marginTop: 8,
  },
  progress: {
    marginTop: 16,
  },
  thinkingCard: {
    marginTop: 16,
    backgroundColor: '#f5f5f5',
  },
  result: {
    marginTop: 16,
  },
  summary: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
  },
});

