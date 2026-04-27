import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { loginUser, registerUser } from '../services/AuthService';
import { COLORS } from '../constants';

const LoginScreen = () => {
  const { setAuthToken, setIsLoggedIn } = useApp();
  const [isLogin, setIsLogin]           = useState(true);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [displayName, setDisplayName]   = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Email et mot de passe requis');
      return;
    }
    if (!isLogin && !displayName.trim()) {
      Alert.alert('Erreur', 'Prénom requis');
      return;
    }

    setLoading(true);

    const result = isLogin
      ? await loginUser(email.trim(), password.trim())
      : await registerUser(email.trim(), password.trim(), displayName.trim());

    setLoading(false);

    if (result.token) {
      await AsyncStorage.setItem('@auth_token', result.token);
      await AsyncStorage.setItem('@user_id', result.userId);
      setAuthToken(result.token);
      setIsLoggedIn(true);
    } else {
      Alert.alert('Erreur', result.message || 'Une erreur est survenue');
    }
  };

  const s = StyleSheet.create({
    container:    { flex: 1, backgroundColor: COLORS.primaryDark },
    header:       { alignItems: 'center', paddingTop: 80, paddingBottom: 40 },
    logo:         { fontSize: 60, marginBottom: 12 },
    title:        { fontSize: 32, fontWeight: 'bold', color: '#fff' },
    subtitle:     { fontSize: 15, color: '#A8D5BA', marginTop: 6 },
    body:         { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24 },
    tabRow:       { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 12, marginBottom: 24, padding: 4 },
    tab:          { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10 },
    tabActive:    { backgroundColor: '#fff', elevation: 2 },
    tabText:      { fontSize: 15, fontWeight: '600', color: '#999' },
    tabTextActive:{ color: COLORS.primaryDark },
    label:        { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6, marginTop: 14, textTransform: 'uppercase' },
    input:        { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, fontSize: 16, color: '#333', borderWidth: 1.5, borderColor: '#e0e0e0' },
    btn:          { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24 },
    btnText:      { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  });

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.header}>
        <Text style={s.logo}>🚭</Text>
        <Text style={s.title}>FreeSmoke</Text>
        <Text style={s.subtitle}>One cigarette less. One step closer.</Text>
      </View>

      <View style={s.body}>
        <View style={s.tabRow}>
          <TouchableOpacity
            style={[s.tab, isLogin && s.tabActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[s.tabText, isLogin && s.tabTextActive]}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, !isLogin && s.tabActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[s.tabText, !isLogin && s.tabTextActive]}>Inscription</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {!isLogin && (
            <>
              <Text style={s.label}>Prénom</Text>
              <TextInput
                style={s.input}
                placeholder="Votre prénom"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </>
          )}

          <Text style={s.label}>Email</Text>
          <TextInput
            style={s.input}
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={s.label}>Mot de passe</Text>
          <TextInput
            style={s.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={s.btn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>
                  {isLogin ? '🔓 Se connecter' : '🚀 Créer mon compte'}
                </Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;