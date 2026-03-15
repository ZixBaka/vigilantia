import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

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

const ISSUES_SEED = [
  // --- EDUCATION ---
  { title: 'Протекает крыша в школе №47', description: 'В нескольких классах третьего этажа протекает крыша после дождей. Потолок уже покрылся плесенью.', category: 'education', status: 'open', photoUrl: '', lat: 41.3123, lng: 69.2415, createdBy: 'seed_user_1', upvotes: 38, upvoters: [] },
  { title: 'Нет отопления в школе №12 (Чиланзар)', description: 'Батареи не работают с начала ноября. Дети сидят в куртках, температура около 10°C.', category: 'education', status: 'problem', photoUrl: '', lat: 41.2964, lng: 69.2071, createdBy: 'seed_user_2', upvotes: 54, upvoters: [] },
  { title: 'Туалеты в школе №88 требуют ремонта', description: 'Унитазы сломаны на 1 и 2 этажах. Дети вынуждены ходить домой.', category: 'education', status: 'open', photoUrl: '', lat: 41.3301, lng: 69.2630, createdBy: 'seed_user_3', upvotes: 21, upvoters: [] },

  // --- HEALTHCARE ---
  { title: 'Поликлиника №7: очереди по 4–5 часов', description: 'Электронная запись не работает 3 месяца. Люди занимают очередь с 5 утра.', category: 'healthcare', status: 'open', photoUrl: '', lat: 41.3058, lng: 69.2339, createdBy: 'seed_user_4', upvotes: 42, upvoters: [] },
  { title: 'Отсутствие скорой помощи в Юнусабадском районе', description: 'Скорая приезжает через 45–60 минут. Две машины сломаны.', category: 'healthcare', status: 'problem', photoUrl: '', lat: 41.3562, lng: 69.2891, createdBy: 'seed_user_5', upvotes: 67, upvoters: [] },
  { title: 'Нет педиатра в поликлинике №15 три месяца', description: 'Детский врач уволился в августе. Замену так и не нашли.', category: 'healthcare', status: 'open', photoUrl: '', lat: 41.2877, lng: 69.1934, createdBy: 'seed_user_6', upvotes: 29, upvoters: [] },

  // --- TRANSPORT ---
  { title: 'Яма на пересечении ул. Буюк Ипак Йули и Шахристан', description: 'Огромная яма диаметром 1.5м и глубиной 30см. Уже несколько аварий.', category: 'transport', status: 'open', photoUrl: '', lat: 41.3211, lng: 69.2518, createdBy: 'seed_user_7', upvotes: 89, upvoters: [] },
  { title: 'Автобус №67 ходит раз в час вместо 20 минут', description: 'После ремонта расписание изменили, но не обновили на остановках.', category: 'transport', status: 'done', photoUrl: '', lat: 41.3099, lng: 69.2203, createdBy: 'seed_user_8', upvotes: 33, upvoters: [] },
  { title: 'Отсутствие светофора на опасном перекрёстке Сергели', description: 'Перекрёсток у ТЦ «Мегапланет» без светофора. За месяц 3 ДТП.', category: 'transport', status: 'open', photoUrl: '', lat: 41.2701, lng: 69.2012, createdBy: 'seed_user_9', upvotes: 77, upvoters: [] },

  // --- ECOLOGY ---
  { title: 'Стихийная свалка в Мирзо-Улугбекском районе', description: 'На пустыре у канала выросла огромная свалка. Запах на несколько кварталов.', category: 'ecology', status: 'open', photoUrl: '', lat: 41.3401, lng: 69.3102, createdBy: 'seed_user_10', upvotes: 55, upvoters: [] },
  { title: 'Завод сбрасывает отходы в арык', description: 'По ночам из трубы завода в арык текут тёмные жидкости. Рыба погибла.', category: 'ecology', status: 'problem', photoUrl: '', lat: 41.2988, lng: 69.3344, createdBy: 'seed_user_11', upvotes: 103, upvoters: [] },
  { title: 'Вырубка деревьев во дворе на ул. Амир Темур', description: '14 взрослых тополей срублены без ведома жильцов. На их месте — парковка.', category: 'ecology', status: 'open', photoUrl: '', lat: 41.3155, lng: 69.2760, createdBy: 'seed_user_12', upvotes: 48, upvoters: [] },

  // --- SAFETY ---
  { title: 'Сломанное уличное освещение на ул. Навои (3 км)', description: 'Три километра улицы без освещения. Зафиксировано несколько случаев грабежей.', category: 'safety', status: 'open', photoUrl: '', lat: 41.3078, lng: 69.2581, createdBy: 'seed_user_13', upvotes: 61, upvoters: [] },
  { title: 'Открытый канализационный люк у рынка Чорсу', description: 'Крышка люка пропала неделю назад. Яма не огорождена.', category: 'safety', status: 'done', photoUrl: '', lat: 41.3262, lng: 69.2320, createdBy: 'seed_user_14', upvotes: 44, upvoters: [] },
  { title: 'Заброшенное здание используется для сходок', description: 'Старый завод в Яккасарайском районе: разбитые окна, открытые входы.', category: 'safety', status: 'open', photoUrl: '', lat: 41.2912, lng: 69.2677, createdBy: 'seed_user_15', upvotes: 19, upvoters: [] },

  // --- URBAN ---
  { title: 'Разбитая детская площадка в 5-м квартале Чиланзара', description: 'Горка сломана, качели без сидений. Заявка в хокимият — 4 месяца назад.', category: 'urban', status: 'open', photoUrl: '', lat: 41.2945, lng: 69.2133, createdBy: 'seed_user_16', upvotes: 36, upvoters: [] },
  { title: 'Тротуар вдоль ул. Беруни полностью разрушен', description: 'Плитка выбита, ямы, грязь. Пешеходы идут по проезжей части.', category: 'urban', status: 'open', photoUrl: '', lat: 41.3188, lng: 69.2445, createdBy: 'seed_user_17', upvotes: 52, upvoters: [] },
  { title: 'Стихийная торговля загораживает вход в метро', description: 'У станции «Буюк Ипак Йули» продавцы занимают весь тротуар.', category: 'urban', status: 'done', photoUrl: '', lat: 41.3090, lng: 69.2502, createdBy: 'seed_user_18', upvotes: 27, upvoters: [] },

  // --- UTILITIES ---
  { title: 'Газ отключён в 6 домах на ул. Катартол', description: 'Уже 10 дней без газа. Официального уведомления не было.', category: 'utilities', status: 'open', photoUrl: '', lat: 41.3350, lng: 69.2198, createdBy: 'seed_user_19', upvotes: 73, upvoters: [] },
  { title: 'Мусор не вывозят 2 недели в Юнусабаде', description: 'Контейнеры переполнены, мусор разлетается. Коммунальщики не отвечают.', category: 'utilities', status: 'problem', photoUrl: '', lat: 41.3511, lng: 69.2813, createdBy: 'seed_user_20', upvotes: 58, upvoters: [] },
  { title: 'Лифт не работает 3 месяца в 9-этажном доме', description: 'Пожилые жильцы не могут нормально выходить. УК игнорирует обращения.', category: 'utilities', status: 'open', photoUrl: '', lat: 41.3022, lng: 69.2660, createdBy: 'seed_user_21', upvotes: 41, upvoters: [] },

  // --- WATER ---
  { title: 'Холодная вода подаётся только по ночам (Алмазар)', description: 'С июня вода есть только с 23:00 до 6:00. Уже 3 месяца.', category: 'water', status: 'open', photoUrl: '', lat: 41.3440, lng: 69.2551, createdBy: 'seed_user_22', upvotes: 96, upvoters: [] },
  { title: 'Прорыв трубы на ул. Паркентская, вода на дороге', description: 'Вода течёт по улице уже 5 дней. Аварийная служба не реагирует.', category: 'water', status: 'done', photoUrl: '', lat: 41.3285, lng: 69.3011, createdBy: 'seed_user_23', upvotes: 83, upvoters: [] },
  { title: 'Грязная вода из крана (мутная, с запахом)', description: 'Вода жёлтого цвета с запахом тины. Дети жалуются на боли в животе.', category: 'water', status: 'open', photoUrl: '', lat: 41.2998, lng: 69.2389, createdBy: 'seed_user_24', upvotes: 112, upvoters: [] },

  // --- ENERGY ---
  { title: 'Отключения электричества по 8 часов в Сергели', description: 'Ежедневные веерные отключения с 9:00 до 17:00. Официальных объяснений нет.', category: 'energy', status: 'open', photoUrl: '', lat: 41.2655, lng: 69.2088, createdBy: 'seed_user_25', upvotes: 118, upvoters: [] },
  { title: 'Оборванные провода на столбе у школы', description: 'После шторма оборвались провода. Концы лежат на тротуаре.', category: 'energy', status: 'problem', photoUrl: '', lat: 41.3177, lng: 69.2722, createdBy: 'seed_user_26', upvotes: 85, upvoters: [] },
  { title: 'Уличные фонари работают днём, а ночью — нет', description: 'Датчик освещения неисправен: фонари горят с 6 до 18 часов. Ночью темно.', category: 'energy', status: 'open', photoUrl: '', lat: 41.3067, lng: 69.2364, createdBy: 'seed_user_27', upvotes: 31, upvoters: [] },
];

async function seed() {
  const force = process.argv.includes('--force');
  const snap = await getDocs(collection(db, 'issues'));
  if (!snap.empty && !force) {
    console.log(`[seed] issues collection already has ${snap.size} docs — skipping.`);
    console.log('[seed] Run with --force to add seed docs anyway.');
    process.exit(0);
  }

  console.log(`[seed] Seeding ${ISSUES_SEED.length} issues (existing: ${snap.size})...`);
  for (const issue of ISSUES_SEED) {
    await addDoc(collection(db, 'issues'), { ...issue, timestamp: serverTimestamp() });
    process.stdout.write('.');
  }
  console.log('\n[seed] Done!');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
