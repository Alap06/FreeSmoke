export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
};

export const formatShortDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return `${days[date.getDay()]} ${date.getDate()}`;
};

export const getMinutesSinceQuit = (quitDate) => {
  if (!quitDate) return 0;
  return Math.floor((Date.now() - new Date(quitDate).getTime()) / 60000);
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}j`;
};