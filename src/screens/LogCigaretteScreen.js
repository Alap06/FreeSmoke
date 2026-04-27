import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS, TRIGGERS } from '../constants';

const LogCigaretteScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { logCigarette, undoLastLog } = useApp();
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [note, setNote] = useState('');
  const [logged, setLogged] = useState(false);

  const handleLog = async () => {
    if (!selectedTrigger) {
      Alert.alert('Déclencheur', 'Choisissez un déclencheur');
      return;
    }
    await logCigarette(selectedTrigger, note);
    setLogged(true);
    setTimeout(() => navigation.goBack(), 1500);
  };

  const handleUndo = async () => {
    await undoLastLog();
    navigation.goBack();
  };

  const s = StyleSheet.create({
    container:   { flex: 1, backgroundColor: theme.background, padding: 20 },
    title:       { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 6 },
    subtitle:    { fontSize: 14, color: theme.textSecondary, marginBottom: 24 },
    sectionLabel:{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 },
    grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    trigBtn:     { width: '47%', padding: 14, borderRadius: 14, borderWidth: 2, alignItems: 'center', borderColor: theme.border, backgroundColor: theme.card },
    trigActive:  { borderWidth: 2 },
    trigIcon:    { fontSize: 28, marginBottom: 4 },
    trigLabel:   { fontSize: 14, fontWeight: '600', color: theme.text },
    input:       { backgroundColor: theme.card, borderRadius: 12, padding: 14, fontSize: 15, color: theme.text, borderWidth: 1, borderColor: theme.border, height: 80, textAlignVertical: 'top', marginBottom: 24 },
    logBtn:      { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12 },
    logBtnText:  { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    undoBtn:     { borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
    undoBtnText: { color: theme.textSecondary, fontSize: 15 },
    success:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
    successIcon: { fontSize: 60, marginBottom: 16 },
    successText: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  });

  if (logged) {
    return (
      <View style={[s.container, s.success]}>
        <Text style={s.successIcon}>✅</Text>
        <Text style={s.successText}>Enregistré !</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>Journal cigarette</Text>
      <Text style={s.subtitle}>Qu'est-ce qui vous a donné envie de fumer ?</Text>
      <Text style={s.sectionLabel}>Déclencheur</Text>
      <View style={s.grid}>
        {TRIGGERS.map(t => (
          <TouchableOpacity key={t.id}
            style={[s.trigBtn, selectedTrigger === t.id && { ...s.trigActive, borderColor: t.color, backgroundColor: t.color + '15' }]}
            onPress={() => setSelectedTrigger(t.id)}>
            <Text style={s.trigIcon}>{t.icon}</Text>
            <Text style={s.trigLabel}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.sectionLabel}>Note (optionnel)</Text>
      <TextInput style={s.input} placeholder="Contexte, pensées..." placeholderTextColor={theme.textSecondary}
        value={note} onChangeText={setNote} multiline />
      <TouchableOpacity style={s.logBtn} onPress={handleLog}>
        <Text style={s.logBtnText}>🚬 Enregistrer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.undoBtn} onPress={handleUndo}>
        <Text style={s.undoBtnText}>↩️ Annuler le dernier</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LogCigaretteScreen;