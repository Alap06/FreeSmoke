import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants';

const GameLung = ({ navigation }) => {
  const { logCravingEvent, awardXP } = useApp();
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [done, setDone] = useState(false);
  const [health, setHealth] = useState(30);
  const anim = useRef(new Animated.Value(1)).current;
  const totalCycles = 5;

  const phases = {
    inhale: { label: '🫁 Inspirez',  duration: 4, next: 'hold',   color: COLORS.primary },
    hold:   { label: '⏸️ Retenez',   duration: 7, next: 'exhale', color: COLORS.warning },
    exhale: { label: '💨 Expirez',   duration: 8, next: 'inhale', color: COLORS.primaryLight },
  };

  useEffect(() => {
    if (done) return;
    const p = phases[phase];
    setCount(p.duration);
    Animated.timing(anim, {
      toValue: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
      duration: p.duration * 1000,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(interval);
          if (phase === 'exhale') {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            setHealth(Math.min(100, 30 + newCycles * 14));
            if (newCycles >= totalCycles) { setDone(true); return p.duration; }
          }
          setPhase(phases[phase].next);
          return phases[phases[phase].next].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, done]);

  const handleFinish = async () => {
    await awardXP(25, 'Lung Builder');
    await logCravingEvent('lung', true, 120);
    navigation.goBack();
  };

  const s = StyleSheet.create({
    container:  { flex: 1, backgroundColor: '#0d1f1a', alignItems: 'center', justifyContent: 'center', padding: 20 },
    title:      { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    subtitle:   { fontSize: 14, color: '#A8D5BA', marginBottom: 30, textAlign: 'center' },
    ring:       { width: 200, height: 200, borderRadius: 100, backgroundColor: COLORS.primaryLight + '30', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
    innerRing:  { width: 140, height: 140, borderRadius: 70, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
    countText:  { fontSize: 48, fontWeight: 'bold', color: '#fff' },
    phaseText:  { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    healthBar:  { width: '100%', height: 12, backgroundColor: '#1B4332', borderRadius: 6, marginBottom: 8 },
    healthFill: { height: 12, borderRadius: 6, backgroundColor: COLORS.primaryLight },
    healthTxt:  { color: '#A8D5BA', fontSize: 14, marginBottom: 20 },
    cyclesTxt:  { color: '#A8D5BA', fontSize: 14, marginBottom: 30 },
    doneCard:   { alignItems: 'center' },
    doneIcon:   { fontSize: 80, marginBottom: 16 },
    doneTitle:  { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    doneSub:    { fontSize: 15, color: '#A8D5BA', textAlign: 'center', marginBottom: 30 },
    doneBtn:    { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 40, paddingVertical: 16 },
    doneBtnTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  });

  if (done) {
    return (
      <View style={s.container}>
        <View style={s.doneCard}>
          <Text style={s.doneIcon}>🫁</Text>
          <Text style={s.doneTitle}>Poumons purifiés !</Text>
          <Text style={s.doneSub}>Tu as complété {totalCycles} cycles de respiration{'\n'}Santé pulmonaire : {health}% 💚</Text>
          <TouchableOpacity style={s.doneBtn} onPress={handleFinish}>
            <Text style={s.doneBtnTxt}>✅ Terminer (+25 XP)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>🫁 Lung Builder</Text>
      <Text style={s.subtitle}>Respire profondément pour guérir tes poumons</Text>
      <Animated.View style={[s.ring, { transform: [{ scale: anim }] }]}>
        <View style={s.innerRing}>
          <Text style={s.countText}>{count}</Text>
        </View>
      </Animated.View>
      <Text style={s.phaseText}>{phases[phase].label}</Text>
      <View style={s.healthBar}>
        <View style={[s.healthFill, { width: `${health}%` }]} />
      </View>
      <Text style={s.healthTxt}>Santé pulmonaire : {health}%</Text>
      <Text style={s.cyclesTxt}>Cycle {cycles + 1} / {totalCycles}</Text>
    </View>
  );
};

export default GameLung;