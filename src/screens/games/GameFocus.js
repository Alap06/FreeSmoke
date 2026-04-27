import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants';

const { width } = Dimensions.get('window');
const GRID = 4;
const TILE_SIZE = (width - 60) / GRID;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const generatePuzzle = () => {
  const nums = Array.from({ length: GRID * GRID - 1 }, (_, i) => i + 1);
  nums.push(null);
  return shuffle(nums);
};

const GameFocus = ({ navigation }) => {
  const { logCravingEvent, awardXP } = useApp();
  const [tiles, setTiles] = useState(generatePuzzle());
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const isSolved = (t) => t.every((v, i) => v === (i < GRID * GRID - 1 ? i + 1 : null));

  useEffect(() => {
    if (won || lost) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); setLost(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [won, lost]);

  const moveTile = (index) => {
    const empty = tiles.indexOf(null);
    const row = Math.floor(index / GRID), col = index % GRID;
    const eRow = Math.floor(empty / GRID), eCol = empty % GRID;
    const adjacent = (Math.abs(row - eRow) === 1 && col === eCol) || (Math.abs(col - eCol) === 1 && row === eRow);
    if (!adjacent) return;
    const newTiles = [...tiles];
    [newTiles[index], newTiles[empty]] = [newTiles[empty], newTiles[index]];
    setTiles(newTiles);
    setMoves(m => m + 1);
    if (isSolved(newTiles)) setWon(true);
  };

  const handleFinish = async (success) => {
    await awardXP(success ? 20 : 10, 'Focus Breaker');
    await logCravingEvent('focus', success, 90 - timeLeft);
    navigation.goBack();
  };

  const s = StyleSheet.create({
    container:  { flex: 1, backgroundColor: '#1a2a3a', alignItems: 'center', justifyContent: 'center', padding: 20 },
    hud:        { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    hudText:    { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    grid:       { flexDirection: 'row', flexWrap: 'wrap', width: width - 40 },
    tile:       { width: TILE_SIZE - 4, height: TILE_SIZE - 4, margin: 2, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, elevation: 3 },
    emptyTile:  { backgroundColor: 'transparent', elevation: 0 },
    tileText:   { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    resultCard: { alignItems: 'center' },
    resultIcon: { fontSize: 70, marginBottom: 12 },
    resultTitle:{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    resultSub:  { fontSize: 15, color: '#aaa', textAlign: 'center', marginBottom: 24 },
    resultBtn:  { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 40, paddingVertical: 14 },
    resultBtnTxt:{ color: '#fff', fontSize: 17, fontWeight: 'bold' },
  });

  if (won || lost) {
    return (
      <View style={s.container}>
        <View style={s.resultCard}>
          <Text style={s.resultIcon}>{won ? '🏆' : '😅'}</Text>
          <Text style={s.resultTitle}>{won ? 'Puzzle résolu !' : 'Temps écoulé !'}</Text>
          <Text style={s.resultSub}>{won ? `En ${moves} mouvements !\nMind focalisé = envie vaincue 💪` : 'Bien essayé !\nL\'envie a quand même diminué 💚'}</Text>
          <TouchableOpacity style={s.resultBtn} onPress={() => handleFinish(won)}>
            <Text style={s.resultBtnTxt}>✅ Terminer (+{won ? 20 : 10} XP)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.hud}>
        <Text style={s.hudText}>🧩 {moves} mvts</Text>
        <Text style={s.hudText}>⏱️ {timeLeft}s</Text>
      </View>
      <Text style={{ color: '#aaa', marginBottom: 16, fontSize: 14 }}>Remets les chiffres dans l'ordre !</Text>
      <View style={s.grid}>
        {tiles.map((tile, index) => (
          <TouchableOpacity
            key={index}
            style={[s.tile, tile === null && s.emptyTile]}
            onPress={() => moveTile(index)}
            disabled={tile === null}
          >
            {tile !== null && <Text style={s.tileText}>{tile}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default GameFocus;