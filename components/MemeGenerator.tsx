import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import * as Sharing from 'expo-sharing';

interface MemeTemplate {
  id: string;
  name: string;
  lines: number;
  overlays: number;
  styles: string[];
  blank: string;
  example: {
    text: string[];
    url: string;
  };
  source: string;
  _self: string;
}

const { width: screenWidth } = Dimensions.get('window');

export default function MemeGenerator() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedTemplateData, setSelectedTemplateData] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState<string>('');
  const [bottomText, setBottomText] = useState<string>('');
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await axios.get('https://api.memegen.link/templates/');
      const templatesArray = Object.values(response.data) as MemeTemplate[];
      setTemplates(templatesArray.slice(0, 20));
      if (templatesArray.length > 0) {
        setSelectedTemplate(templatesArray[0].id);
        setSelectedTemplateData(templatesArray[0]);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      Alert.alert('Error', 'Failed to fetch meme templates. Please try again.');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const generateMeme = () => {
    if (!selectedTemplate) {
      Alert.alert('Error', 'Please select a meme template');
      return;
    }

    if (!topText && !bottomText) {
      Alert.alert('Error', 'Please enter at least one text');
      return;
    }

    setLoading(true);

    const formatText = (text: string) => {
      return text
        .replace(/ /g, '_')
        .replace(/\?/g, '~q')
        .replace(/&/g, '~a')
        .replace(/%/g, '~p')
        .replace(/#/g, '~h')
        .replace(/\//g, '~s')
        .replace(/\\/g, '~b')
        .replace(/</g, '~l')
        .replace(/>/g, '~g')
        .replace(/"/g, "''");
    };

    const formattedTopText = topText ? formatText(topText) : '_';
    const formattedBottomText = bottomText ? formatText(bottomText) : '_';

    const memeUrl = `https://api.memegen.link/images/${selectedTemplate}/${formattedTopText}/${formattedBottomText}.png`;
    
    setGeneratedMemeUrl(memeUrl);
    setLoading(false);
  };

  const shareMeme = async () => {
    if (!generatedMemeUrl) {
      Alert.alert('Error', 'No meme to share. Please generate a meme first.');
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(generatedMemeUrl, {
          mimeType: 'image/png',
          dialogTitle: 'Share your meme!',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing meme:', error);
      Alert.alert('Error', 'Failed to share meme. You can save the image by long-pressing on it.');
    }
  };

  const resetMeme = () => {
    setTopText('');
    setBottomText('');
    setGeneratedMemeUrl('');
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const templateData = templates.find(t => t.id === templateId);
    setSelectedTemplateData(templateData || null);
    setGeneratedMemeUrl('');
  };

  if (loadingTemplates) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading meme templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>😂 Meme Studio</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* Template Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose Your Template</Text>
            <Text style={styles.sectionIcon}>⬇️</Text>
          </View>
          
          <FlatList
            data={templates}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.templateCard,
                  selectedTemplate === item.id && styles.selectedTemplateCard
                ]}
                onPress={() => handleTemplateChange(item.id)}
              >
                <Image
                  source={{ uri: item.blank }}
                  style={styles.templateThumbnail}
                  resizeMode="cover"
                />
                <Text style={styles.templateCardName} numberOfLines={2}>
                  {item.name}
                </Text>
                {selectedTemplate === item.id && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.templateList}
          />
        </View>

        {/* Text Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Your Meme</Text>
          <TextInput
            style={styles.modernTextInput}
            placeholder="TOP TEXT (e.g., I'M NOT SAYING IT WAS ALIENS...)"
            placeholderTextColor="#999"
            value={topText}
            onChangeText={setTopText}
            multiline
          />
          <TextInput
            style={styles.modernTextInput}
            placeholder="BOTTOM (e.g., I'M NOT SAYING IT WAS BUT IT WAS ALIENS"
            placeholderTextColor="#999"
            value={bottomText}
            onChangeText={setBottomText}
            multiline
          />

        </View>

        {/* Generate & Share Button */}
        <TouchableOpacity
          style={styles.generateShareButton}
          onPress={generateMeme}
          disabled={loading}
        >
          <Text style={styles.generateShareText}>
            {loading ? 'GENERATING...' : 'GENERATE & SHARE'}
          </Text>
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.modernResetButton}
          onPress={resetMeme}
        >
          <Text style={styles.resetIcon}>🔄</Text>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>

        {/* Generated Meme Display */}
        {generatedMemeUrl && (
          <View style={styles.memeContainer}>
            <Image
              source={{ uri: generatedMemeUrl }}
              style={styles.memeImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareMeme}
            >
              <Text style={styles.shareButtonText}>Share Meme</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionIcon: {
    fontSize: 16,
  },
  templateList: {
    paddingHorizontal: 5,
  },
  templateCard: {
    width: 100,
    marginRight: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplateCard: {
    borderColor: '#4A90E2',
    backgroundColor: '#e3f2fd',
  },
  templateThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 6,
    marginBottom: 8,
  },
  templateCardName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modernTextInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    color: '#333',
    minHeight: 50,
  },
  generateShareButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generateShareText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modernResetButton: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  resetIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  resetText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  memeContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memeImage: {
    width: screenWidth - 80,
    height: (screenWidth - 80) * 0.75,
    borderRadius: 8,
    marginBottom: 15,
  },
  shareButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});