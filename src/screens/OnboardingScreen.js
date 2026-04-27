import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert, Dimensions, Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');

const FAGERSTROM = [
  { q: 'Quand fumez-vous votre première cigarette après le réveil ?', options: ['Dans les 5 min', 'Entre 6-30 min', 'Entre 31-60 min', 'Après 60 min'], scores: [3, 2, 1, 0] },
  { q: 'Trouvez-vous difficile de ne pas fumer dans les endroits interdits ?', options: ['Oui', 'Non'], scores: [1, 0] },
  { q: 'Quelle cigarette vous manquerait le plus ?', options: ['La première du matin', 'Une autre'], scores: [1, 0] },
  { q: 'Combien de cigarettes fumez-vous par jour ?', options: ['31 ou +', '21-30', '11-20', '10 ou -'], scores: [3, 2, 1, 0] },
  { q: 'Fumez-vous plus le matin ?', options: ['Oui', 'Non'], scores: [1, 0] },
  { q: 'Fumez-vous même malade ?', options: ['Oui', 'Non'], scores: [1, 0] },
];

const QUIT_STYLES = [
  { id: 'cold_turkey', label: 'Arrêt brutal', icon: '❄️', desc: 'Stop immédiat', color: '#457B9D' },
  { id: 'gradual',     label: 'Réduction',    icon: '📉', desc: 'Progressivement', color: COLORS.primary },
  { id: 'nrt',         label: 'Substituts',   icon: '💊', desc: 'Aide médicale', color: '#9C27B0' },
];

const WELCOME_SLIDES = [
  { emoji: '🚭', title: 'Bienvenue sur FreeSmoke', desc: 'Ton compagnon intelligent pour arrêter de fumer, une cigarette à la fois.', color: COLORS.primaryDark },
  { emoji: '📊', title: 'Suis ta progression', desc: 'Visualise tes progrès en temps réel et célèbre chaque victoire.', color: '#1B4332' },
  { emoji: '🤖', title: 'Coach IA personnalisé', desc: 'Un coach disponible 24h/24 qui connaît ton profil et t\'accompagne.', color: '#2D3A8C' },
  { emoji: '🏆', title: 'Gagne des récompenses', desc: 'Débloque des badges et monte en niveau pour rester motivé.', color: '#7B2D00' },
];

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0); // 0=welcome, 1=profile, 2=fagerstrom, 3=quitstyle, 4=motivation
  const [slideIndex, setSlideIndex] = useState(0);
  const [fagerstromAnswers, setFagerstromAnswers] = useState([]);
  const [profile, setProfile] = useState({
    cigarsPerDay: '10', packPrice: '10', smokeYears: '5',
    motivation: '', quitStyle: 'gradual', displayName: '',
  });
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setTimeout(callback, 200);
  };

  const getFagerstromScore = () => fagerstromAnswers.reduce((a, b) => a + b, 0);

  const getDependencyLevel = (score) => {
    if (score <= 2) return { label: 'Faible', color: COLORS.success, emoji: '🟢' };
    if (score <= 4) return { label: 'Modérée', color: COLORS.warning, emoji: '🟡' };
    if (score <= 6) return { label: 'Forte', color: '#FF6B35', emoji: '🟠' };
    return { label: 'Très forte', color: COLORS.danger, emoji: '🔴' };
  };

  const generateQuitPlan = (profileData, score) => {
    const dailyLimit = parseInt(profileData.cigarsPerDay) || 10;
    const weeklyReduction = Math.max(1, Math.floor(dailyLimit / 8));
    const weeksToQuit = Math.ceil(dailyLimit / weeklyReduction);
    const targetQuitDate = new Date();
    targetQuitDate.setDate(targetQuitDate.getDate() + weeksToQuit * 7);
    return {
      startDate: new Date().toISOString(),
      targetQuitDate: targetQuitDate.toISOString(),
      weeklyReduction,
      currentDailyLimit: dailyLimit,
      dependencyScore: score,
      dependencyLevel: getDependencyLevel(score).label,
    };
  };

  const handleFinish = async () => {
    if (!profile.displayName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre prénom');
      return;
    }
    const score = getFagerstromScore();
    const dep = getDependencyLevel(score);
    const finalProfile = {
      ...profile,
      cigarsPerDay: parseInt(profile.cigarsPerDay) || 10,
      packPrice: parseFloat(profile.packPrice) || 10,
      smokeYears: parseInt(profile.smokeYears) || 1,
      dependencyScore: score,
      dependencyLevel: dep.label,
      createdAt: new Date().toISOString(),
    };
    const plan = generateQuitPlan(finalProfile, score);
    await completeOnboarding(finalProfile, plan);
  };

  const s = StyleSheet.create({
    container:     { flex: 1, backgroundColor: COLORS.primaryDark },
    
    // Welcome slides
    slide:         { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
    slideEmoji:    { fontSize: 80, marginBottom: 20 },
    slideTitle:    { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
    slideDesc:     { fontSize: 16, color: '#A8D5BA', textAlign: 'center', lineHeight: 24 },
    dotsRow:       { flexDirection: 'row', gap: 8, marginTop: 30 },
    dot:           { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
    dotActive:     { width: 24, backgroundColor: '#fff' },
    nextBtn:       { backgroundColor: '#fff', borderRadius: 30, paddingHorizontal: 40, paddingVertical: 14, marginTop: 30 },
    nextBtnText:   { color: COLORS.primaryDark, fontSize: 16, fontWeight: 'bold' },
    skipBtn:       { marginTop: 16, padding: 10 },
    skipBtnText:   { color: 'rgba(255,255,255,0.6)', fontSize: 14 },

    // Form steps
    formContainer: { flex: 1, backgroundColor: theme.background },
    formHeader:    { backgroundColor: COLORS.primaryDark, padding: 24, paddingTop: 50 },
    formHeaderIcon:{ fontSize: 36, marginBottom: 8 },
    formTitle:     { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    formSubtitle:  { fontSize: 14, color: '#A8D5BA', marginTop: 4 },
    stepsRow:      { flexDirection: 'row', marginTop: 16, gap: 6 },
    stepDot:       { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
    stepDotActive: { backgroundColor: '#fff' },
    formBody:      { flex: 1, padding: 20 },
    
    // Input
    inputGroup:    { marginBottom: 16 },
    inputLabel:    { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input:         { backgroundColor: theme.card, borderRadius: 14, padding: 14, fontSize: 16, color: theme.text, borderWidth: 1.5, borderColor: theme.border },
    inputFocused:  { borderColor: COLORS.primary },
    inputRow:      { flexDirection: 'row', gap: 12 },

    // Options
    optionBtn:     { backgroundColor: theme.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: theme.border },
    optionActive:  { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight + '15' },
    optionText:    { fontSize: 15, color: theme.text, textAlign: 'center' },
    optionActiveText: { color: COLORS.primary, fontWeight: '600' },

    // Question card
    questionCard:  { backgroundColor: theme.card, borderRadius: 18, padding: 18, marginBottom: 16, elevation: 2 },
    questionNum:   { fontSize: 12, color: COLORS.primary, fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase' },
    questionText:  { fontSize: 16, color: theme.text, fontWeight: '600', lineHeight: 22 },

    // Quit style
    styleGrid:     { flexDirection: 'row', gap: 10, marginBottom: 16 },
    styleCard:     { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: theme.border, backgroundColor: theme.card },
    styleCardActive:{ borderWidth: 2 },
    styleIcon:     { fontSize: 32, marginBottom: 8 },
    styleLabel:    { fontSize: 13, fontWeight: 'bold', color: theme.text, textAlign: 'center' },
    styleDesc:     { fontSize: 11, color: theme.textSecondary, textAlign: 'center', marginTop: 4 },

    // Result card
    resultCard:    { borderRadius: 18, padding: 20, marginBottom: 16, alignItems: 'center' },
    resultScore:   { fontSize: 48, fontWeight: 'bold', color: '#fff' },
    resultLabel:   { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    resultDesc:    { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 8, textAlign: 'center' },

    // Bottom button
    bottomBtn:     { backgroundColor: COLORS.primary, borderRadius: 16, padding: 16, alignItems: 'center', margin: 20, marginTop: 0 },
    bottomBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },

    // Textarea
    textarea:      { height: 100, textAlignVertical: 'top' },

    // Motivation
    motivCard:     { backgroundColor: COLORS.primaryLight + '15', borderRadius: 16, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
    motivText:     { fontSize: 14, color: theme.text, lineHeight: 22 },
  });

  // Welcome slides
  if (step === 0) {
    const slide = WELCOME_SLIDES[slideIndex];
    const isLast = slideIndex === WELCOME_SLIDES.length - 1;
    return (
      <View style={[s.container, { backgroundColor: slide.color }]}>
        <Animated.View style={[s.slide, { opacity: fadeAnim }]}>
          <Text style={s.slideEmoji}>{slide.emoji}</Text>
          <Text style={s.slideTitle}>{slide.title}</Text>
          <Text style={s.slideDesc}>{slide.desc}</Text>
          <View style={s.dotsRow}>
            {WELCOME_SLIDES.map((_, i) => (
              <View key={i} style={[s.dot, slideIndex === i && s.dotActive]} />
            ))}
          </View>
          <TouchableOpacity style={s.nextBtn}
            onPress={() => {
              if (isLast) {
                animateTransition(() => setStep(1));
              } else {
                animateTransition(() => setSlideIndex(slideIndex + 1));
              }
            }}>
            <Text style={s.nextBtnText}>{isLast ? 'Commencer →' : 'Suivant →'}</Text>
          </TouchableOpacity>
          {!isLast && (
            <TouchableOpacity style={s.skipBtn} onPress={() => animateTransition(() => setStep(1))}>
              <Text style={s.skipBtnText}>Passer</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    );
  }

  // Profile step
  if (step === 1) {
    return (
      <View style={s.formContainer}>
        <View style={s.formHeader}>
          <Text style={s.formHeaderIcon}>👤</Text>
          <Text style={s.formTitle}>Ton profil</Text>
          <Text style={s.formSubtitle}>Ces infos nous aident à personnaliser ton plan</Text>
          <View style={s.stepsRow}>
            {[1,2,3,4].map(i => <View key={i} style={[s.stepDot, i === 1 && s.stepDotActive]} />)}
          </View>
        </View>
        <ScrollView style={s.formBody} showsVerticalScrollIndicator={false}>
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Prénom</Text>
            <TextInput style={s.input} placeholder="Ex: Ahmed" placeholderTextColor={theme.textSecondary}
              value={profile.displayName} onChangeText={v => setProfile({ ...profile, displayName: v })} />
          </View>
          <View style={s.inputRow}>
            <View style={[s.inputGroup, { flex: 1 }]}>
              <Text style={s.inputLabel}>Cig/jour</Text>
              <TextInput style={s.input} placeholder="10" placeholderTextColor={theme.textSecondary}
                keyboardType="numeric" value={profile.cigarsPerDay}
                onChangeText={v => setProfile({ ...profile, cigarsPerDay: v })} />
            </View>
            <View style={[s.inputGroup, { flex: 1 }]}>
              <Text style={s.inputLabel}>Prix paquet €</Text>
              <TextInput style={s.input} placeholder="10" placeholderTextColor={theme.textSecondary}
                keyboardType="decimal-pad" value={profile.packPrice}
                onChangeText={v => setProfile({ ...profile, packPrice: v })} />
            </View>
          </View>
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Années de tabagisme</Text>
            <TextInput style={s.input} placeholder="5" placeholderTextColor={theme.textSecondary}
              keyboardType="numeric" value={profile.smokeYears}
              onChangeText={v => setProfile({ ...profile, smokeYears: v })} />
          </View>
        </ScrollView>
        <TouchableOpacity style={s.bottomBtn} onPress={() => {
          if (!profile.displayName.trim()) { Alert.alert('Erreur', 'Entre ton prénom'); return; }
          animateTransition(() => setStep(2));
        }}>
          <Text style={s.bottomBtnText}>Continuer →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fagerstrom step
  if (step === 2) {
    const currentQ = FAGERSTROM[fagerstromAnswers.length];
    const score = getFagerstromScore();
    const dep = getDependencyLevel(score);
    const isDone = fagerstromAnswers.length === 6;

    return (
      <View style={s.formContainer}>
        <View style={s.formHeader}>
          <Text style={s.formHeaderIcon}>🧠</Text>
          <Text style={s.formTitle}>Test de dépendance</Text>
          <Text style={s.formSubtitle}>Test Fagerström — {fagerstromAnswers.length}/6 questions</Text>
          <View style={s.stepsRow}>
            {[1,2,3,4].map(i => <View key={i} style={[s.stepDot, i <= 2 && s.stepDotActive]} />)}
          </View>
        </View>
        <ScrollView style={s.formBody}>
          {isDone ? (
            <>
              <View style={[s.resultCard, { backgroundColor: dep.color }]}>
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Votre score</Text>
                <Text style={s.resultScore}>{score}/10</Text>
                <Text style={s.resultLabel}>{dep.emoji} Dépendance {dep.label}</Text>
                <Text style={s.resultDesc}>Votre plan sera adapté à votre niveau de dépendance</Text>
              </View>
              <View style={s.motivCard}>
                <Text style={s.motivText}>
                  {score <= 2 && '✅ Bonne nouvelle ! Votre dépendance est faible. L\'arrêt sera plus accessible pour vous.'}
                  {score > 2 && score <= 4 && '💪 Votre dépendance est modérée. Avec un bon plan, vous pouvez y arriver !'}
                  {score > 4 && score <= 6 && '🎯 Dépendance forte mais surmontable. Notre coaching personnalisé est fait pour vous.'}
                  {score > 6 && '🤝 Dépendance très forte. Vous aurez besoin d\'un soutien adapté — nous sommes là !'}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={s.questionCard}>
                <Text style={s.questionNum}>Question {fagerstromAnswers.length + 1} sur 6</Text>
                <Text style={s.questionText}>{currentQ.q}</Text>
              </View>
              {currentQ.options.map((opt, i) => (
                <TouchableOpacity key={i} style={s.optionBtn}
                  onPress={() => {
                    const newAnswers = [...fagerstromAnswers, currentQ.scores[i]];
                    setFagerstromAnswers(newAnswers);
                  }}>
                  <Text style={s.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
        {isDone && (
          <TouchableOpacity style={s.bottomBtn} onPress={() => animateTransition(() => setStep(3))}>
            <Text style={s.bottomBtnText}>Continuer →</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Quit style step
  if (step === 3) {
    return (
      <View style={s.formContainer}>
        <View style={s.formHeader}>
          <Text style={s.formHeaderIcon}>🎯</Text>
          <Text style={s.formTitle}>Style d'arrêt</Text>
          <Text style={s.formSubtitle}>Comment veux-tu arrêter de fumer ?</Text>
          <View style={s.stepsRow}>
            {[1,2,3,4].map(i => <View key={i} style={[s.stepDot, i <= 3 && s.stepDotActive]} />)}
          </View>
        </View>
        <ScrollView style={s.formBody}>
          <View style={s.styleGrid}>
            {QUIT_STYLES.map(qs => (
              <TouchableOpacity key={qs.id}
                style={[s.styleCard, profile.quitStyle === qs.id && { ...s.styleCardActive, borderColor: qs.color, backgroundColor: qs.color + '15' }]}
                onPress={() => setProfile({ ...profile, quitStyle: qs.id })}>
                <Text style={s.styleIcon}>{qs.icon}</Text>
                <Text style={[s.styleLabel, profile.quitStyle === qs.id && { color: qs.color }]}>{qs.label}</Text>
                <Text style={s.styleDesc}>{qs.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.motivCard}>
            <Text style={s.motivText}>
              {profile.quitStyle === 'cold_turkey' && '❄️ Arrêt brutal : Stop immédiat. Difficile mais efficace pour les personnes très déterminées.'}
              {profile.quitStyle === 'gradual' && '📉 Réduction progressive : Diminuer de semaine en semaine. Recommandé pour la plupart des fumeurs.'}
              {profile.quitStyle === 'nrt' && '💊 Substituts nicotiniques : Patches, gommes, inhaleurs. Recommandé pour les fortes dépendances.'}
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity style={s.bottomBtn} onPress={() => animateTransition(() => setStep(4))}>
          <Text style={s.bottomBtnText}>Continuer →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Motivation step
  if (step === 4) {
    return (
      <View style={s.formContainer}>
        <View style={s.formHeader}>
          <Text style={s.formHeaderIcon}>💪</Text>
          <Text style={s.formTitle}>Ta motivation</Text>
          <Text style={s.formSubtitle}>Pourquoi veux-tu arrêter ?</Text>
          <View style={s.stepsRow}>
            {[1,2,3,4].map(i => <View key={i} style={[s.stepDot, s.stepDotActive]} />)}
          </View>
        </View>
        <ScrollView style={s.formBody}>
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Ta raison principale (optionnel)</Text>
            <TextInput
              style={[s.input, s.textarea]}
              placeholder="Ex: Pour ma santé, pour ma famille, pour économiser de l'argent..."
              placeholderTextColor={theme.textSecondary}
              multiline value={profile.motivation}
              onChangeText={v => setProfile({ ...profile, motivation: v })} />
          </View>

          <View style={[s.motivCard, { backgroundColor: COLORS.primaryDark + '15', borderLeftColor: COLORS.primaryDark }]}>
            <Text style={[s.motivText, { fontWeight: 'bold', marginBottom: 8 }]}>🎉 Ton plan est prêt !</Text>
            <Text style={s.motivText}>
              ✅ Limite de départ : {profile.cigarsPerDay} cig/jour{'\n'}
              📉 Réduction : -{Math.max(1, Math.floor(parseInt(profile.cigarsPerDay || 10) / 8))} cig/semaine{'\n'}
              💰 Économies potentielles : {Math.round((parseInt(profile.cigarsPerDay || 10) / 20) * parseFloat(profile.packPrice || 10) * 30)}€/mois{'\n'}
              🤖 Coach IA personnalisé activé{'\n'}
              🏆 Badges et récompenses débloqués
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity style={[s.bottomBtn, { backgroundColor: COLORS.primary }]} onPress={handleFinish}>
          <Text style={s.bottomBtnText}>🚀 Démarrer mon parcours !</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

export default OnboardingScreen;