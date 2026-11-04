import { matchLocale } from './locale'

// Apple sends a link without a storefront to the visitor's own, which is the right one for
// languages spoken in many countries. English and French keep the ones they always had.
const APP_STORE = 'https://apps.apple.com/app/padlok/id1546719801'

// Anything a language leaves out falls back to English, like the links
// to padlok.app, which only exists in English and French.
export const detectLanguage = function () {
  return matchLocale(navigator.languages ?? [navigator.language], Object.keys(translations))
}

export const translations = {
  en: {
    address: {
      building: 'Building',
      flat: 'Apartment',
      floor: 'Floor',
      groundFloor: 'Ground floor',
      intercom: 'Intercom',
      label: {
        door: 'Door',
        gate: 'Gate',
        portal: 'Portal',
        padlock: 'Padlock'
      },
      phoneNumber: 'Phone number',
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
      title: 'Some door codes have been shared with you!'
    },
    loading: 'Loading…',
    not_found: {
      title: 'Not found!',
      explain: 'The information could not be found.',
      details: 'The link is either incorrect or has been revoked by the sender.',
      tip: 'You can ask the sender for a new link.'
    },
    playstore: {
      alternative: 'Get it on Google Play',
      darkImage: '/images/en/playstore-dark.svg',
      badge: '/images/en/playstore.svg',
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
  // Only what British English says differently; the rest comes from English.
  'en-GB': {
    address: {
      flat: 'Flat'
    }
  },
  fr: {
    address: {
      building: 'Bâtiment',
      flat: 'Appartement',
      floor: 'Étage',
      groundFloor: 'Rez-de-chaussée',
      intercom: 'Interphone',
      label: {
        door: 'Porte',
        gate: 'Grille',
        portal: 'Portail',
        padlock: 'Cadenas'
      },
      phoneNumber: 'Téléphone',
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
      title: 'Des digicodes ont été partagés avec vous !'
    },
    loading: 'Chargement…',
    not_found: {
      title: 'Introuvable !',
      explain: 'Les informations n’ont pas été trouvées.',
      details: 'Le lien est soit erroné, soit il a été révoqué par l’expéditeur.',
      tip: 'Vous pouvez demander à l’expéditeur un nouveau lien valide.'
    },
    playstore: {
      alternative: 'Disponible sur Google Play',
      darkImage: '/images/fr/playstore-dark.svg',
      badge: '/images/fr/playstore.svg',
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
  },
  cs: {
    address: {
      building: 'Budova',
      flat: 'Byt',
      floor: 'Patro',
      groundFloor: 'Přízemí',
      intercom: 'Domovní telefon',
      label: {
        door: 'Dveře',
        gate: 'Brána',
        portal: 'Vrata',
        padlock: 'Visací zámek'
      },
      phoneNumber: 'Telefon',
      staircase: 'Vchod'
    },
    appstore: {
      alternative: 'Stáhnout v App Store',
      lightImage: '/images/cs/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'od {trademark}',
        reserved: 'Všechna práva vyhrazena'
      },
      privacy: 'Zásady ochrany osobních údajů',
      support: 'Podpora',
      terms: 'Podmínky služby'
    },
    head: {
      title: 'Někdo s vámi sdílel kódy od vchodu!'
    },
    loading: 'Načítání…',
    not_found: {
      title: 'Nenalezeno!',
      explain: 'Informace se nepodařilo najít.',
      details: 'Odkaz je buď nesprávný, nebo ho odesílatel zrušil.',
      tip: 'Můžete požádat odesílatele o nový platný odkaz.'
    },
    playstore: {
      alternative: 'Nyní na Google Play',
      badge: '/images/cs/playstore.svg'
    }
  },
  da: {
    address: {
      building: 'Bygning',
      flat: 'Lejlighed',
      floor: 'Etage',
      groundFloor: 'Stueetage',
      intercom: 'Dørtelefon',
      label: {
        door: 'Dør',
        gate: 'Låge',
        portal: 'Port',
        padlock: 'Hængelås'
      },
      phoneNumber: 'Telefon',
      staircase: 'Opgang'
    },
    appstore: {
      alternative: 'Hent i App Store',
      lightImage: '/images/da/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'af {trademark}',
        reserved: 'Alle rettigheder forbeholdes'
      },
      privacy: 'Privatlivspolitik',
      support: 'Support',
      terms: 'Vilkår og betingelser for brug'
    },
    head: {
      title: 'Der er blevet delt dørkoder med dig!'
    },
    loading: 'Indlæser…',
    not_found: {
      title: 'Ikke fundet!',
      explain: 'Oplysningerne blev ikke fundet.',
      details: 'Linket er enten forkert eller er blevet tilbagekaldt af afsenderen.',
      tip: 'Du kan bede afsenderen om et nyt, gyldigt link.'
    },
    playstore: {
      alternative: 'Nu på Google Play',
      badge: '/images/da/playstore.svg'
    }
  },
  de: {
    address: {
      building: 'Gebäude',
      flat: 'Wohnung',
      floor: 'Stockwerk',
      groundFloor: 'Erdgeschoss',
      intercom: 'Gegensprechanlage',
      label: {
        door: 'Tür',
        gate: 'Tor',
        portal: 'Portal',
        padlock: 'Vorhängeschloss'
      },
      phoneNumber: 'Telefon',
      staircase: 'Treppenhaus'
    },
    appstore: {
      alternative: 'Laden im App Store',
      lightImage: '/images/de/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'von {trademark}',
        reserved: 'Alle Rechte vorbehalten'
      },
      privacy: 'Datenschutzrichtlinie',
      support: 'Support',
      terms: 'Nutzungsbedingungen'
    },
    head: {
      title: 'Türcodes wurden mit Ihnen geteilt!'
    },
    loading: 'Laden…',
    not_found: {
      title: 'Nicht gefunden!',
      explain: 'Die Informationen wurden nicht gefunden.',
      details: 'Der Link ist entweder falsch oder wurde vom Absender widerrufen.',
      tip: 'Sie können den Absender um einen neuen gültigen Link bitten.'
    },
    playstore: {
      alternative: 'Jetzt bei Google Play',
      badge: '/images/de/playstore.svg'
    }
  },
  el: {
    address: {
      building: 'Κτίριο',
      flat: 'Διαμέρισμα',
      floor: 'Όροφος',
      groundFloor: 'Ισόγειο',
      intercom: 'Θυροτηλέφωνο',
      label: {
        door: 'Πόρτα',
        gate: 'Καγκελόπορτα',
        portal: 'Αυλόπορτα',
        padlock: 'Λουκέτο'
      },
      phoneNumber: 'Τηλέφωνο',
      staircase: 'Κλιμακοστάσιο'
    },
    appstore: {
      alternative: 'Λήψη από το App Store',
      lightImage: '/images/el/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'από την {trademark}',
        reserved: 'Με την επιφύλαξη παντός δικαιώματος'
      },
      privacy: 'Πολιτική απορρήτου',
      support: 'Υποστήριξη',
      terms: 'Όροι χρήσης'
    },
    head: {
      title: 'Σας κοινοποιήθηκαν κωδικοί εισόδου!'
    },
    loading: 'Φόρτωση…',
    not_found: {
      title: 'Δεν βρέθηκε!',
      explain: 'Δεν ήταν δυνατή η εύρεση των πληροφοριών.',
      details: 'Ο σύνδεσμος είτε είναι εσφαλμένος είτε έχει ανακληθεί από τον αποστολέα.',
      tip: 'Μπορείτε να ζητήσετε από τον αποστολέα έναν νέο έγκυρο σύνδεσμο.'
    },
    playstore: {
      alternative: 'Διαθέσιμο στο Google Play',
      badge: '/images/el/playstore.svg'
    }
  },
  es: {
    address: {
      building: 'Edificio',
      flat: 'Piso',
      floor: 'Planta',
      groundFloor: 'Planta baja',
      intercom: 'Interfono',
      label: {
        door: 'Puerta',
        gate: 'Verja',
        portal: 'Portal',
        padlock: 'Candado'
      },
      phoneNumber: 'Teléfono',
      staircase: 'Escalera'
    },
    appstore: {
      alternative: 'Descargar en el App Store',
      lightImage: '/images/es/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'por {trademark}',
        reserved: 'Todos los derechos reservados'
      },
      privacy: 'Política de privacidad',
      support: 'Soporte',
      terms: 'Términos de uso'
    },
    head: {
      title: '¡Han compartido códigos de acceso contigo!'
    },
    loading: 'Cargando…',
    not_found: {
      title: '¡No encontrado!',
      explain: 'No se ha encontrado la información.',
      details: 'Puede que el enlace sea incorrecto o que el remitente lo haya revocado.',
      tip: 'Puedes pedir al remitente un nuevo enlace válido.'
    },
    playstore: {
      alternative: 'Disponible en Google Play',
      badge: '/images/es/playstore.svg'
    }
  },
  fi: {
    address: {
      building: 'Rakennus',
      flat: 'Asunto',
      floor: 'Kerros',
      groundFloor: 'Pohjakerros',
      intercom: 'Ovipuhelin',
      label: {
        door: 'Ovi',
        gate: 'Portti',
        portal: 'Ajoportti',
        padlock: 'Riippulukko'
      },
      phoneNumber: 'Puhelin',
      staircase: 'Rappu'
    },
    appstore: {
      alternative: 'Lataa App Storesta',
      lightImage: '/images/fi/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'tekijä: {trademark}',
        reserved: 'Kaikki oikeudet pidätetään'
      },
      privacy: 'Tietosuojakäytäntö',
      support: 'Tuki',
      terms: 'Käyttöehdot'
    },
    head: {
      title: 'Sinulle on jaettu ovikoodeja!'
    },
    loading: 'Ladataan…',
    not_found: {
      title: 'Ei löytynyt!',
      explain: 'Tietoja ei löytynyt.',
      details: 'Linkki on virheellinen tai lähettäjä on perunut sen.',
      tip: 'Voit pyytää lähettäjältä uuden toimivan linkin.'
    },
    playstore: {
      alternative: 'Saatavana Google Playssa',
      badge: '/images/fi/playstore.svg'
    }
  },
  hu: {
    address: {
      building: 'Épület',
      flat: 'Lakás',
      floor: 'Emelet',
      groundFloor: 'Földszint',
      intercom: 'Kaputelefon',
      label: {
        door: 'Ajtó',
        gate: 'Kapu',
        portal: 'Nagykapu',
        padlock: 'Lakat'
      },
      phoneNumber: 'Telefonszám',
      staircase: 'Lépcsőház'
    },
    appstore: {
      alternative: 'Letöltés az App Store-ból',
      lightImage: '/images/hu/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'készítette: {trademark}',
        reserved: 'Minden jog fenntartva'
      },
      privacy: 'Adatvédelmi irányelvek',
      support: 'Támogatás',
      terms: 'Felhasználási feltételek'
    },
    head: {
      title: 'Kapukódokat osztottak meg Önnel!'
    },
    loading: 'Betöltés…',
    not_found: {
      title: 'Nem található!',
      explain: 'Az adatok nem találhatók.',
      details: 'A link vagy hibás, vagy a küldője visszavonta.',
      tip: 'Kérhet a feladótól egy új, érvényes linket.'
    },
    playstore: {
      alternative: 'Szerezd meg a Google Playen',
      badge: '/images/hu/playstore.svg'
    }
  },
  id: {
    address: {
      building: 'Gedung',
      flat: 'Unit',
      floor: 'Lantai',
      groundFloor: 'Lantai dasar',
      intercom: 'Interkom',
      label: {
        door: 'Pintu',
        gate: 'Gerbang',
        portal: 'Portal',
        padlock: 'Gembok'
      },
      phoneNumber: 'Nomor telepon',
      staircase: 'Tangga'
    },
    appstore: {
      alternative: 'Download di App Store',
      lightImage: '/images/id/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'oleh {trademark}',
        reserved: 'Hak cipta dilindungi undang-undang'
      },
      privacy: 'Kebijakan privasi',
      support: 'Dukungan',
      terms: 'Ketentuan layanan'
    },
    head: {
      title: 'Kode pintu telah dibagikan kepada Anda!'
    },
    loading: 'Memuat…',
    not_found: {
      title: 'Tidak ditemukan!',
      explain: 'Informasi tidak dapat ditemukan.',
      details: 'Tautan mungkin salah atau telah dicabut oleh pengirim.',
      tip: 'Anda dapat meminta tautan baru yang valid kepada pengirim.'
    },
    playstore: {
      alternative: 'Temukan di Google Play',
      badge: '/images/id/playstore.svg'
    }
  },
  it: {
    address: {
      building: 'Edificio',
      flat: 'Appartamento',
      floor: 'Piano',
      groundFloor: 'Piano terra',
      intercom: 'Citofono',
      label: {
        door: 'Porta',
        gate: 'Cancello',
        portal: 'Portone',
        padlock: 'Lucchetto'
      },
      phoneNumber: 'Telefono',
      staircase: 'Scala'
    },
    appstore: {
      alternative: 'Scarica su App Store',
      lightImage: '/images/it/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'di {trademark}',
        reserved: 'Tutti i diritti riservati'
      },
      privacy: 'Informativa sulla privacy',
      support: 'Assistenza',
      terms: 'Condizioni d\'uso'
    },
    head: {
      title: 'Alcuni codici d’accesso sono stati condivisi con te!'
    },
    loading: 'Caricamento…',
    not_found: {
      title: 'Non trovato!',
      explain: 'Le informazioni non sono state trovate.',
      details: 'Il link potrebbe essere errato o essere stato revocato dal mittente.',
      tip: 'Puoi chiedere al mittente un nuovo link valido.'
    },
    playstore: {
      alternative: 'Disponibile su Google Play',
      badge: '/images/it/playstore.svg'
    }
  },
  ja: {
    address: {
      building: '建物',
      flat: '部屋',
      floor: '階',
      groundFloor: '1階',
      intercom: 'インターホン',
      label: {
        door: 'ドア',
        gate: '門',
        portal: '門扉',
        padlock: '南京錠'
      },
      phoneNumber: '電話番号',
      staircase: '階段'
    },
    appstore: {
      alternative: 'App Storeからダウンロード',
      lightImage: '/images/ja/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: '{trademark}',
        reserved: 'All Rights Reserved'
      },
      privacy: 'プライバシーポリシー',
      support: 'サポート',
      terms: '利用規約'
    },
    head: {
      title: '解錠コードが共有されました！'
    },
    loading: '読み込み中…',
    not_found: {
      title: '見つかりません！',
      explain: '情報が見つかりませんでした。',
      details: 'リンクが間違っているか、送信者によって無効にされた可能性があります。',
      tip: '送信者に新しい有効なリンクを依頼してください。'
    },
    playstore: {
      alternative: 'Google Play で手に入れよう',
      badge: '/images/ja/playstore.svg'
    }
  },
  ko: {
    address: {
      building: '건물',
      flat: '호',
      floor: '층',
      groundFloor: '1층',
      intercom: '인터폰',
      label: {
        door: '출입문',
        gate: '대문',
        portal: '정문',
        padlock: '자물쇠'
      },
      phoneNumber: '전화번호',
      staircase: '계단'
    },
    appstore: {
      alternative: 'App Store에서 다운로드하기',
      lightImage: '/images/ko/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: '{trademark}',
        reserved: '모든 권리 보유'
      },
      privacy: '개인정보 보호정책',
      support: '지원',
      terms: '이용 약관 및 조건'
    },
    head: {
      title: '출입문 비밀번호를 공유받았습니다!'
    },
    loading: '로드 중…',
    not_found: {
      title: '찾을 수 없음!',
      explain: '정보를 찾을 수 없습니다.',
      details: '링크가 잘못되었거나 보낸 사람이 무효화했을 수 있습니다.',
      tip: '보낸 사람에게 유효한 새 링크를 요청해 보십시오.'
    },
    playstore: {
      alternative: 'Google Play에서 다운로드',
      badge: '/images/ko/playstore.svg'
    }
  },
  nb: {
    address: {
      building: 'Bygning',
      flat: 'Leilighet',
      floor: 'Etasje',
      groundFloor: 'Bakkeplan',
      intercom: 'Porttelefon',
      label: {
        door: 'Dør',
        gate: 'Port',
        portal: 'Inngangsport',
        padlock: 'Hengelås'
      },
      phoneNumber: 'Telefonnummer',
      staircase: 'Oppgang'
    },
    appstore: {
      alternative: 'Last ned fra App Store',
      lightImage: '/images/nb/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'av {trademark}',
        reserved: 'Alle rettigheter forbeholdt'
      },
      privacy: 'Personvernerklæring',
      support: 'Kundestøtte',
      terms: 'Vilkår for bruk'
    },
    head: {
      title: 'Noen har delt portkoder med deg!'
    },
    loading: 'Laster inn…',
    not_found: {
      title: 'Ikke funnet!',
      explain: 'Fant ikke informasjonen.',
      details: 'Lenken er enten feil eller tilbakekalt av avsenderen.',
      tip: 'Du kan be avsenderen om en ny gyldig lenke.'
    },
    playstore: {
      alternative: 'Last ned på Google Play',
      badge: '/images/nb/playstore.svg'
    }
  },
  nl: {
    address: {
      building: 'Gebouw',
      flat: 'Appartement',
      floor: 'Verdieping',
      groundFloor: 'Begane grond',
      intercom: 'Intercom',
      label: {
        door: 'Deur',
        gate: 'Hek',
        portal: 'Poort',
        padlock: 'Hangslot'
      },
      phoneNumber: 'Telefoon',
      staircase: 'Trap'
    },
    appstore: {
      alternative: 'Download in de App Store',
      lightImage: '/images/nl/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'door {trademark}',
        reserved: 'Alle rechten voorbehouden'
      },
      privacy: 'Privacybeleid',
      support: 'Ondersteuning',
      terms: 'Gebruiksvoorwaarden'
    },
    head: {
      title: 'Er zijn deurcodes met je gedeeld!'
    },
    loading: 'Laden…',
    not_found: {
      title: 'Niet gevonden!',
      explain: 'De informatie is niet gevonden.',
      details: 'De link is onjuist of door de afzender ingetrokken.',
      tip: 'Je kunt de afzender om een nieuwe, geldige link vragen.'
    },
    playstore: {
      alternative: 'Ontdek het op Google Play',
      badge: '/images/nl/playstore.svg'
    }
  },
  pl: {
    address: {
      building: 'Budynek',
      flat: 'Mieszkanie',
      floor: 'Piętro',
      groundFloor: 'Parter',
      intercom: 'Domofon',
      label: {
        door: 'Drzwi',
        gate: 'Furtka',
        portal: 'Brama',
        padlock: 'Kłódka'
      },
      phoneNumber: 'Telefon',
      staircase: 'Klatka'
    },
    appstore: {
      alternative: 'Pobierz z App Store',
      lightImage: '/images/pl/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'od {trademark}',
        reserved: 'Wszelkie prawa zastrzeżone'
      },
      privacy: 'Polityka prywatności',
      support: 'Pomoc',
      terms: 'Warunki korzystania'
    },
    head: {
      title: 'Udostępniono Ci kody do domofonu!'
    },
    loading: 'Wczytywanie…',
    not_found: {
      title: 'Nie znaleziono!',
      explain: 'Nie znaleziono informacji.',
      details: 'Link jest nieprawidłowy albo został unieważniony przez nadawcę.',
      tip: 'Poproś nadawcę o nowy, prawidłowy link.'
    },
    playstore: {
      alternative: 'Pobierz z Google Play',
      badge: '/images/pl/playstore.svg'
    }
  },
  'pt-BR': {
    address: {
      building: 'Edifício',
      flat: 'Apartamento',
      floor: 'Andar',
      groundFloor: 'Térreo',
      intercom: 'Interfone',
      label: {
        door: 'Porta',
        gate: 'Portão',
        portal: 'Portal',
        padlock: 'Cadeado'
      },
      phoneNumber: 'Telefone',
      staircase: 'Escadas'
    },
    appstore: {
      alternative: 'Baixar na App Store',
      lightImage: '/images/pt-BR/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'por {trademark}',
        reserved: 'Todos os direitos reservados'
      },
      privacy: 'Política de privacidade',
      support: 'Suporte',
      terms: 'Termos e condições de uso'
    },
    head: {
      title: 'Códigos de acesso foram compartilhados com você!'
    },
    loading: 'Carregando…',
    not_found: {
      title: 'Não encontrado!',
      explain: 'As informações não foram encontradas.',
      details: 'O link pode estar incorreto ou ter sido revogado pelo remetente.',
      tip: 'Você pode solicitar ao remetente um novo link válido.'
    },
    playstore: {
      alternative: 'Disponível no Google Play',
      badge: '/images/pt-BR/playstore.svg'
    }
  },
  'pt-PT': {
    address: {
      building: 'Edifício',
      flat: 'Apartamento',
      floor: 'Piso',
      groundFloor: 'Rés-do-chão',
      intercom: 'Intercomunicador',
      label: {
        door: 'Porta',
        gate: 'Portão',
        portal: 'Portal',
        padlock: 'Cadeado'
      },
      phoneNumber: 'Telefone',
      staircase: 'Escadas'
    },
    appstore: {
      alternative: 'Descarregar na App Store',
      lightImage: '/images/pt-PT/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'por {trademark}',
        reserved: 'Todos os direitos reservados'
      },
      privacy: 'Política de privacidade',
      support: 'Suporte',
      terms: 'Termos e condições de utilização'
    },
    head: {
      title: 'Partilharam códigos de acesso consigo!'
    },
    loading: 'A carregar…',
    not_found: {
      title: 'Não encontrado!',
      explain: 'A informação não foi encontrada.',
      details: 'A ligação está incorreta ou foi revogada pelo remetente.',
      tip: 'Pode pedir ao remetente uma nova ligação válida.'
    },
    playstore: {
      alternative: 'Disponível no Google Play',
      badge: '/images/pt-PT/playstore.svg'
    }
  },
  ro: {
    address: {
      building: 'Bloc',
      flat: 'Apartament',
      floor: 'Etaj',
      groundFloor: 'Parter',
      intercom: 'Interfon',
      label: {
        door: 'Ușă',
        gate: 'Poartă',
        portal: 'Portal',
        padlock: 'Lacăt'
      },
      phoneNumber: 'Telefon',
      staircase: 'Scară'
    },
    appstore: {
      alternative: 'Descarcă din App Store',
      lightImage: '/images/ro/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'de {trademark}',
        reserved: 'Toate drepturile rezervate'
      },
      privacy: 'Politica de confidențialitate',
      support: 'Asistență',
      terms: 'Termeni și condiții'
    },
    head: {
      title: 'Vi s-au partajat coduri de acces!'
    },
    loading: 'Se încarcă…',
    not_found: {
      title: 'Nu a fost găsit!',
      explain: 'Informațiile nu au fost găsite.',
      details: 'Linkul este fie incorect, fie a fost revocat de expeditor.',
      tip: 'Puteți cere expeditorului un link nou valid.'
    },
    playstore: {
      alternative: 'Descarcă de pe Google Play',
      badge: '/images/ro/playstore.svg'
    }
  },
  ru: {
    address: {
      building: 'Здание',
      flat: 'Квартира',
      floor: 'Этаж',
      groundFloor: 'Первый этаж',
      intercom: 'Домофон',
      label: {
        door: 'Дверь',
        gate: 'Калитка',
        portal: 'Ворота',
        padlock: 'Навесной замок'
      },
      phoneNumber: 'Телефон',
      staircase: 'Подъезд'
    },
    appstore: {
      alternative: 'Загрузите в App Store',
      lightImage: '/images/ru/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'от {trademark}',
        reserved: 'Все права защищены'
      },
      privacy: 'Политика конфиденциальности',
      support: 'Поддержка',
      terms: 'Условия использования'
    },
    head: {
      title: 'С вами поделились кодами от двери!'
    },
    loading: 'Загрузка…',
    not_found: {
      title: 'Не найдено!',
      explain: 'Информация не найдена.',
      details: 'Ссылка неверна или была отозвана отправителем.',
      tip: 'Попросите отправителя прислать новую действующую ссылку.'
    },
    playstore: {
      alternative: 'Доступно в Google Play',
      badge: '/images/ru/playstore.svg'
    }
  },
  sv: {
    address: {
      building: 'Byggnad',
      flat: 'Lägenhet',
      floor: 'Våning',
      groundFloor: 'Bottenvåning',
      intercom: 'Porttelefon',
      label: {
        door: 'Dörr',
        gate: 'Grind',
        portal: 'Port',
        padlock: 'Hänglås'
      },
      phoneNumber: 'Telefonnummer',
      staircase: 'Uppgång'
    },
    appstore: {
      alternative: 'Hämta i App Store',
      lightImage: '/images/sv/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'av {trademark}',
        reserved: 'Alla rättigheter förbehållna'
      },
      privacy: 'Integritetspolicy',
      support: 'Support',
      terms: 'Användarvillkor'
    },
    head: {
      title: 'Någon har delat portkoder med dig!'
    },
    loading: 'Läser in…',
    not_found: {
      title: 'Hittades inte!',
      explain: 'Informationen kunde inte hittas.',
      details: 'Länken är antingen felaktig eller har återkallats av avsändaren.',
      tip: 'Du kan be avsändaren om en ny giltig länk.'
    },
    playstore: {
      alternative: 'Ladda ned på Google Play',
      badge: '/images/sv/playstore.svg'
    }
  },
  th: {
    address: {
      building: 'อาคาร',
      flat: 'ห้อง',
      floor: 'ชั้น',
      groundFloor: 'ชั้นล่าง',
      intercom: 'อินเตอร์คอม',
      label: {
        door: 'ประตู',
        gate: 'ประตูรั้ว',
        portal: 'ประตูทางเข้า',
        padlock: 'แม่กุญแจ'
      },
      phoneNumber: 'หมายเลขโทรศัพท์',
      staircase: 'ตึก'
    },
    appstore: {
      alternative: 'ดาวน์โหลดบน App Store',
      lightImage: '/images/th/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'โดย {trademark}',
        reserved: 'สงวนลิขสิทธิ์'
      },
      privacy: 'นโยบายความเป็นส่วนตัว',
      support: 'ฝ่ายสนับสนุน',
      terms: 'ข้อกำหนดในการให้บริการ'
    },
    head: {
      title: 'มีคนแชร์รหัสประตูให้คุณ!'
    },
    loading: 'กำลังโหลด…',
    not_found: {
      title: 'ไม่พบข้อมูล!',
      explain: 'ไม่พบข้อมูล',
      details: 'ลิงก์อาจไม่ถูกต้อง หรือถูกเพิกถอนไปแล้วโดยผู้ส่ง',
      tip: 'คุณสามารถขอลิงก์ใหม่ที่ใช้งานได้จากผู้ส่ง'
    },
    playstore: {
      alternative: 'ดาวน์โหลดจาก Google Play',
      badge: '/images/th/playstore.svg'
    }
  },
  tr: {
    address: {
      building: 'Bina',
      flat: 'Daire',
      floor: 'Kat',
      groundFloor: 'Zemin kat',
      intercom: 'İnterkom',
      label: {
        door: 'Kapı',
        gate: 'Dış kapı',
        portal: 'Bahçe kapısı',
        padlock: 'Asma kilit'
      },
      phoneNumber: 'Telefon',
      staircase: 'Merdiven'
    },
    appstore: {
      alternative: 'App Store\'dan indirin',
      lightImage: '/images/tr/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: '{trademark} tarafından',
        reserved: 'Tüm hakları saklıdır'
      },
      privacy: 'Gizlilik politikası',
      support: 'Destek',
      terms: 'Kullanım koşulları'
    },
    head: {
      title: 'Sizinle kapı şifreleri paylaşıldı!'
    },
    loading: 'Yükleniyor…',
    not_found: {
      title: 'Bulunamadı!',
      explain: 'Bilgiler bulunamadı.',
      details: 'Bağlantı ya hatalı ya da gönderen tarafından iptal edilmiş.',
      tip: 'Gönderenden yeni ve geçerli bir bağlantı isteyebilirsiniz.'
    },
    playstore: {
      alternative: 'Google Play\'den alın',
      badge: '/images/tr/playstore.svg'
    }
  },
  uk: {
    address: {
      building: 'Будинок',
      flat: 'Квартира',
      floor: 'Поверх',
      groundFloor: 'Перший поверх',
      intercom: 'Домофон',
      label: {
        door: 'Двері',
        gate: 'Хвіртка',
        portal: 'Ворота',
        padlock: 'Замок'
      },
      phoneNumber: 'Телефон',
      staircase: 'Під’їзд'
    },
    appstore: {
      alternative: 'Завантажте в App Store',
      lightImage: '/images/uk/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'від {trademark}',
        reserved: 'Усі права захищено'
      },
      privacy: 'Політика конфіденційності',
      support: 'Підтримка',
      terms: 'Умови використання'
    },
    head: {
      title: 'З вами поділилися кодами від дверей!'
    },
    loading: 'Завантаження…',
    not_found: {
      title: 'Не знайдено!',
      explain: 'Інформацію не знайдено.',
      details: 'Посилання неправильне або його відкликав відправник.',
      tip: 'Попросіть відправника надіслати нове чинне посилання.'
    },
    playstore: {
      alternative: 'Завантажте з Google Play',
      badge: '/images/uk/playstore.svg'
    }
  },
  vi: {
    address: {
      building: 'Tòa nhà',
      flat: 'Căn hộ',
      floor: 'Tầng',
      groundFloor: 'Tầng trệt',
      intercom: 'Chuông cửa',
      label: {
        door: 'Cửa',
        gate: 'Cổng',
        portal: 'Cổng chính',
        padlock: 'Ổ khóa'
      },
      phoneNumber: 'Số điện thoại',
      staircase: 'Lối vào'
    },
    appstore: {
      alternative: 'Tải về trên App Store',
      lightImage: '/images/vi/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: 'bởi {trademark}',
        reserved: 'Bảo lưu mọi quyền'
      },
      privacy: 'Chính sách quyền riêng tư',
      support: 'Hỗ trợ',
      terms: 'Điều khoản dịch vụ'
    },
    head: {
      title: 'Bạn vừa được chia sẻ một số mã cửa!'
    },
    loading: 'Đang tải…',
    not_found: {
      title: 'Không tìm thấy!',
      explain: 'Không tìm thấy thông tin.',
      details: 'Liên kết không đúng hoặc đã bị người gửi thu hồi.',
      tip: 'Bạn có thể yêu cầu người gửi cung cấp liên kết mới hợp lệ.'
    },
    playstore: {
      alternative: 'Tải nội dung trên Google Play',
      badge: '/images/vi/playstore.svg'
    }
  },
  'zh-Hans': {
    address: {
      building: '楼栋',
      flat: '房号',
      floor: '楼层',
      groundFloor: '一楼',
      intercom: '对讲机',
      label: {
        door: '门',
        gate: '闸门',
        portal: '大门',
        padlock: '挂锁'
      },
      phoneNumber: '电话号码',
      staircase: '楼梯'
    },
    appstore: {
      alternative: '在 App Store 下载',
      lightImage: '/images/zh-Hans/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: '{trademark}',
        reserved: '保留所有权利'
      },
      privacy: '隐私政策',
      support: '支持',
      terms: '使用条款'
    },
    head: {
      title: '有人与你共享了门禁密码！'
    },
    loading: '载入中…',
    not_found: {
      title: '未找到！',
      explain: '找不到相关信息。',
      details: '链接可能不正确，或已被发送者撤销。',
      tip: '你可以向发送者索取新的有效链接。'
    },
    playstore: {
      alternative: '下载应用，请到 Google Play',
      badge: '/images/zh-Hans/playstore.svg'
    }
  },
  'zh-Hant': {
    address: {
      building: '棟別',
      flat: '房號',
      floor: '樓層',
      groundFloor: '一樓',
      intercom: '對講機',
      label: {
        door: '門',
        gate: '閘門',
        portal: '大門',
        padlock: '掛鎖'
      },
      phoneNumber: '電話號碼',
      staircase: '樓梯'
    },
    appstore: {
      alternative: '在 App Store 下載',
      lightImage: '/images/zh-Hant/appstore-light.svg',
      url: APP_STORE
    },
    footer: {
      copyright: {
        by: '{trademark}',
        reserved: '保留所有權利'
      },
      privacy: '隱私權政策',
      support: '支援',
      terms: '服務條款'
    },
    head: {
      title: '有人跟你分享了門禁密碼！'
    },
    loading: '載入中…',
    not_found: {
      title: '找不到！',
      explain: '找不到相關資訊。',
      details: '連結可能不正確，或已被傳送者撤銷。',
      tip: '你可以向傳送者索取新的有效連結。'
    },
    playstore: {
      alternative: '立即前往 Google Play 下載',
      badge: '/images/zh-Hant/playstore.svg'
    }
  }
}
