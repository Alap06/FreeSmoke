import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants';

const GAMES = [
  {
    id: 'sniper',
    title: 'Habit Sniper',
    icon: '🎯',
    desc: 'Tape pour détruire les cigarettes !',
    duration: '60 sec',
    color: '#E63946',
    xp: 20,
  },
  {
    id: 'lung',
    title: 'Lung Builder',
    icon: '🫁',
    desc: 'Respire pour guérir tes poumons',
    duration: '2 min',
    color: '#2D6A4F',
    xp: 25,
  },
  {
    id: 'focus',
    title: 'Focus Breaker',
    icon: '🧩',
    desc: 'Concentre-toi sur ce puzzle',
    duration: '60 sec',
    color: '#457B9D',
    xp: 20,
  },
];

const MiniGamesScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const s = StyleSheet.create({
    container:  { flex: 1, backgroundColor: theme.background },
    scroll:     { padding: 16 },
    header:     { backgroundColor: COLORS.primaryDark, borderRadius: 20, padding: 20, marginBottom: 20, alignItems: 'center' },
    headerIcon: { fontSize: 40, marginBottom: 8 },
    headerTitle:{ fontSize: 22, fontWeight: 'bold', color: '#fff' },
    headerSub:  { fontSize: 13, color: '#A8D5BA', marginTop: 4, textAlign: 'center' },
    card:       { borderRadius: 20, padding: 20, marginBottom: 14, elevation: 3 },
    cardTop:    { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    gameIcon:   { fontSize: 44, marginRight: 16 },
    gameTitle:  { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    gameDesc:   { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    infoBadge:  { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
    infoText:   { color: '#fff', fontSize: 12, fontWeight: '600' },
    playBtn:    { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
    playText:   { fontWeight: 'bold', fontSize: 14 },
  });

  return (
    <View style={s.container}>
      <ScrollView style={s.scroll}>
        <View style={s.header}>
          <Text style={s.headerIcon}>🎮</Text>
          <Text style={s.headerTitle}>Mini-Jeux Anti-Envie</Text>
          <Text style={s.headerSub}>Joue pendant 7 minutes{'\n'}et l'envie disparaîtra !</Text>
        </View>

        {GAMES.map(game => (
          <TouchableOpacity
            key={game.id}
            style={[s.card, { backgroundColor: game.color }]}
            onPress={() => navigation.navigate(game.id === 'sniper' ? 'GameSniper' : game.id === 'lung' ? 'GameLung' : 'GameFocus')}
          >
            <View style={s.cardTop}>
              <Text style={s.gameIcon}>{game.icon}</Text>
              <View>
                <Text style={s.gameTitle}>{game.title}</Text>
                <Text style={s.gameDesc}>{game.desc}</Text>
              </View>
            </View>
            <View style={s.cardBottom}>
              <View style={s.infoBadge}>
                <Text style={s.infoText}>⏱️ {game.duration}</Text>
              </View>
              <View style={s.infoBadge}>
                <Text style={s.infoText}>+{game.xp} XP</Text>
              </View>
              <TouchableOpacity style={s.playBtn}
                onPress={() => navigation.navigate(game.id === 'sniper' ? 'GameSniper' : game.id === 'lung' ? 'GameLung' : 'GameFocus')}>
                <Text style={[s.playText, { color: game.color }]}>▶ Jouer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MiniGamesScreen;