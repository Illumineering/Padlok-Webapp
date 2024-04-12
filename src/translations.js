export const detectLanguage = function () {
  const language = (navigator.language || navigator.userLanguage).split('-')[0]
  const available = ['en', 'fr'] // When adding value here, add the correct import in Address.vue
  return available.includes(language) ? language : 'en'
}

export const translations = {
  en: {
    address: {
      building: 'Building',
      flat: 'Flat',
      floor: 'Floor',
      intercom: 'Intercom',
      label: {
        door: 'Door',
        gate: 'Gate',
        portal: 'Portal'
      },
      staircase: 'Staircase'
    },
    appstore: {
      alternative: 'Download on the App Store',
      darkImage: '/images/en/appstore-dark.svg',
      lightImage: '/images/en/appstore-light.svg',
      url: 'https://apps.apple.com/us/app/padlok/id1546719801'
    },
    footer: {
      copyright: {
        by: 'by {trademark}',
        reserved: 'All Right Reserved'
      },
      privacy: 'Privacy policy',
      support: 'Support',
      terms: 'Terms of service'
    },
    head: {
      title: 'Some codes have been shared with you!',
      description: 'Padlok, door code manager'
    },
    loading: 'Loading…',
    not_found: {
      title: 'Not found!',
      explain: 'The information could not be found.',
      details: 'The link is either incorrect, or have been deleted by the sender.',
      tip: 'You may request your sender for a new valid link.'
    },
    playstore: {
      alternative: 'Get it on Google Play',
      darkImage: '/images/en/playstore-dark.svg',
      lightImage: '/images/en/playstore-light.svg',
      darkSoonImage: '/images/en/playstore-soon-dark.svg',
      lightSoonImage: '/images/en/playstore-soon-light.svg',
      soon: 'Soon on Google Play'
    },
    url: {
      marketing: 'https://padlok.app',
      privacy: 'https://padlok.app/privacy/',
      support: 'https://padlok.app/support/',
      terms: 'https://padlok.app/terms/'
    }
  },
  fr: {
    address: {
      building: 'Bâtiment',
      flat: 'Appartement',
      floor: 'Étage',
      intercom: 'Interphone',
      label: {
        door: 'Porte',
        gate: 'Grille',
        portal: 'Portail'
      },
      staircase: 'Escalier'
    },
    appstore: {
      alternative: 'Télécharger dans l’App Store',
      darkImage: '/images/fr/appstore-dark.svg',
      lightImage: '/images/fr/appstore-light.svg',
      url: 'https://apps.apple.com/fr/app/padlok/id1546719801'
    },
    footer: {
      copyright: {
        by: 'par {trademark}',
        reserved: 'Tous droits réservés'
      },
      privacy: 'Politique de confidentialité',
      support: 'Assistance',
      terms: 'Conditions d’utilisation'
    },
    head: {
      title: 'Des digicodes ont été partagés avec vous !',
      description: 'Padlok, le gestionnaire de digicodes'
    },
    loading: 'Chargement…',
    not_found: {
      title: 'Introuvable !',
      explain: 'Les informations n’ont pas été trouvées.',
      details: 'Le lien est peut-être incorrect, ou a été supprimé par l’expéditeur.',
      tip: 'Vous pouvez demander à l’expéditeur un nouveau lien valide.'
    },
    playstore: {
      alternative: 'Disponible sur Google Play',
      darkImage: '/images/fr/playstore-dark.svg',
      lightImage: '/images/fr/playstore-light.svg',
      darkSoonImage: '/images/fr/playstore-soon-dark.svg',
      lightSoonImage: '/images/fr/playstore-soon-light.svg',
      soon: 'Bientôt sur Google Play'
    },
    url: {
      marketing: 'https://padlok.app/fr',
      privacy: 'https://padlok.app/fr/confidentialite/',
      support: 'https://padlok.app/fr/assistance/',
      terms: 'https://padlok.app/fr/conditions/'
    }
  }
}
