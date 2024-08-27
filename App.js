import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import debounce from 'lodash.debounce';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // The URL of your deployed backend server on Vercel
  const BACKEND_URL = 'https://real-time-translator-mu.vercel.app/';

  const translateText = async (text) => {
    if (!text) {
      setTranslation('');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        BACKEND_URL,
        { text },  // Sending the text to be translated
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setTranslation(response.data.translation);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation('Error translating text.');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedTranslate = useCallback(debounce(translateText, 500), []);

  useEffect(() => {
    debouncedTranslate(inputText);
    return () => {
      debouncedTranslate.cancel();
    };
  }, [inputText, debouncedTranslate]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Japanese to English Translator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Japanese text..."
        value={inputText}
        onChangeText={setInputText}
        multiline
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        translation && (
          <View style={styles.outputContainer}>
            <Text style={styles.outputLabel}>English Translation:</Text>
            <Text style={styles.output}>{translation}</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 18,
  },
  outputContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  outputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  output: {
    fontSize: 18,
    color: '#0066cc',
  },
});
