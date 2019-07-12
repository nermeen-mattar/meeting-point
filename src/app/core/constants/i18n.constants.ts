import { AvailableLanguageInfo } from './../models/available-language-info.model';

export const availableLanguages: AvailableLanguageInfo[] = [
  {
    code: 'en',
    name: 'English'
  },
  {
    code: 'de',
    name: 'Deutsch'
  },
  {
    code: 'fr',
    name: 'French'
  },
  {
    code: 'it',
    name: 'Italian'
  }
];

export const defaultLanguage = 'de';

export const sysOptions = {
  systemLanguage: defaultLanguage
};

export const languageToDaysNames = {
  de: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  it: ['Do', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
};

export const languageToMonthsNames = {
  de: [
    'JAN',
    'FEB',
    'MÄR',
    'APR',
    'MAI',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OKT',
    'NOV',
    'DEZ'
  ],
  en: [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ],
  fr: [
    'Janv',
    'Févr',
    'Mars',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Août',
    'Sept',
    'Oct',
    'Nov',
    'Déc'
  ],
  it: [
    'genn',
    'febbr',
    'mar',
    'apr',
    'magg',
    'giugno',
    'luglio',
    'ag',
    'sett',
    'ott',
    'nov',
    'dic'
  ]
};
