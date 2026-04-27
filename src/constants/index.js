// 🎨 Couleurs principales
export const COLORS = {
  primary: '#2D6A4F',        // Vert forêt
  primaryLight: '#52B788',   // Vert clair
  primaryDark: '#1B4332',    // Vert foncé
  accent: '#F4845F',         // Orange SOS
  warning: '#F4A261',        // Orange warning
  danger: '#E63946',         // Rouge danger
  success: '#52B788',        // Vert succès
  gold: '#FFD700',           // Or badges

  // Backgrounds
  background: '#F8FAF9',
  backgroundDark: '#0D1F1A',
  card: '#FFFFFF',
  cardDark: '#1A2E27',

  // Textes
  text: '#1B1B1B',
  textDark: '#F0F0F0',
  textSecondary: '#6B6B6B',
  textSecondaryDark: '#A0A0A0',

  border: '#E0E0E0',
  borderDark: '#2A3D35',
};

// 🚬 Triggers de cigarette
export const TRIGGERS = [
  { id: 'stress',   label: 'Stress',        icon: '😤', color: '#E63946' },
  { id: 'boredom',  label: 'Ennui',         icon: '😒', color: '#457B9D' },
  { id: 'coffee',   label: 'Après café',    icon: '☕', color: '#8B5E3C' },
  { id: 'meal',     label: 'Après repas',   icon: '🍽️', color: '#F4A261' },
  { id: 'social',   label: 'Social',        icon: '👥', color: '#9C27B0' },
  { id: 'other',    label: 'Autre',         icon: '❓', color: '#607D8B' },
];

// 🏅 Badges
export const BADGES_CONFIG = [
  { id: 'first_log',      name: 'Premier Pas',        icon: '🎯', xp: 10,  description: 'Premier journal enregistré' },
  { id: 'day_1',          name: 'Jour 1',              icon: '⭐', xp: 20,  description: 'Première journée sous la limite' },
  { id: 'streak_3',       name: 'Guerrier 3j',         icon: '🔥', xp: 50,  description: '3 jours consécutifs' },
  { id: 'streak_7',       name: 'Semaine Champion',    icon: '🏆', xp: 100, description: '7 jours consécutifs' },
  { id: 'streak_30',      name: 'Légende 30j',         icon: '👑', xp: 500, description: '30 jours consécutifs' },
  { id: 'money_10',       name: 'Économe',             icon: '💰', xp: 30,  description: '10€ économisés' },
  { id: 'craving_5',      name: 'Résistant',           icon: '💪', xp: 40,  description: '5 envies surmontées' },
  { id: 'sos_used',       name: 'SOS Hero',            icon: '🦸', xp: 20,  description: 'Outil SOS utilisé' },
  { id: 'mission_7',      name: 'Discipliné',          icon: '🎖️', xp: 80,  description: '7 missions complétées' },
  { id: 'diversified',    name: 'Équilibré',           icon: '🌈', xp: 60,  description: '3 outils SOS différents utilisés' },
];

// 📊 Niveaux
export const LEVELS = [
  { level: 1, name: 'Fumeur',    minXP: 0,    icon: '🚬' },
  { level: 2, name: 'Réducteur', minXP: 100,  icon: '📉' },
  { level: 3, name: 'Quitteur',  minXP: 300,  icon: '🌱' },
  { level: 4, name: 'Champion',  minXP: 700,  icon: '🏆' },
  { level: 5, name: 'Légende',   minXP: 1500, icon: '👑' },
];

// 💊 Symptômes de sevrage
export const SYMPTOMS = [
  { id: 'headache',     label: 'Maux de tête',  icon: '🤕' },
  { id: 'irritability', label: 'Irritabilité',  icon: '😠' },
  { id: 'anxiety',      label: 'Anxiété',       icon: '😰' },
  { id: 'insomnia',     label: 'Insomnie',      icon: '😴' },
  { id: 'hunger',       label: 'Faim',          icon: '🍔' },
];

// 🌿 Milestones santé
export const HEALTH_MILESTONES = [
  { id: 'min_20',  time: 20,        unit: 'min', title: 'Tension artérielle', desc: 'Ta tension revient à la normale',    icon: '❤️' },
  { id: 'h_8',     time: 8,         unit: 'h',   title: 'Oxygène',            desc: 'Taux d\'oxygène normalisé',          icon: '🫁' },
  { id: 'd_2',     time: 2,         unit: 'd',   title: 'Odorat & Goût',      desc: 'Sens améliorés',                    icon: '👃' },
  { id: 'w_2',     time: 14,        unit: 'd',   title: 'Circulation',        desc: 'Circulation sanguine améliorée',    icon: '🩸' },
  { id: 'm_1',     time: 30,        unit: 'd',   title: 'Poumons',            desc: 'Capacité pulmonaire +30%',          icon: '🌬️' },
  { id: 'y_1',     time: 365,       unit: 'd',   title: 'Cœur',              desc: 'Risque cardiaque divisé par 2',     icon: '💚' },
  { id: 'y_10',    time: 3650,      unit: 'd',   title: 'Cancer',             desc: 'Risque cancer poumon -50%',         icon: '🏥' },
];