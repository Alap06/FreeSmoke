import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants';
import { sendMessageToCoach } from '../services/AICoachService';

const SUGGESTIONS = [
  "J'ai une envie de fumer 🚬",
  "Donne-moi de la motivation 💪",
  "J'ai rechuté aujourd'hui 😔",
  "Comment réduire le stress ? 😤",
  "Quels sont les bénéfices santé ? 💚",
];

const AICoachScreen = () => {
  const { theme } = useTheme();
  const { userProfile, quitPlan, getTodayCount, getCurrentStreak,
          getMoneySavedTotal, userProgress } = useApp();

  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'assistant',
      content: `Bonjour ${userProfile?.displayName || ''} ! 👋\n\nJe suis ton coach IA FreeSmoke. Je connais ton profil et ton parcours — je suis là pour t'accompagner à chaque étape.\n\nComment puis-je t'aider aujourd'hui ? 💚`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const stats = {
    streak: getCurrentStreak(),
    moneySaved: getMoneySavedTotal(),
    cravingsDefeated: userProgress.cravingsDefeated || 0,
    todayCount: getTodayCount(),
  };

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: text.trim() };
    const history = messages.filter(m => m.id !== '0');
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const result = await sendMessageToCoach(
      text.trim(), history, userProfile, quitPlan, stats
    );

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.message,
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const s = StyleSheet.create({
    container:    { flex: 1, backgroundColor: theme.background },
    header:       { backgroundColor: COLORS.primaryDark, padding: 16, flexDirection: 'row', alignItems: 'center' },
    headerAvatar: { fontSize: 32, marginRight: 12 },
    headerTitle:  { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    headerSub:    { fontSize: 12, color: '#A8D5BA', marginTop: 2 },
    messagesList: { flex: 1, padding: 16 },
    userBubble:   { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderRadius: 18, borderBottomRightRadius: 4, padding: 12, marginBottom: 10, maxWidth: '80%' },
    userText:     { color: '#fff', fontSize: 15, lineHeight: 21 },
    aiBubble:     { alignSelf: 'flex-start', backgroundColor: theme.card, borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, marginBottom: 10, maxWidth: '80%', elevation: 1 },
    aiText:       { color: theme.text, fontSize: 15, lineHeight: 21 },
    timeText:     { fontSize: 10, color: theme.textSecondary, marginTop: 4, alignSelf: 'flex-end' },
    typingWrap:   { alignSelf: 'flex-start', backgroundColor: theme.card, borderRadius: 18, padding: 14, marginBottom: 10 },
    suggestions:  { paddingHorizontal: 16, paddingVertical: 8 },
    suggestRow:   { flexDirection: 'row', gap: 8 },
    suggestBtn:   { backgroundColor: COLORS.primaryLight + '20', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primaryLight },
    suggestText:  { color: COLORS.primary, fontSize: 13, fontWeight: '500' },
    inputRow:     { flexDirection: 'row', padding: 12, alignItems: 'flex-end', backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.border, gap: 8 },
    input:        { flex: 1, backgroundColor: theme.background, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: theme.text, maxHeight: 100, borderWidth: 1, borderColor: theme.border },
    sendBtn:      { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
    sendBtnOff:   { backgroundColor: theme.border },
  });

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={isUser ? s.userBubble : s.aiBubble}>
        {!isUser && <Text style={{ fontSize: 18, marginBottom: 4 }}>🤖</Text>}
        <Text style={isUser ? s.userText : s.aiText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerAvatar}>🤖</Text>
        <View>
          <Text style={s.headerTitle}>Coach IA FreeSmoke</Text>
          <Text style={s.headerSub}>Powered by Claude AI • Toujours disponible</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={s.messagesList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <View style={s.typingWrap}>
              <ActivityIndicator color={COLORS.primary} size="small" />
            </View>
          ) : null
        }
      />

      {/* Suggestions */}
      {messages.length <= 2 && (
        <View style={s.suggestions}>
          <FlatList
            horizontal
            data={SUGGESTIONS}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.suggestRow}
            renderItem={({ item }) => (
              <TouchableOpacity style={s.suggestBtn} onPress={() => sendMessage(item)}>
                <Text style={s.suggestText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Input */}
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          placeholder="Message au coach..."
          placeholderTextColor={theme.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
          onSubmitEditing={() => sendMessage()}
        />
        <TouchableOpacity
          style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnOff]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Text style={{ fontSize: 18 }}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AICoachScreen;