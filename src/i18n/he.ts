export const he = {
  title: 'NO-HAZIYA',
  subtitle: 'אפשר לישון הלילה בלי חזייה?',
  disclaimer:
    'האתר נועד לכיף ואין להתייחס להערכתו כהנחיית בטיחות. יש להישמע להנחיות פיקוד העורף.',

  // Language toggle — shown when switching *to* this language
  langShort: 'עב',
  themeToDark: 'מעבר למצב כהה',
  themeToLight: 'מעבר למצב בהיר',
  switchToThis: 'החלפה לעברית',

  // Location search
  searchLabel: 'חיפוש מיקום',
  searchPlaceholder: 'איפה ישנים הלילה?',
  suggestionsLabel: 'הצעות מיקום',
  bestMatch: 'הכי מתאים',
  useMyLocation: 'שימוש במיקום הנוכחי שלי',
  locating: 'מאתרים את המיקום…',
  locateFailed: 'לא הצלחנו לאתר את המיקום. אפשר לחפש לפי שם.',
  noneNearby: 'לא מצאנו יישוב קרוב למיקום שלך.',
  noResults: 'לא מצאנו יישוב בשם הזה',
  loadingPlaces: 'טוענים יישובים…',
  loadFailed: 'לא הצלחנו לטעון את רשימת היישובים. נסו שוב.',
  resultsOne: 'הצעה אחת',
  resultsMany: '{n} הצעות',
  chosen: 'נבחר: {name}',
  changeLocation: 'שינוי מיקום',
  chooseLocation: 'נא לבחור מיקום',

  // Scene (aria-label of the illustration) + news bubble
  sceneIdle: 'בחורה בפיג׳מה חושבת על המיטה',
  sceneChecking: 'בחורה בפיג׳מה חושבת, הבדיקה רצה',
  sceneHigh: 'הבחורה שוכבת במיטה ובוכה, עם חזייה מתחת לפיג׳מה',
  sceneMedium: 'הבחורה שוכבת במיטה ונושמת לרווחה, החזייה על הרצפה',
  sceneLow: 'הבחורה ישנה מחויכת, החזייה עפה באוויר',
  newsBlah: 'בלה בלה…',

  // Main button + news switch
  checkButton: 'אפשר לשחרר הלילה?',
  checking: 'בודקים את הלילה…',
  newsSwitch: 'להתחשב גם בחדשות',

  // Result card
  riskLevel: 'רמת סיכון · {band}',
  bandLow: 'נמוכה',
  bandMedium: 'בינונית',
  bandHigh: 'גבוהה',
  headlineLow: 'משחררים! לילה טוב',
  headlineMedium: 'אפשר להוריד, רק להשאיר קרוב',
  headlineHigh: 'הלילה נשארים עם חזייה',
  sirens24hOne: 'אזעקה אחת באזור שלך ב-24 השעות האחרונות',
  sirens24hMany: '{n} אזעקות באזור שלך ב-24 השעות האחרונות',
  sirensWeekOne: 'שקט ביממה האחרונה, אזעקה אחת השבוע',
  sirensWeekMany: 'שקט ביממה האחרונה, {n} אזעקות השבוע',
  quietDaysOne: 'אין אזעקות באזור שלך ביממה האחרונה',
  quietDaysTwo: 'אין אזעקות באזור שלך כבר יומיים',
  quietDaysMany: 'אין אזעקות באזור שלך כבר {n} ימים',
  policy: 'יש הגבלות של פיקוד העורף באזור שלך',
  checkAgain: 'בדיקה חוזרת',
  sampleData: 'נתוני דוגמה',
  staleData: 'שימו לב: הנתונים עודכנו {ago}',
  noDataTitle: 'אין לנו נתונים לאזור הזה עדיין',
  noDataWhy: 'אפשר לנסות שוב מאוחר יותר',
  errorTitle: 'לא הצלחנו לבדוק כרגע',
  errorWhy: 'כדאי לבדוק את החיבור ולנסות שוב',
};

export type Strings = typeof he;
