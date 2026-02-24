import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AssistantScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant Foodza. Comment puis-je vous aider aujourd\'hui ?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickActions = [
    { id: '1', text: 'Suivre ma commande', icon: 'map-outline' as any },
    { id: '2', text: 'Voir les restaurants', icon: 'restaurant-outline' as any },
    { id: '3', text: 'Aide paiement', icon: 'card-outline' as any },
    { id: '4', text: 'Contacter support', icon: 'headset-outline' as any },
  ];

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages([...messages, newMessage]);
      
      // Simulate assistant response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Je comprends votre demande. Laissez-moi vous aider avec cela...',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
      
      setInputText('');
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: action.text,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate response for quick actions
    setTimeout(() => {
      let responseText = '';
      switch (action.id) {
        case '1':
          responseText = 'Je peux vous aider à suivre votre commande. Veuillez me donner votre numéro de commande.';
          break;
        case '2':
          responseText = 'Voici les restaurants disponibles près de chez vous. Que souhaitez-vous commander ?';
          break;
        case '3':
          responseText = 'Pour le paiement, nous acceptons carte bancaire, mobile money et espèces à la livraison.';
          break;
        case '4':
          responseText = 'Je vous connecte avec notre support technique. Quel est votre problème ?';
          break;
      }
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const renderMessage = (item: Message) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.assistantMessage]}>
      <View style={[styles.messageBubble, item.isUser ? styles.userMessageBubble : null]}>
        <Text style={[styles.messageText, item.isUser ? styles.userMessageText : null]}>{item.text}</Text>
        <Text style={[styles.messageTime, item.isUser ? styles.userMessageTime : null]}>
          {item.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assistant Foodza</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#2C1810" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickAction}
              onPress={() => handleQuickAction(action)}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon} size={20} color="#2C1810" />
              </View>
              <Text style={styles.quickActionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tapez votre message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? '#FFFFFF' : '#999'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  headerButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 15,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 15,
    paddingTop: 12,
  },
  userMessageBubble: {
    backgroundColor: '#2C1810',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  userMessageTime: {
    color: '#E0E0E0',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
  },
  quickAction: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    minWidth: 100,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#2C1810',
    fontWeight: '500',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    marginLeft: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: '#2C1810',
  },
  sendButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
});
