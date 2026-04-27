import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants';

const TOOLS = [
  { id: 'breathing', label: 'Respiration 4-7-8', icon: '🫁', desc: 'Technique anti-stress prouvée' },
  { id: 'timer',     label: 'Timer 7 minutes',   icon: '⏱️', desc: 'L\'envie passe en 7 min' },
  { id: 'quotes',    label: 'Motivation',         icon: '💬', desc: 'Citations inspirantes' },
  { id: 'minigames', label: 'Mini-Jeux', icon: '🎮', desc: 'Joue pour oublier l\'envie' },
];

const QUOTES = [
  "Chaque minute sans cigarette est une victoire. 🏆",
  "Ton corps guérit à chaque seconde que tu tiens. 💚",
  "Cette envie va passer. Elle passe toujours. 🌊",
  "Tu es plus fort que cette envie. 💪",
  "Pense à l'argent économisé et aux poumons purifiés. 🌿",
  "Un vrai champion ne fume pas. 🥊",
];

const BreathingExercise = ({ onComplete }) => {
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const anim = useRef(new Animated.Value(1)).current;

  const phases = { inhale: { label: 'Inspirez', duration: 4, next: 'hold' }, hold: { label: 'Retenez', duration: 7, next: 'exhale' }, exhale: { label: 'Expirez', duration: 8, next: 'inhale' } };

  useEffect(() => {
    const p = phases[phase];
    setCount(p.duration);
    Animated.timing(anim, { toValue: phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.4 : 1, duration: p.duration * 1000, useNativeDriver: true }).start();
    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(interval);
          if (phase === 'exhale') {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            if (newCycles >= 3) { onComplete(); return p.duration; }
          }
          setPhase(phases[phase].next);
          return phases[phases[phase].next].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <View style={{ alignItems: 'center', paddingVertical: 30 }}>
      <Animated.View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: COLORS.primaryLight + '40', alignItems: 'center', justifyContent: 'center', transform: [{ scale: anim }] }}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#fff' }}>{count}</Text>
        </View>
      </Animated.View>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginTop: 20 }}>{phases[phase].label}</Text>
      <Text style={{ color: '#666', marginTop: 8 }}>Cycle {cycles + 1}/3</Text>
    </View>
  );
};

const CountdownTimer = ({ minutes = 7, onComplete }) => {
  const [seconds, setSeconds] = useState(minutes * 60);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(interval); onComplete(); return 0; }
        return s - 1;
      });
    }, 1000);
    Animated.timing(progress, { toValue: 0, duration: minutes * 60 * 1000, useNativeDriver: false }).start();
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <View style={{ alignItems: 'center', paddingVertical: 30 }}>
      <View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: COLORS.accent + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: COLORS.accent }}>
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.accent }}>{mins}:{secs.toString().padStart(2, '0')}</Text>
      </View>
      <Text style={{ fontSize: 18, color: '#666', marginTop: 20, textAlign: 'center' }}>L'envie passe en 7 minutes{'\n'}Tu peux le faire ! 💪</Text>
    </View>
  );
};

const SOSScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { logCravingEvent } = useApp();
  const [selectedTool, setSelectedTool] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleComplete = async () => {
    await logCravingEvent(selectedTool, true, 0);
    setCompleted(true);
  };

  const s = StyleSheet.create({
    container:  { flex: 1, backgroundColor: theme.background },
    scroll:     { padding: 20 },
    title:      { fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 6 },
    subtitle:   { fontSize: 14, color: theme.textSecondary, marginBottom: 24 },
    toolCard:   { backgroundColor: theme.card, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
    toolActive: { borderWidth: 2, borderColor: COLORS.primary },
    toolIcon:   { fontSize: 32, marginRight: 16 },
    toolLabel:  { fontSize: 16, fontWeight: 'bold', color: theme.text },
    toolDesc:   { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
    doneCard:   { backgroundColor: COLORS.primary, borderRadius: 20, padding: 30, alignItems: 'center', margin: 20 },
    doneText:   { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    doneSubtxt: { fontSize: 15, color: '#A8D5BA', marginTop: 8, textAlign: 'center' },
    backBtn:    { backgroundColor: theme.card, borderRadius: 14, padding: 14, alignItems: 'center', margin: 20, borderWidth: 1, borderColor: theme.border },
    backTxt:    { color: theme.text, fontSize: 15, fontWeight: '600' },
    quoteCard:  { backgroundColor: COLORS.primaryLight + '20', borderRadius: 16, padding: 20, marginTop: 10, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
    quoteText:  { fontSize: 16, color: theme.text, lineHeight: 24, fontStyle: 'italic' },
  });

  if (completed) {
    return (
      <View style={s.container}>
        <View style={s.doneCard}>
          <Text style={{ fontSize: 60 }}>🏆</Text>
          <Text style={s.doneText}>Envie vaincue !</Text>
          <Text style={s.doneSubtxt}>+15 XP gagnés{'\n'}Tu es un champion ! 💪</Text>
        </View>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backTxt}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={s.container}>
      <View style={s.scroll}>
        {!selectedTool ? (
  <>
    <Text style={s.title}>🆘 SOS Envie</Text>
    <Text style={s.subtitle}>Choisissez un outil pour surmonter cette envie :</Text>
    {TOOLS.map(t => (
      <TouchableOpacity key={t.id} style={[s.toolCard, selectedTool === t.id && s.toolActive]}
        onPress={() => t.id === 'minigames' ? navigation.navigate('MiniGames') : setSelectedTool(t.id)}>
                <Text style={s.toolIcon}>{t.icon}</Text>
                <View>
                  <Text style={s.toolLabel}>{t.label}</Text>
                  <Text style={s.toolDesc}>{t.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <Text style={s.title}>{TOOLS.find(t => t.id === selectedTool)?.label}</Text>
            {selectedTool === 'breathing' && <BreathingExercise onComplete={handleComplete} />}
            {selectedTool === 'timer' && <CountdownTimer onComplete={handleComplete} />}
            {selectedTool === 'quotes' && (
              <>
                {QUOTES.map((q, i) => (
                  <View key={i} style={s.quoteCard}>
                    <Text style={s.quoteText}>{q}</Text>
                  </View>
                ))}
                <TouchableOpacity style={[s.backBtn, { marginTop: 20, backgroundColor: COLORS.primary }]}
                  onPress={handleComplete}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>✅ Envie surmontée !</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={s.backBtn} onPress={() => setSelectedTool(null)}>
              <Text style={s.backTxt}>← Changer d'outil</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default SOSScreen;