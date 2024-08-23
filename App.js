import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import axios from 'axios';

const GROQ_API_KEY = ''; 

export default function App() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');

  const translateText = async () => {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions', // Updated endpoint
        {
          messages: [
            {
              role: 'user',
              content: `Translate the following English text to Japanese: "${inputText}"`, // Adjusted prompt
            },
          ],
          model: 'llama3-8b-8192', 
          max_tokens: 150, 
          temperature: 0.7, // Adjust for creativity in responses
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setTranslation(response.data.choices[0].message.content.trim()); 
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation('Error translating text.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>English to Japanese Translator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter English text..."
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Translate" onPress={translateText} />
      {translation ? <Text style={styles.output}>{translation}</Text> : null}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  output: {
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
  },
});