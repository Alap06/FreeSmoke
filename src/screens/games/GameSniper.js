import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants';

const { width, height } = Dimensions.get('window');

const GameSniper = ({ navigation }) => {
  const { logCravingEvent, awardXP } = useApp();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [targets, setTargets] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const nextId = useRef(0);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setGameOver(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  useEffect(() => {
    if (!started || gameOver) return;
    const spawner = setInterval(() => {
      const id = nextId.current++;
      const x = Math.random() * (width - 70);
      const y = Math.random() * (height * 0.5) + 100;
      const anim = new Animated.Value(1);
      setTargets(prev => [...prev, { id, x, y, anim }]);
      Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }).start(() => {
        setTargets(prev => prev.filter(t => t.id !== id));
      });
    }, 800);
    return () => clearInterval(spawner);
  }, [started, gameOver]);

  const hitTarget = (id) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    setScore(s => s + 10);
  };

  const handleFinish = async () => {
    await awardXP(20, 'Habit Sniper');
    await logCravingEvent('sniper', true, 60);
    navigation.goBack();
  };

  const s = StyleSheet.create({
    container:  { flex: 1, backgroundColor: '#1a1a2e' },
    hud:        { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
    hudText:    { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    target:     { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
    targetEmoji:{ fontSize: 44 },
    startCard:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
    startTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
    startDesc:  { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
    startBtn:   { backgroundColor: COLORS.accent, borderRadius: 20, paddingHorizontal: 40, paddingVertical: 16 },
    startBtnTxt:{ color: '#fff', fontSize: 20, fontWeight: 'bold' },
    gameOver:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
    goTitle:    { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    goScore:    { fontSize: 24, color: COLORS.gold, marginBottom: 20 },
    goBtn:      { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 40, paddingVertical: 16 },
    goBtnTxt:   { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  });

  if (!started) {
    return (
      <View style={[s.container, s.startCard]}>
        <Text style={{ fontSize: 60, marginBottom: 16 }}>🎯</Text>
        <Text style={s.startTitle}>Habit Sniper</Text>
        <Text style={s.startDesc}>Tape sur les cigarettes pour les détruire !{'\n'}Plus tu en détruis, plus l'envie disparaît !</Text>
        <TouchableOpacity style={s.startBtn} onPress={() => setStarted(true)}>
          <Text style={s.startBtnTxt}>▶ Commencer !</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameOver) {
    return (
      <View style={[s.container, s.gameOver]}>
        <Text style={{ fontSize: 60, marginBottom: 12 }}>🏆</Text>
        <Text style={s.goTitle}>Terminé !</Text>
        <Text style={s.goScore}>Score : {score} pts</Text>
        <Text style={{ color: '#aaa', marginBottom: 24, textAlign: 'center' }}>
          Tu as détruit {score / 10} cigarettes !{'\n'}L'envie est vaincue 💪
        </Text>
        <TouchableOpacity style={s.goBtn} onPress={handleFinish}>
          <Text style={s.goBtnTxt}>✅ Terminer (+20 XP)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.hud}>
        <Text style={s.hudText}>🎯 {score}</Text>
        <Text style={s.hudText}>⏱️ {timeLeft}s</Text>
      </View>
      {targets.map(t => (
        <Animated.View key={t.id} style={[s.target, { left: t.x, top: t.y, opacity: t.anim }]}>
          <TouchableOpacity onPress={() => hitTarget(t.id)}>
            <Text style={s.targetEmoji}>🚬</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

export default GameSniper;