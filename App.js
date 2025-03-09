import React, { useState } from "react";
import { View, Text, Button, TextInput, ScrollView, Image, StyleSheet } from "react-native";

const BACKEND_URL = "https://your-backend-url.com"; // Replace with your actual FastAPI backend URL

export default function App() {
  const [topic, setTopic] = useState("");
  const [news, setNews] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [codePrompt, setCodePrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // Fetch general information
  const fetchData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/fetch_data/${topic}`);
      const json = await response.json();
      setNews(JSON.stringify(json, null, 2));
    } catch (error) {
      setNews("Error fetching data");
    }
  };

  // Fetch latest news
  const fetchNews = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/latest_news`);
      const json = await response.json();
      setNews(JSON.stringify(json, null, 2));
    } catch (error) {
      setNews("Error fetching news");
    }
  };

  // Generate an AI Image
  const generateImage = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/generate_image/${imagePrompt}`);
      const json = await response.json();
      setImageUrl(json.image_url || "No image generated");
    } catch (error) {
      setImageUrl("Error generating image");
    }
  };

  // Generate Code
  const generateCode = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/generate_code/${codePrompt}`);
      const json = await response.json();
      setGeneratedCode(json.generated_code || "No code generated");
    } catch (error) {
      setGeneratedCode("Error generating code");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Self-Evolving AI</Text>

      {/* Fetch Information */}
      <Text style={styles.label}>Search for Information:</Text>
      <TextInput style={styles.input} placeholder="Enter a topic..." onChangeText={setTopic} />
      <Button title="Fetch Data" onPress={fetchData} />

      {/* Fetch News */}
      <Button title="Get Latest News" onPress={fetchNews} />
      <Text style={styles.result}>{news}</Text>

      {/* Generate Image */}
      <Text style={styles.label}>Generate AI Image:</Text>
      <TextInput style={styles.input} placeholder="Describe an image..." onChangeText={setImagePrompt} />
      <Button title="Generate Image" onPress={generateImage} />
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

      {/* Generate Code */}
      <Text style={styles.label}>Generate Code:</Text>
      <TextInput style={styles.input} placeholder="Describe the code you need..." onChangeText={setCodePrompt} />
      <Button title="Generate Code" onPress={generateCode} />
      <Text style={styles.result}>{generatedCode}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  label: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, backgroundColor: "#fff" },
  result: { marginTop: 10, fontSize: 16, color: "#333", backgroundColor: "#e0e0e0", padding: 10, borderRadius: 5 },
  image: { width: "100%", height: 200, resizeMode: "contain", marginTop: 10 },
});
