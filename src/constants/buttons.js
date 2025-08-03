export const BUTTON_CONFIG = {
  ARCHIVES: {
    id: 'archives',
    title: 'ARCHIVES',
    subtitle: '',
    icon: 'archives_icon.svg',
    slot: 'openArchives',
    successMessage: 'Archives opened successfully! 📁',
    errorMessage: 'Failed to open Archives'
  },
  TELEPHONE: {
    id: 'telephone',
    title: 'TÉLÉPHONE',
    subtitle: '& STANDARD',
    icon: 'telephone_icon.svg',
    slot: 'openTelephone',
    successMessage: 'Telephone system opened! 📞',
    errorMessage: 'Failed to open Telephone system'
  },
  REUNIONS: {
    id: 'reunions',
    title: 'REUNIONS',
    subtitle: '& SALLES',
    icon: 'reunion_icon.svg',
    slot: 'openReunions',
    successMessage: 'Reunions & Salles opened! 👥',
    errorMessage: 'Failed to open Reunions & Salles'
  },
  ACCUEIL: {
    id: 'accueil',
    title: 'ACCUEIL',
    subtitle: 'VISITEURS',
    icon: 'accueil_icon.svg',
    slot: 'openAccueil',
    successMessage: 'Accueil opened! 🏠',
    errorMessage: 'Failed to open Accueil'
  },
  COMMANDES: {
    id: 'commandes',
    title: 'COMMANDES',
    subtitle: '& STOCKS',
    icon: 'commandes_icon.svg',
    slot: 'openCommandes',
    successMessage: 'Commandes opened! 📋',
    errorMessage: 'Failed to open Commandes'
  },
  EMAILS: {
    id: 'emails',
    title: 'EMAILS',
    subtitle: '& MESSAGERIE',
    icon: 'email_icon.svg',
    slot: 'openEmails',
    successMessage: 'Emails opened! 📧',
    errorMessage: 'Failed to open Emails'
  },
  AGENDA: {
    id: 'agenda',
    title: 'AGENDA',
    subtitle: '& RENDEZ- VOUS',
    icon: 'agenda_icon.svg',
    slot: 'openAgenda',
    successMessage: 'Agenda opened! 📅',
    errorMessage: 'Failed to open Agenda'
  },
  COLIS: {
    id: 'colis',
    title: 'COLIS',
    subtitle: '& COURRIERS',
    icon: 'colis_icon.svg',
    slot: 'openColis',
    successMessage: 'Colis opened! 📦',
    errorMessage: 'Failed to open Colis'
  }
};

export const THEME_CONFIG = {
  light: {
    background: '#E4DAC2',
    filter: 'none'
  },
  dark: {
    background: '#030303',
    filter: 'none'
  },
  balance: {
    background: '#615637',
    filter: 'none'
  }
};

export const POSITION_CONFIG = {
  menuButton: { top: '64px', right: '64px' },
  backButton: { top: '64px', left: '64px' },
  modeButton: { bottom: '64px', right: '64px' }
}; 