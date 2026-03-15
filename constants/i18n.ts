import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      // Tabs
      'tab.schools': 'Школы',
      'tab.map': 'Карта',
      'tab.dashboard': 'Статистика',

      // School list
      'schools.title': 'Школы',
      'schools.search': 'Поиск школы...',
      'schools.empty': 'Школы не найдены',
      'schools.loading': 'Загрузка...',
      'schools.reports': 'отчётов',

      // School detail
      'school.promised': 'Что обещано',
      'school.verify': 'Проверить',
      'school.reports': 'Отчёты',
      'school.noReports': 'Нет отчётов',
      'school.lastReport': 'Последний отчёт',

      // Promises
      'promise.fixToilets': 'Ремонт туалетов',
      'promise.soapDispensers': 'Диспенсеры для мыла',
      'promise.newDesks': 'Новые парты',
      'promise.cleanWater': 'Чистая вода',
      'promise.computerLab': 'Компьютерный класс',
      'promise.fixWindows': 'Ремонт окон',
      'promise.libraryBooks': 'Книги в библиотеку',
      'promise.repairFence': 'Ремонт забора',
      'promise.whiteboards': 'Интерактивные доски',
      'promise.fireExtinguisher': 'Огнетушители',

      // Report screen
      'report.title': 'Проверка',
      'report.takePhoto': 'Сделать фото',
      'report.retakePhoto': 'Переснять',
      'report.commentPlaceholder': 'Комментарий (необязательно)...',
      'report.done': 'Готово ✓',
      'report.problem': 'Проблема ✗',
      'report.submit': 'Отправить',
      'report.submitting': 'Отправка...',
      'report.success': 'Записано!',
      'report.selectStatus': 'Выберите статус',
      'report.photoRequired': 'Фото обязательно',

      // Dashboard
      'dashboard.title': 'Дашборд',
      'dashboard.totalReports': 'Всего отчётов',
      'dashboard.satisfied': 'Довольных',
      'dashboard.verified': 'Проверено школ',
      'dashboard.problems': 'Проблем выявлено',
      'dashboard.bySchool': 'По школам',
      'dashboard.resetDemo': 'Сбросить демо-данные',
      'dashboard.seeding': 'Загрузка данных...',

      // Map
      'map.title': 'Карта',
      'map.tap': 'Нажмите на школу',

      // Status
      'status.done': 'Выполнено',
      'status.problem': 'Проблема',
      'status.noReports': 'Нет данных',

      // Category
      'category.sanitation': 'Санитария',
      'category.safety': 'Безопасность',
      'category.education': 'Образование',

      // Language
      'lang.ru': 'Русский',
      'lang.uz': "O'zbek",
      'lang.en': 'English',
      'lang.select': 'Язык',
    },
  },
  uz: {
    translation: {
      'tab.schools': 'Maktablar',
      'tab.map': 'Xarita',
      'tab.dashboard': 'Statistika',

      'schools.title': 'Maktablar',
      'schools.search': 'Maktab qidirish...',
      'schools.empty': 'Maktab topilmadi',
      'schools.loading': 'Yuklanmoqda...',
      'schools.reports': 'hisobot',

      'school.promised': 'Nima va\'da qilindi',
      'school.verify': 'Tekshirish',
      'school.reports': 'Hisobotlar',
      'school.noReports': 'Hisobot yo\'q',
      'school.lastReport': 'Oxirgi hisobot',

      'promise.fixToilets': 'Hojatxonani ta\'mirlash',
      'promise.soapDispensers': 'Sovun dispenserlari',
      'promise.newDesks': 'Yangi partalar',
      'promise.cleanWater': 'Toza suv',
      'promise.computerLab': 'Kompyuter sinfi',
      'promise.fixWindows': 'Derazalarni ta\'mirlash',
      'promise.libraryBooks': 'Kutubxona kitoblari',
      'promise.repairFence': 'To\'siqni ta\'mirlash',
      'promise.whiteboards': 'Interaktiv doskalar',
      'promise.fireExtinguisher': 'O\'t o\'chiruvchilar',

      'report.title': 'Tekshiruv',
      'report.takePhoto': 'Rasm olish',
      'report.retakePhoto': 'Qayta olish',
      'report.commentPlaceholder': 'Izoh (ixtiyoriy)...',
      'report.done': 'Bajarildi ✓',
      'report.problem': 'Muammo ✗',
      'report.submit': 'Yuborish',
      'report.submitting': 'Yuborilmoqda...',
      'report.success': 'Qabul qilindi!',
      'report.selectStatus': 'Holat tanlang',
      'report.photoRequired': 'Rasm majburiy',

      'dashboard.title': 'Dashboard',
      'dashboard.totalReports': 'Jami hisobotlar',
      'dashboard.satisfied': 'Mamnun',
      'dashboard.verified': 'Tekshirilgan maktablar',
      'dashboard.problems': 'Muammolar',
      'dashboard.bySchool': 'Maktablar bo\'yicha',
      'dashboard.resetDemo': 'Demo ma\'lumotlarni tiklash',
      'dashboard.seeding': 'Ma\'lumot yuklanmoqda...',

      'map.title': 'Xarita',
      'map.tap': 'Maktabga bosing',

      'status.done': 'Bajarildi',
      'status.problem': 'Muammo',
      'status.noReports': 'Ma\'lumot yo\'q',

      'category.sanitation': 'Sanitariya',
      'category.safety': 'Xavfsizlik',
      'category.education': 'Ta\'lim',

      'lang.ru': 'Русский',
      'lang.uz': "O'zbek",
      'lang.en': 'English',
      'lang.select': 'Til',
    },
  },
  en: {
    translation: {
      'tab.schools': 'Schools',
      'tab.map': 'Map',
      'tab.dashboard': 'Dashboard',

      'schools.title': 'Schools',
      'schools.search': 'Search schools...',
      'schools.empty': 'No schools found',
      'schools.loading': 'Loading...',
      'schools.reports': 'reports',

      'school.promised': 'What was promised',
      'school.verify': 'Verify',
      'school.reports': 'Reports',
      'school.noReports': 'No reports yet',
      'school.lastReport': 'Last report',

      'promise.fixToilets': 'Fix toilets',
      'promise.soapDispensers': 'Soap dispensers',
      'promise.newDesks': 'New desks',
      'promise.cleanWater': 'Clean water access',
      'promise.computerLab': 'Computer lab',
      'promise.fixWindows': 'Fix windows',
      'promise.libraryBooks': 'Library books',
      'promise.repairFence': 'Repair fence',
      'promise.whiteboards': 'Whiteboards',
      'promise.fireExtinguisher': 'Fire extinguishers',

      'report.title': 'Verify',
      'report.takePhoto': 'Take Photo',
      'report.retakePhoto': 'Retake',
      'report.commentPlaceholder': 'Comment (optional)...',
      'report.done': 'Done ✓',
      'report.problem': 'Problem ✗',
      'report.submit': 'Submit',
      'report.submitting': 'Submitting...',
      'report.success': 'Recorded!',
      'report.selectStatus': 'Select status',
      'report.photoRequired': 'Photo required',

      'dashboard.title': 'Dashboard',
      'dashboard.totalReports': 'Total Reports',
      'dashboard.satisfied': 'Satisfied',
      'dashboard.verified': 'Schools Verified',
      'dashboard.problems': 'Problems Found',
      'dashboard.bySchool': 'By School',
      'dashboard.resetDemo': 'Reset Demo Data',
      'dashboard.seeding': 'Loading data...',

      'map.title': 'Map',
      'map.tap': 'Tap a school to see details',

      'status.done': 'Done',
      'status.problem': 'Problem',
      'status.noReports': 'No data',

      'category.sanitation': 'Sanitation',
      'category.safety': 'Safety',
      'category.education': 'Education',

      'lang.ru': 'Русский',
      'lang.uz': "O'zbek",
      'lang.en': 'English',
      'lang.select': 'Language',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
