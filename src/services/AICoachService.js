const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const buildSystemPrompt = (userProfile, quitPlan, stats) => {
  return `Tu es un coach bienveillant et expert en sevrage tabagique dans l'app FreeSmoke.
Tu parles français, tu es empathique, encourageant et scientifiquement précis.
Tu ne juges JAMAIS les rechutes — tu les traites avec compassion et science.

PROFIL DE L'UTILISATEUR :
- Prénom : ${userProfile?.displayName || 'Utilisateur'}
- Cigarettes/jour (base) : ${userProfile?.cigarsPerDay || '?'}
- Années de tabagisme : ${userProfile?.smokeYears || '?'} ans
- Prix du paquet : ${userProfile?.packPrice || '?'}€
- Dépendance : ${userProfile?.dependencyLevel || '?'} (score ${userProfile?.dependencyScore || '?'}/10)
- Style d'arrêt : ${userProfile?.quitStyle || '?'}
- Motivation : ${userProfile?.motivation || 'Non renseignée'}

PLAN DE SEVRAGE :
- Limite actuelle : ${quitPlan?.currentDailyLimit || '?'} cig/jour
- Réduction/semaine : ${quitPlan?.weeklyReduction || '?'} cigarettes
- Date objectif : ${quitPlan?.targetQuitDate ? new Date(quitPlan.targetQuitDate).toLocaleDateString('fr-FR') : '?'}

STATISTIQUES ACTUELLES :
- Streak actuel : ${stats?.streak || 0} jours
- Argent économisé : ${stats?.moneySaved || 0}€
- Envies surmontées : ${stats?.cravingsDefeated || 0}
- Cigarettes aujourd'hui : ${stats?.todayCount || 0}

RÈGLES IMPORTANTES :
1. Réponds TOUJOURS en français
2. Sois court et percutant (max 3 phrases sauf si on te demande plus)
3. Utilise le prénom de l'utilisateur
4. Cite des faits scientifiques quand c'est pertinent
5. En cas de rechute : empathie d'abord, plan ensuite
6. Propose toujours une action concrète à la fin
7. Utilise des emojis avec modération`;
};

export const sendMessageToCoach = async (
  userMessage,
  conversationHistory = [],
  userProfile,
  quitPlan,
  stats
) => {
  try {
    const systemPrompt = buildSystemPrompt(userProfile, quitPlan, stats);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erreur API Groq');
    }

    const data = await response.json();
    return {
      success: true,
      message: data.choices[0].message.content,
    };
  } catch (error) {
    console.error('AICoach error:', error);
    return {
      success: false,
      message: 'Je suis temporairement indisponible. Essaie l\'outil SOS en attendant 💚',
    };
  }
};

export const getContextualMessage = async (context, userProfile, quitPlan, stats) => {
  const contextMessages = {
    relapse:   `J'ai rechuté aujourd'hui. J'ai besoin d'aide.`,
    milestone: `Je viens de débloquer un badge ! Dis-moi quelque chose de motivant.`,
    craving:   `J'ai une forte envie de fumer là maintenant. Aide-moi à tenir.`,
    morning:   `Bonjour ! Comment bien commencer ma journée sans fumer ?`,
    evening:   `Bilan de la journée : j'ai fumé ${stats?.todayCount || 0} cigarettes aujourd'hui.`,
    streak:    `Je viens d'atteindre ${stats?.streak || 0} jours de streak !`,
  };

  const message = contextMessages[context] || 'Comment vas-tu ?';
  return sendMessageToCoach(message, [], userProfile, quitPlan, stats);
};