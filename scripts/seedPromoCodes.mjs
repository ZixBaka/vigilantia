import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBPOocTYKeISeRC-EKz68HR3qOUpy2xsG8',
  authDomain: 'vigilantia-demo.firebaseapp.com',
  projectId: 'vigilantia-demo',
  storageBucket: 'vigilantia-demo.firebasestorage.app',
  messagingSenderId: '310680380405',
  appId: '1:310680380405:ios:95fe1aa3f829743538b6bc',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Partner reward offers — users SPEND karma to unlock a promo code
// karmaCost: how many karma points to spend
// codeValue: the actual discount code revealed to the user after spending
const PROMO_OFFERS = [
  {
    sponsorName: 'UzCard',
    sponsorIcon: '💳',
    description: 'Скидка 10% на комиссию за переводы через UzCard Pay в течение 30 дней.',
    category: 'utilities',
    karmaCost: 25,
    codeValue: 'UZCARD-CIVIC10',
    redeemedBy: [],
    active: true,
  },
  {
    sponsorName: 'EcoGreen UZ',
    sponsorIcon: '🌿',
    description: 'Бесплатный вывоз мусора на 1 месяц для жителей Ташкента.',
    category: 'ecology',
    karmaCost: 50,
    codeValue: 'ECOGREEN-FREE1M',
    redeemedBy: [],
    active: true,
  },
  {
    sponsorName: 'MedExpress Clinic',
    sponsorIcon: '🏥',
    description: 'Скидка 20% на первичный приём врача в любой клинике сети MedExpress.',
    category: 'healthcare',
    karmaCost: 30,
    codeValue: 'MED-CIVIC20',
    redeemedBy: [],
    active: true,
  },
  {
    sponsorName: 'Yandex Go UZ',
    sponsorIcon: '🚕',
    description: 'Промокод на 3 бесплатные поездки (до 15 000 сум каждая) в Yandex Go.',
    category: 'transport',
    karmaCost: 40,
    codeValue: 'YAGO-VIGILANT3',
    redeemedBy: [],
    active: true,
  },
  {
    sponsorName: 'Uzbekenergo',
    sponsorIcon: '⚡',
    description: 'Скидка 5% на оплату счёта за электроэнергию в следующем месяце.',
    category: 'energy',
    karmaCost: 20,
    codeValue: 'UZENERGY-5OFF',
    redeemedBy: [],
    active: true,
  },
  {
    sponsorName: 'SafeCity Tech',
    sponsorIcon: '🛡️',
    description: 'Бесплатная установка датчика дыма для жителей, сообщающих о проблемах безопасности.',
    category: 'safety',
    karmaCost: 35,
    codeValue: 'SAFE-SENSOR-FREE',
    redeemedBy: [],
    active: true,
  },
  {
    sponsorName: 'AquaUz',
    sponsorIcon: '💧',
    description: 'Бесплатная проверка качества воды на дому плюс фильтр-кувшин в подарок.',
    category: 'water',
    karmaCost: 45,
    codeValue: 'AQUA-HOMECHECK',
    redeemedBy: [],
    active: true,
  },
  {
    sponsorName: 'EduFund Uzbekistan',
    sponsorIcon: '📚',
    description: 'Годовая подписка на образовательную платформу Edu.uz для школьника.',
    category: 'education',
    karmaCost: 60,
    codeValue: 'EDUFUND-1YEAR',
    redeemedBy: [],
    active: true,
  },
  {
    sponsorName: 'UrbanDev Group',
    sponsorIcon: '🏗️',
    description: 'Скидка 15% на озеленение балкона или двора от команды UrbanDev.',
    category: 'urban',
    karmaCost: 55,
    codeValue: 'URBAN-GREEN15',
    redeemedBy: [],
    active: true,
  },
];

async function seed() {
  const force = process.argv.includes('--force');

  // Delete existing docs if --force
  if (force) {
    const existing = await getDocs(collection(db, 'promoCodes'));
    if (!existing.empty) {
      const batch = writeBatch(db);
      existing.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      console.log(`[seed] Deleted ${existing.size} existing promo offers.`);
    }
  }

  const batch = writeBatch(db);
  PROMO_OFFERS.forEach((offer) => {
    const ref = doc(collection(db, 'promoCodes'));
    batch.set(ref, offer);
  });
  await batch.commit();

  console.log(`\n[done] Seeded ${PROMO_OFFERS.length} partner reward offers:`);
  PROMO_OFFERS.forEach((o) =>
    console.log(`  ${o.sponsorIcon} ${o.sponsorName.padEnd(22)} ${o.karmaCost} karma → ${o.codeValue}`),
  );
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
