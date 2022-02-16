export const detectLanguage = function () {
    let language = (navigator.language || navigator.userLanguage).split('-')[0]
    let available = ['en', 'fr']
    return available.includes(language) ? language : 'en'
}

export const translations = {
    en: {
        alternative: {
            appstore: 'Download on the App Store'
        },
        footer: {
            copyright: 'Padlok© by Thomas Durand {year} - All Right Reserved',
            privacy: 'Privacy policy',
            support: 'Support',
            terms: 'Terms of service'
        },
        message: {
            loading: 'Loading…',
            not_found: 'Not found!',
        },
        url: {
            marketing: 'https://padlok.app',
            privacy: 'https://padlok.app/privacy/',
            support: 'https://padlok.app/support/',
            terms: 'https://padlok.app/terms/'
        }
    },
    fr: {
        alternative: {
            appstore: 'Télécharger dans l’App Store'
        },
        footer: {
            copyright: 'Padlok© par Thomas Durand {year} - Tous droits réservés',
            privacy: 'Politique de confidentialité',
            support: 'Assistance',
            terms: 'Conditions d’utilisation'
        },
        message: {
            loading: 'Chargement…',
            not_found: 'Introuvable !',
        },
        url: {
            marketing: 'https://padlok.app/fr',
            privacy: 'https://padlok.app/fr/confidentialite/',
            support: 'https://padlok.app/fr/assistance/',
            terms: 'https://padlok.app/fr/conditions/'
        }
    }
}
