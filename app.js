/* =========================================================
   Grand Hotel & Spa — app.js

   1. Утилиты и состояние      5. Главная, услуги, меню
   2. Переводы                 6. Карта отеля
   3. Данные                   7. Чат-ассистент
   4. Тема, навигация, язык    8. Конвертер валют  ·  9. Запуск
   ========================================================= */
"use strict";

/* =========================================================
   1. УТИЛИТЫ И СОСТОЯНИЕ
   ========================================================= */
const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const storage = {
    get(key) {
        try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); } catch { /* хранилище недоступно — не критично */ }
    },
};

/** Код языка на сайте → код локали браузера (для атрибута lang, дат и склонений). */
const LOCALES = { ge: "ka", en: "en", ru: "ru" };
const savedLang = storage.get("selectedLanguage");

const state = {
    lang: Object.hasOwn(LOCALES, savedLang) ? savedLang : "ge",
    menuCategory: "all",
    menuSearch: "",
    mapFloor: "complex",
    mapPointId: null,
    mapSearch: "",
    mapCategory: "all",
    showRoute: false,
};

/** Берёт строку нужного языка из объекта { ge, en, ru }. */
const pick = (localized) => localized?.[state.lang] ?? localized?.ge ?? "";

/** Перевод по ключу. Плейсхолдеры вида {name} заменяются значениями из params. */
function t(key, params = {}) {
    const text = translations[state.lang]?.[key] ?? translations.ge[key] ?? "";
    return Object.entries(params).reduce(
        (result, [name, value]) => result.replaceAll(`{${name}}`, value),
        text
    );
}

/* =========================================================
   2. ПЕРЕВОДЫ
   ========================================================= */
const translations = {
    ge: {
        tab_home: "მთავარი", tab_services: "სერვისები და გართობა", tab_menu: "რესტორანი და მენიუ", tab_map: "სასტუმროს რუკა", tab_rules: "წესები",
        nav_home: "მთავარი", nav_services: "სერვისები", nav_menu: "მენიუ", nav_map: "რუკა", nav_rules: "წესები",
        welcome_title: "მოგესალმებით Grand Hotel & Spa-ში",
        welcome_desc: "ჩვენი სასტუმრო გთავაზობთ უმაღლესი დონის კომფორტს, ულამაზეს ხედებსა და მრავალფეროვან სერვისებს.",
        wifi: "უფასო Wi-Fi", parking: "უფასო პარკინგი", reception: "რეცეფცია", coffee: "უფასო ყავა/ჩაი",
        gallery_title: "სასტუმროს ფოტოგალერეა", gallery_1: "სასტუმროს ხედი", gallery_2: "კომფორტული ნომრები", gallery_3: "აუზი და დასვენება", gallery_4: "რესტორანი",
        menu_header: "კვება და რესტორანი", filter_all: "ყველა", filter_breakfast: "საუზმე", filter_lunch: "სადილი", filter_dinner: "ვახშამი",
        menu_search_placeholder: "მენიუში ძიება...",
        map_header: "სასტუმროს რუკა",
        map_info: "აირჩიეთ კორპუსი ან ტერიტორია, დააჭირეთ ობიექტს — გამოჩნდება მდებარეობა, საათები და დეტალები.",
        map_stats_aria: "ობიექტები ზონების მიხედვით",
        map_objects_count: { other: "{count} ობიექტი" },
        map_floor_aria: "ზონის არჩევა",
        map_stage_aria: "სასტუმროს ტერიტორიის გეგმა",
        map_select_title: "აირჩიეთ ობიექტი",
        map_list_hint: "დააჭირეთ ობიექტს მდებარეობისა და დეტალების სანახავად",
        map_entrance: "მთავარი შესასვლელი",
        map_stairs: "კიბე და ლიფტი",
        map_search_placeholder: "ობიექტის ძიება...",
        map_category_label: "კატეგორია",
        map_all_categories: "ყველა კატეგორია",
        map_route_show: "მარშრუტის ნახვა",
        map_route_hide: "მარშრუტის დამალვა",
        details_contact: "დაუკავშირდით რეცეფციას · 001",
        hero_map_btn: "რუკის ნახვა", hero_services_btn: "სერვისების ნახვა",
        chat_title: "ელზა — თქვენი ასისტენტი", chat_online: "ონლაინ • სასტუმროს ინფორმაცია", chat_input_placeholder: "დაწერეთ შეკითხვა...", chat_send_aria: "გაგზავნა", chat_open_aria: "ჩატის გახსნა",
        chat_fallback: "ბოდიში, ამ კითხვაზე ზუსტი პასუხი არ მაქვს. გთხოვთ, დაუკავშირდით რეცეფციას ნომერზე 001.",
        theme_toggle_aria: "თემის გადართვა", currency_toggle_aria: "ვალუტის კონვერტორი", currency_title: "ვალუტის კონვერტორი", currency_loading: "კურსი იტვირთება...",
        currency_note: "1 USD ≈ {rate} ₾ · განახლდა {time}", currency_offline: "1 USD ≈ {rate} ₾ · ოფლაინ მიახლოებითი კურსი",
        map_no_items: "ობიექტები ვერ მოიძებნა.",
        amenity_reception: "24/7 რეცეფცია", close_aria: "დახურვა",
        filter_desserts: "დესერტი", filter_drinks: "სასმელი", menu_filter_aria: "მენიუს კატეგორიები",
        menu_empty: "ვერაფერი მოიძებნა.",
        chat_welcome: "გამარჯობა! მე ელზა ვარ 🤖 როგორ დაგეხმაროთ? აირჩიეთ კითხვა ან დაწერეთ საკუთარი."
    },
    en: {
        tab_home: "Home", tab_services: "Services & Leisure", tab_menu: "Restaurant & Menu", tab_map: "Hotel Map", tab_rules: "Rules",
        nav_home: "Home", nav_services: "Services", nav_menu: "Menu", nav_map: "Hotel map", nav_rules: "Rules",
        welcome_title: "Welcome to Grand Hotel & Spa", welcome_desc: "Our hotel offers top-class comfort, beautiful views, and a variety of premium guest services.",
        wifi: "Free Wi-Fi", parking: "Free Parking", reception: "Reception", coffee: "Free Coffee/Tea",
        gallery_title: "Hotel Photo Gallery", gallery_1: "Hotel View", gallery_2: "Comfortable Rooms", gallery_3: "Pool & Spa", gallery_4: "Restaurant",
        menu_header: "Dining & Restaurant", filter_all: "All", filter_breakfast: "Breakfast", filter_lunch: "Lunch", filter_dinner: "Dinner",
        menu_search_placeholder: "Search the menu...",
        map_header: "Hotel Map",
        map_info: "Pick a zone or area, then tap a location — you'll see where it is, opening hours and details.",
        map_stats_aria: "Locations by zone",
        map_objects_count: { one: "{count} location", other: "{count} locations" },
        map_floor_aria: "Select zone",
        map_stage_aria: "Hotel site plan",
        map_select_title: "Select a location",
        map_list_hint: "Tap a location to see where it is and its details",
        map_entrance: "Main entrance",
        map_stairs: "Stairs & lift",
        map_search_placeholder: "Search locations...",
        map_category_label: "Category",
        map_all_categories: "All categories",
        map_route_show: "Show route",
        map_route_hide: "Hide route",
        details_contact: "Contact Reception · 001",
        hero_map_btn: "Open map", hero_services_btn: "Explore services",
        chat_title: "Elsa — Your Assistant", chat_online: "Online • hotel information", chat_input_placeholder: "Type a question...", chat_send_aria: "Send", chat_open_aria: "Open chat",
        chat_fallback: "Sorry, I don't have an exact answer to that. Please contact Reception by dialing 001.",
        theme_toggle_aria: "Toggle theme", currency_toggle_aria: "Currency converter", currency_title: "Currency Converter", currency_loading: "Loading exchange rate...",
        currency_note: "1 USD ≈ {rate} GEL · updated {time}", currency_offline: "1 USD ≈ {rate} GEL · approximate offline rate",
        map_no_items: "No locations found.",
        amenity_reception: "24/7 Reception", close_aria: "Close",
        filter_desserts: "Desserts", filter_drinks: "Drinks", menu_filter_aria: "Menu categories",
        menu_empty: "No items found.",
        chat_welcome: "Hello! I'm Elsa 🤖 How can I help? Choose a question or type your own."
    },
    ru: {
        tab_home: "Главная", tab_services: "Услуги и развлечения", tab_menu: "Ресторан и меню", tab_map: "Карта отеля", tab_rules: "Правила",
        nav_home: "Главная", nav_services: "Развлечения", nav_menu: "Меню", nav_map: "Карта отеля", nav_rules: "Правила",
        welcome_title: "Добро пожаловать в Grand Hotel & Spa", welcome_desc: "Наш отель предлагает комфорт высшего класса, прекрасные виды и широкий спектр услуг.",
        wifi: "Бесплатный Wi-Fi", parking: "Бесплатная парковка", reception: "Рецепция", coffee: "Бесплатный кофе/чай",
        gallery_title: "Фотогалерея отеля", gallery_1: "Вид на отель", gallery_2: "Уютные номера", gallery_3: "Бассейн и SPA", gallery_4: "Ресторан",
        menu_header: "Ресторан и питание", filter_all: "Все", filter_breakfast: "Завтрак", filter_lunch: "Обед", filter_dinner: "Ужин",
        menu_search_placeholder: "Поиск по меню...",
        map_header: "Карта отеля",
        map_info: "Выберите корпус или территорию и нажмите на объект — появятся расположение, часы работы и детали.",
        map_stats_aria: "Объекты по зонам",
        map_objects_count: { one: "{count} объект", few: "{count} объекта", many: "{count} объектов", other: "{count} объекта" },
        map_floor_aria: "Выбор зоны",
        map_stage_aria: "План территории отеля",
        map_select_title: "Выберите объект",
        map_list_hint: "Нажмите на объект, чтобы увидеть расположение и детали",
        map_entrance: "Главный вход",
        map_stairs: "Лестница и лифт",
        map_search_placeholder: "Поиск объекта...",
        map_category_label: "Категория",
        map_all_categories: "Все категории",
        map_route_show: "Показать маршрут",
        map_route_hide: "Скрыть маршрут",
        details_contact: "Связаться с рецепцией · 001",
        hero_map_btn: "Открыть карту", hero_services_btn: "Смотреть услуги",
        chat_title: "Эльза — ваш ассистент", chat_online: "Онлайн • информация отеля", chat_input_placeholder: "Напишите вопрос...", chat_send_aria: "Отправить", chat_open_aria: "Открыть чат",
        chat_fallback: "Извините, у меня нет точного ответа на этот вопрос. Свяжитесь с рецепцией по номеру 001.",
        theme_toggle_aria: "Переключить тему", currency_toggle_aria: "Конвертер валют", currency_title: "Конвертер валют", currency_loading: "Загрузка курса...",
        currency_note: "1 USD ≈ {rate} GEL · обновлено {time}", currency_offline: "1 USD ≈ {rate} GEL · примерный офлайн-курс",
        map_no_items: "Объекты не найдены.",
        amenity_reception: "Круглосуточная рецепция", close_aria: "Закрыть",
        filter_desserts: "Десерты", filter_drinks: "Напитки", menu_filter_aria: "Категории меню",
        menu_empty: "Ничего не найдено.",
        chat_welcome: "Здравствуйте! Я Эльза 🤖 Чем могу помочь? Выберите вопрос или напишите свой."
    }
};


/* =========================================================
   3. ДАННЫЕ (услуги, меню, вопросы для чата)
   ========================================================= */
const servicesData = [
    { title: { ge: "აუზები (ღია და დახურული)", en: "Pools (Indoor & Outdoor)", ru: "Бассейны (открытый и закрытый)" },
      desc: { ge: "დახურული თბილი აუზი და ღია აუზი ტერასაზე.", en: "Heated indoor pool and outdoor pool on the terrace.", ru: "Закрытый бассейн с подогревом и открытый бассейн на террасе." },
      badge: { ge: "08:00 - 22:00", en: "08:00 - 22:00", ru: "08:00 - 22:00" },
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80" },
    { title: { ge: "საბილიარდო კლუბი", en: "Billiards Club", ru: "Бильярдный клуб" },
      desc: { ge: "რუსული ბილიარდი და ამერიკული პული. ბარი სასმელებით.", en: "Russian billiards and American pool with bar service.", ru: "Русский бильярд и американский пул. Бар с напитками." },
      badge: { ge: "12:00 - 00:00", en: "12:00 - 00:00", ru: "12:00 - 00:00" },
      image: "https://c4.wallpaperflare.com/wallpaper/449/866/348/billiard-balls-pool-table-wallpaper-preview.jpg" },
    { title: { ge: "ცხენებით ჯირითი", en: "Horse Riding", ru: "Конные прогулки" },
      desc: { ge: "ორგანიზებული საცხენოსნო ტურები სასტუმროს გარშემო.", en: "Guided horse riding tours around the hotel area.", ru: "Организованные прогулки на лошадях вокруг отеля." },
      badge: { ge: "ჩაწერით", en: "By booking", ru: "По записи" },
      image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80" },
    { title: { ge: "სპა და მასაჟი", en: "Spa & Massage", ru: "SPA и массаж" },
      desc: { ge: "სარელაქსაციო პროცედურები, საუნა და ჰამამი.", en: "Relaxing treatments, sauna, and hammam.", ru: "Расслабляющие процедуры, сауна и хаммам." },
      badge: { ge: "10:00 - 20:00", en: "10:00 - 20:00", ru: "10:00 - 20:00" },
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80" },
    { title: { ge: "ფიტნეს დარბაზი", en: "Fitness Gym", ru: "Фитнес-зал" },
      desc: { ge: "თანამედროვე სავარჯიშო დარბაზი კარდიო ტრენაჟორებით.", en: "Modern gym equipped with cardio and strength equipment.", ru: "Современный тренажерный зал с кардио и силовыми тренажерами." },
      badge: { ge: "24/7", en: "24/7", ru: "24/7" },
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },

    { title: { ge: "ღვინის დეგუსტაცია", en: "Wine Tasting", ru: "Дегустация вин" },
      desc: { ge: "კახური ღვინოები, მათ შორის ქვევრის ღვინო, სომელიესთან ერთად.", en: "Kakhetian wines, including traditional qvevri wine, guided by a sommelier.", ru: "Кахетинские вина, включая вино из квеври, в сопровождении сомелье." },
      badge: { ge: "17:00 - 21:00", en: "17:00 - 21:00", ru: "17:00 - 21:00" },
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80" },
    { title: { ge: "ექსკურსიები კახეთში", en: "Kakheti Excursions", ru: "Экскурсии по Кахетии" },
      desc: { ge: "გიდთან ერთად ტური ტელავში, ალავერდის ტაძარსა და გრემის ციხე-ქალაქში.", en: "Guided tours to Telavi, Alaverdi Cathedral and the Gremi citadel.", ru: "Экскурсии с гидом по Телави, собору Алаверди и крепости Греми." },
      badge: { ge: "ჩაწერით", en: "By booking", ru: "По записи" },
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
    { title: { ge: "ტრანსფერი აეროპორტიდან", en: "Airport Transfer", ru: "Трансфер из аэропорта" },
      desc: { ge: "კომფორტული ავტომობილი აეროპორტიდან სასტუმრომდე.", en: "Comfortable car transfer from the airport to the hotel.", ru: "Комфортный трансфер из аэропорта до отеля." },
      badge: { ge: "ჩაწერით", en: "By booking", ru: "По записи" },
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80" },
    { title: { ge: "საბავშვო კლუბი", en: "Kids Club", ru: "Детский клуб" },
      desc: { ge: "თამაშები, ხელნაკეთობები და გართობა 4-12 წლის ბავშვებისთვის.", en: "Games, crafts and entertainment for children aged 4–12.", ru: "Игры, творчество и развлечения для детей 4–12 лет." },
      badge: { ge: "10:00 - 18:00", en: "10:00 - 18:00", ru: "10:00 - 18:00" },
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80" }
];

const menuData = [
    { name: { ge: "ომლეტი მწვანილით", en: "Herb Omelette", ru: "Омлет с зеленью" }, category: "breakfast", price: "15 ₾",
      desc: { ge: "ახალი კვერცხი, პომიდორი, მწვანილი, ტოსტი", en: "Fresh eggs, tomatoes, herbs, toast", ru: "Свежие яйца, томаты, зелень, тост" },
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80" },
    { name: { ge: "შვრიის ფაფა კენკრით", en: "Oatmeal with Berries", ru: "Овсяная каша с ягодами" }, category: "breakfast", price: "12 ₾",
      desc: { ge: "რძეზე ან წყალზე ხილითა და თაფლით", en: "Prepared on milk or water with honey", ru: "На молоке или воде с фруктами и медом" },
      image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=500&q=80" },
    { name: { ge: "პანკეიკი ნატურალური თაფლით", en: "Pancakes with Honey", ru: "Панкейки с медом" }, category: "breakfast", price: "14 ₾",
      desc: { ge: "ამერიკული პანკეიკები კარაქითა და კენკრით", en: "American pancakes with butter and berries", ru: "Пышные панкейки с маслом и свежими ягодами" },
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80" },
    { name: { ge: "ქართული საუზმე", en: "Georgian Breakfast", ru: "Грузинский завтрак" }, category: "breakfast", price: "18 ₾",
      desc: { ge: "ყველი სულგუნი, მჭადი, კვერცხი, კიტრი და პომიდორი", en: "Sulguni cheese, mchadi, eggs, cucumber & tomato", ru: "Сыр сулугуни, мчади, яйца, огурцы и томаты" },
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&q=80" },
    { name: { ge: "ხაჭაპური აჭარული", en: "Adjarian Khachapuri", ru: "Хачапури по-аджарски" }, category: "lunch", price: "20 ₾",
      desc: { ge: "ტრადიციული ხაჭაპური კარაქითა და კვერცხით", en: "Traditional cheese boat with butter and egg", ru: "Традиционная лодочка с сыром, маслом и яйцом" },
      image: "https://i.pinimg.com/1200x/75/eb/ab/75ebabc21063c31808c35e61a1aae2a1.jpg" },
    { name: { ge: "ხინკალი (5 ცალი)", en: "Khinkali (5 pcs)", ru: "Хинкали (5 шт)" }, category: "lunch", price: "10 ₾",
      desc: { ge: "ქალაქური ხინკალი საქონლისა და ღორის ხორცით", en: "Traditional dumplings filled with minced meat and herbs", ru: "Сочные хинкали со смесью говядины и свинины" },
      image: "https://i.pinimg.com/1200x/a7/a5/ff/a7a5fff4b2b4f6bd84940f645fc42ab5.jpg" },
    { name: { ge: "ცეზარი ქათმით", en: "Chicken Caesar Salad", ru: "Цезарь с курицей" }, category: "lunch", price: "22 ₾",
      desc: { ge: "გრილზე შემწვარი ქათმის ფილე, პარმეზანი, სოუსი", en: "Grilled chicken, iceberg lettuce, parmesan, sauce", ru: "Куриное филе на гриле, салат айсберг, пармезан и соус" },
      image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80" },
    { name: { ge: "სოკოს კრემ-სუპი", en: "Mushroom Cream Soup", ru: "Грибной крем-суп" }, category: "lunch", price: "16 ₾",
      desc: { ge: "ნაღები, ტყის სოკო, ორცხობილა", en: "Creamy wild mushroom soup served with croutons", ru: "Нежный суп из лесных грибов со сливками и сухариками" },
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80" },
    { name: { ge: "ორაგულის სტეიკი", en: "Salmon Steak", ru: "Стейк из лосося" }, category: "dinner", price: "45 ₾",
      desc: { ge: "ლიმონის სოუსითა და ისპანახით", en: "Served with lemon sauce and spinach", ru: "С лимонным соусом и шпинатом" },
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80" },
    { name: { ge: "საქონლის სტეიკი რიბაი", en: "Ribeye Steak", ru: "Стейк Рибай" }, category: "dinner", price: "55 ₾",
      desc: { ge: "შემწვარი ბოსტნეულითა და წითელი ღვინის სოუსით", en: "Grilled beef steak with vegetables and red wine sauce", ru: "Сочный стейк с овощами гриль и соусом из красного вина" },
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80" },
    { name: { ge: "ქათმის შქმერული", en: "Chicken Shkmeruli", ru: "Чкмерули" }, category: "dinner", price: "28 ₾",
      desc: { ge: "შემწვარი ქათამი რძის და ნივრის სოუსში", en: "Crispy chicken baked in milk and garlic sauce", ru: "Жареный цыпленок в нежно-сливочно-чесночном соусе" },
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&q=80" },
    { name: { ge: "პასტა კარბონარა", en: "Pasta Carbonara", ru: "Паста Карбонара" }, category: "dinner", price: "24 ₾",
      desc: { ge: "იტალიური პასტა ბეკონით, კვერცხითა და პარმეზანით", en: "Classic Italian pasta with bacon and parmesan", ru: "Классическая паста с беконом, яйцом и сыром пармезан" },
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80" },

    { name: { ge: "შოკოლადის ფონდანი", en: "Chocolate Fondant", ru: "Шоколадный фондан" }, category: "desserts", price: "14 ₾",
      desc: { ge: "თბილი შოკოლადის ნამცხვარი ვანილის ნაყინით", en: "Warm chocolate cake with vanilla ice cream", ru: "Тёплый шоколадный десерт с ванильным мороженым" },
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" },
    { name: { ge: "ჩიზქეიქი", en: "Cheesecake", ru: "Чизкейк" }, category: "desserts", price: "13 ₾",
      desc: { ge: "ნაზი ჩიზქეიქი კენკრის სოუსით", en: "Creamy cheesecake with berry sauce", ru: "Нежный чизкейк с ягодным соусом" },
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80" },
    { name: { ge: "ნაყინი კენკრით", en: "Ice Cream with Berries", ru: "Мороженое с ягодами" }, category: "desserts", price: "10 ₾",
      desc: { ge: "ვანილის ნაყინი ახალი კენკრით", en: "Vanilla ice cream with fresh berries", ru: "Ванильное мороженое со свежими ягодами" },
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80" },
    { name: { ge: "საფერავი (ჭიქა)", en: "Saperavi (glass)", ru: "Саперави (бокал)" }, category: "drinks", price: "12 ₾",
      desc: { ge: "მშრალი წითელი ღვინო კახეთიდან", en: "Dry red wine from Kakheti", ru: "Сухое красное вино из Кахетии" },
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80" },
    { name: { ge: "ტარხუნის ლიმონათი", en: "Tarragon Lemonade", ru: "Лимонад с тархуном" }, category: "drinks", price: "8 ₾",
      desc: { ge: "ცივი ლიმონათი ტარხუნითა და ლიმონით", en: "Chilled lemonade with tarragon and lemon", ru: "Охлаждённый лимонад с тархуном и лимоном" },
      image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&q=80" },
    { name: { ge: "კაპუჩინო", en: "Cappuccino", ru: "Капучино" }, category: "drinks", price: "7 ₾",
      desc: { ge: "ესპრესო რძის ქაფით", en: "Espresso with steamed milk foam", ru: "Эспрессо с молочной пенкой" },
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80" }
];

/* ---------- Правила заведения (что нельзя делать) ---------- */
const rulesData = [
    { icon: "check", tone: "danger",
      title: { ge: "მოწევა აკრძალულია", en: "No Smoking", ru: "Курение запрещено" },
      desc: { ge: "შენობის შიგნით, ნომრებში, აივანზე და საერთო სივრცეებში მოწევა კატეგორიულად აკრძალულია. ელექტრონული სიგარეტიც აკრძალულია.",
              en: "Smoking is strictly prohibited indoors — in rooms, on balconies, and in all shared spaces. E-cigarettes are also not allowed.",
              ru: "Курение категорически запрещено внутри здания — в номерах, на балконах и в общих зонах. Электронные сигареты также запрещены." },
      note: { ge: "მოწევისთვის გამოყოფილია სპეციალური ზონა შესასვლელთან.",
              en: "A designated smoking area is available near the entrance.",
              ru: "Для курения есть специальная зона у входа." } },

    { icon: "check", tone: "danger",
      title: { ge: "არ შეიტანოთ და არ მოიხმაროთ პიროტექნიკა", en: "No Fireworks or Open Flame", ru: "Фейерверки и открытый огонь запрещены" },
      desc: { ge: "პიროტექნიკის, სანთლების, ბენზინის ან სხვა აალებადი ნივთიერებების შეტანა კატეგორიულად აკრძალულია უსაფრთხოების მიზნით.",
              en: "Fireworks, candles, fuel and other flammable materials are strictly prohibited for safety reasons.",
              ru: "Фейерверки, свечи, топливо и другие горючие материалы запрещены по соображениям безопасности." },
      note: { ge: "", en: "", ru: "" } },

    { icon: "check", tone: "warn",
      title: { ge: "სიჩუმე 23:00-დან 08:00-მდე", en: "Quiet Hours 23:00–08:00", ru: "Тихие часы с 23:00 до 08:00" },
      desc: { ge: "ღამური სიჩუმის დაცვა სავალდებულოა — ხმამაღალი მუსიკა, წვეულებები და ხმაური საერთო სივრცეებში აკრძალულია.",
              en: "Night-time quiet is mandatory — loud music, parties and noise in shared areas are not allowed.",
              ru: "Ночная тишина обязательна — громкая музыка, вечеринки и шум в общих зонах запрещены." },
      note: { ge: "წვეულობის ორგანიზება შესაძლებელია მხოლოდ ცალკე დაჯავშნილ სივრცეში.",
              en: "Parties can be arranged only in a separately booked venue.",
              ru: "Мероприятия можно провести только в отдельно забронированной зоне." } },

    { icon: "check", tone: "warn",
      title: { ge: "უცხო პირების მოყვანა აკრძალულია", en: "No Unregistered Visitors", ru: "Посторонние лица без регистрации" },
      desc: { ge: "ნომრებში მხოლოდ რეგისტრირებული სტუმრების შესვლაა ნებადართული. სტუმრებს ვთხოვთ, წინასწარ დარეგისტრირდნენ რეცეფციაზე.",
              en: "Only registered guests may stay in the rooms. Visitors must register at Reception in advance.",
              ru: "В номерах могут находиться только зарегистрированные гости. Посетителей просим заранее регистрироваться на рецепции." },
      note: { ge: "", en: "", ru: "" } },

    { icon: "check", tone: "warn",
      title: { ge: "წესები აუზთან და SPA-ში", en: "Pool & Spa Rules", ru: "Правила у бассейна и в SPA" },
      desc: { ge: "აუზში ჭამა, სასმელი და შუშის ჭურჭლითთ შესვლა აკრძალულია. ბავშვები — მხოლოდ ზრდასრულის მეთვალყურეობით.",
              en: "Eating, drinking, glassware and diving are not allowed in the pool. Children must be supervised by an adult.",
              ru: "Еда, напитки, стеклянная посуда и прыжки в воду в бассейне запрещены. Дети — только под присмотром взрослых." },
      note: { ge: "აუზის ზონაში გარე ფეხსაცმლით შესვლა აკრძალულია.",
              en: "Outdoor shoes are not worn in the pool area.",
              ru: "В зоне бассейна не ходят в уличной обуви." } }
];



const faqData = [
    { id: "checkin", question: { ge: "⏰ როდის არის Check-in / Check-out?", en: "⏰ What is Check-in / Check-out time?", ru: "⏰ Время заезда (Check-in) и выезда?" },
      answer: { ge: "Check-in: 14:00 საათიდან. Check-out: 12:00 საათამდე.", en: "Check-in is from 14:00. Check-out is until 12:00.", ru: "Заезд (Check-in) — с 14:00. Выезд (Check-out) — до 12:00." } },
    { id: "wifi", question: { ge: "📶 რა არის Wi-Fi პაროლი?", en: "📶 What is the Wi-Fi password?", ru: "📶 Какой пароль от Wi-Fi?" },
      answer: { ge: "ქსელი: GrandHotel_Guest. პაროლი: hotel2026", en: "Network: GrandHotel_Guest. Password: hotel2026", ru: "Сеть: GrandHotel_Guest. Пароль: hotel2026" } },
    { id: "breakfast", question: { ge: "🍳 როდის არის საუზმე?", en: "🍳 What time is breakfast?", ru: "🍳 В какое время подается завтрак?" },
      answer: { ge: "საუზმე მოწოდებულია რესტორანში 08:00-დან 11:00 საათამდე.", en: "Breakfast is served in the restaurant from 08:00 to 11:00.", ru: "Завтрак подается в ресторане с 08:00 до 11:00." } },
    { id: "pool", question: { ge: "🏊‍♂️ როდის მუშაობს აუზი?", en: "🏊‍♂️ What are the pool hours?", ru: "🏊‍♂️ Часы работы бассейна?" },
      answer: { ge: "დახურული აუზი მუშაობს 08:00-დან 22:00-მდე, ღია აუზი — 09:00-დან 20:00-მდე.", en: "Indoor pool is open 08:00-22:00. Outdoor pool is open 09:00-20:00.", ru: "Крытый бассейн открыт с 08:00 до 22:00. Открытый бассейн — с 09:00 до 20:00." } },
    { id: "reception", question: { ge: "📞 როგორ დავუკავშირდე რეცეფციას?", en: "📞 How do I contact Reception?", ru: "📞 Как связаться с рецепцией?" },
      answer: { ge: "ნომრის ტელეფონიდან აკრიფეთ 001. რეცეფცია მუშაობს 24/7.", en: "Dial 001 from your room phone. Reception is open 24/7.", ru: "Наберите 001 с телефона в номере. Рецепция работает 24/7." } },
    { id: "parking", question: { ge: "🅿️ არის თუ არა პარკინგი უფასო?", en: "🅿️ Is parking free?", ru: "🅿️ Бесплатная ли парковка?" },
      answer: { ge: "დიახ, სასტუმროს სტუმრებისთვის პარკინგი უფასოა.", en: "Yes, parking is completely free for all hotel guests.", ru: "Да, парковка бесплатна для всех гостей отеля." } },
    { id: "transfer", question: { ge: "🚕 შესაძლებელია ტრანსფერი აეროპორტიდან?", en: "🚕 Can you arrange an airport transfer?", ru: "🚕 Можно ли заказать трансфер из аэропорта?" },
      answer: { ge: "დიახ, ტრანსფერი ჩაწერით. გთხოვთ, წინასწარ დაუკავშირდეთ რეცეფციას — 001.", en: "Yes, transfers are available by booking. Please contact Reception (001) in advance.", ru: "Да, трансфер доступен по предварительной записи. Пожалуйста, заранее свяжитесь с рецепцией — 001." } },
    { id: "laundry", question: { ge: "🧺 არის სამრეცხაო მომსახურება?", en: "🧺 Is laundry service available?", ru: "🧺 Есть ли услуга прачечной?" },
      answer: { ge: "დიახ, სამრეცხაო მომსახურება მოთხოვნით. დაუკავშირდით რეცეფციას — 001.", en: "Yes, laundry service is available on request. Contact Reception (001).", ru: "Да, услуга прачечной доступна по запросу. Свяжитесь с рецепцией — 001." } },
    { id: "spa", question: { ge: "💆 როგორ დავჯავშნო SPA პროცედურა?", en: "💆 How do I book a spa treatment?", ru: "💆 Как записаться на SPA-процедуру?" },
      answer: { ge: "SPA მუშაობს 10:00-დან 20:00-მდე. ჩასაწერად დარეკეთ რეცეფციაზე — 001.", en: "The spa is open 10:00–20:00. Call Reception (001) to book.", ru: "SPA работает с 10:00 до 20:00. Для записи позвоните на рецепцию — 001." } },
    { id: "wine", question: { ge: "🍷 როდის არის ღვინის დეგუსტაცია?", en: "🍷 When is the wine tasting?", ru: "🍷 Когда проходит дегустация вин?" },
      answer: { ge: "ღვინის დეგუსტაცია მიმდინარეობს 17:00-დან 21:00-მდე. ადგილის დასაჯავშნად დაუკავშირდით რეცეფციას.", en: "Wine tasting runs from 17:00 to 21:00. Please book a spot at Reception.", ru: "Дегустация вин проходит с 17:00 до 21:00. Место можно забронировать на рецепции." } }
];

/* =========================================================
   4. ТЕМА, НАВИГАЦИЯ, ЯЗЫК
   ========================================================= */

/* ---------- Тема ---------- */
const THEME_COLORS = { light: "#0f3d3e", dark: "#081f21" };

function applyTheme(theme, { save = false } = {}) {
    document.documentElement.dataset.theme = theme;
    $("#theme-toggle-btn").textContent = theme === "dark" ? "☀" : "☾";
    $("#theme-color-meta").content = THEME_COLORS[theme];
    if (save) storage.set("theme", theme);
}

function initTheme() {
    applyTheme(document.documentElement.dataset.theme || "light");
    $("#theme-toggle-btn").addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(next, { save: true });
    });
}

/* ---------- Плавающие панели: чат и конвертер валют ---------- */
const PANELS = {
    chat:     { panel: "#chat-window",    toggle: "#chat-toggle-btn" },
    currency: { panel: "#currency-panel", toggle: "#currency-toggle-btn" },
};

function setPanelOpen(name, open) {
    const { panel, toggle } = PANELS[name];
    $(panel).hidden = !open;
    $(toggle).setAttribute("aria-expanded", String(open));
}

function closeAllPanels() {
    Object.keys(PANELS).forEach((name) => setPanelOpen(name, false));
}

/** Открывает панель (остальные закрываются) или закрывает, если она уже открыта. */
function togglePanel(name) {
    const shouldOpen = $(PANELS[name].panel).hidden;
    closeAllPanels();
    setPanelOpen(name, shouldOpen);
    return shouldOpen;
}

/* ---------- Вкладки ---------- */
function showTab(id, { updateHash = true, scroll = true } = {}) {
    const section = document.getElementById(id);
    if (!section?.classList.contains("tab-content")) return;

    $$(".tab-content").forEach((tab) => { tab.hidden = tab !== section; });
    $$("[data-tab]").forEach((link) => {
        if (link.dataset.tab === id) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });
    closeAllPanels();

    if (updateHash) history.replaceState(null, "", `#${id}`);
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function initNavigation() {
    // Один обработчик на все ссылки меню (data-tab) и кнопки-переходы (data-go)
    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-tab], [data-go]");
        if (!trigger) return;
        event.preventDefault();
        showTab(trigger.dataset.tab ?? trigger.dataset.go);
    });

    window.addEventListener("hashchange", () => showTab(location.hash.slice(1), { updateHash: false }));

    // Сайт открыт по ссылке вида index.html#menu
    showTab(location.hash.slice(1) || "home", { updateHash: false, scroll: false });
}

/* ---------- Язык ---------- */
function translateAttribute(attribute, apply) {
    $$(`[${attribute}]`).forEach((el) => {
        const text = t(el.getAttribute(attribute));
        if (text) apply(el, text);
    });
}

/** Перерисовывает всё, что зависит от языка. */
function applyLanguage() {
    document.documentElement.lang = LOCALES[state.lang];
    translateAttribute("data-i18n", (el, text) => { el.textContent = text; });
    translateAttribute("data-i18n-placeholder", (el, text) => { el.placeholder = text; });
    translateAttribute("data-i18n-aria", (el, text) => el.setAttribute("aria-label", text));

    $$(".lang-btn").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.lang === state.lang));
    });

    renderServices();
    renderMenu();
    renderRules();
    renderMapStatic();
    resetChat();
    renderCurrencyNote();
}

function initLanguage() {
    $$(".lang-btn").forEach((btn) => btn.addEventListener("click", () => {
        state.lang = btn.dataset.lang;
        storage.set("selectedLanguage", state.lang);
        applyLanguage();
    }));
}

/* =========================================================
   5. ГЛАВНАЯ, УСЛУГИ, МЕНЮ
   ========================================================= */

/* ---------- Услуги ---------- */
function renderServices() {
    $("#services-count").textContent = servicesData.length;
    $("#services-list").innerHTML = servicesData.map((service) => `
        <article class="service-card" style="--card-image: url('${service.image}')">
            <div class="service-content">
                <h3>${pick(service.title)}</h3>
                <p>${pick(service.desc)}</p>
                <span class="service-badge">${pick(service.badge)}</span>
            </div>
        </article>
    `).join("");
}

/* ---------- Меню ресторана ---------- */
function initMenu() {
    $$(".filter-btn").forEach((button) => button.addEventListener("click", () => {
        state.menuCategory = button.dataset.category;
        $$(".filter-btn").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
        renderMenu();
    }));

    $("#menu-search").addEventListener("input", (event) => {
        state.menuSearch = event.target.value.trim().toLowerCase();
        renderMenu();
    });
}

const renderMenuCard = (item) => `
    <article class="menu-card">
        <div class="menu-image">
            <img src="${item.image}" alt="${pick(item.name)}" loading="lazy" decoding="async">
            <span class="price-pill">${item.price}</span>
        </div>
        <div class="menu-body">
            <span class="menu-category">${t(`filter_${item.category}`)}</span>
            <h3>${pick(item.name)}</h3>
            <p>${pick(item.desc)}</p>
        </div>
    </article>
`;

function renderMenu() {
    const items = menuData.filter((item) => {
        const inCategory = state.menuCategory === "all" || item.category === state.menuCategory;
        const text = `${pick(item.name)} ${pick(item.desc)}`.toLowerCase();
        return inCategory && text.includes(state.menuSearch);
    });

    $("#menu-count").textContent = items.length;
    $("#menu-list").innerHTML = items.length
        ? items.map(renderMenuCard).join("")
        : `<div class="empty-state">${t("menu_empty")}</div>`;
}

/* ---------- Запасной вариант, если картинка не загрузилась ---------- */
function initImageFallback() {
    // событие error не «всплывает», поэтому слушаем его на фазе перехвата
    document.addEventListener("error", (event) => {
        if (event.target instanceof HTMLImageElement) {
            event.target.closest("figure, .menu-image, .map-detail-media")?.classList.add("is-broken");
        }
    }, true);
}

/* ---------- Правила ---------- */
const renderRuleCard = (rule) => `
    <article class="rule-card" data-tone="${rule.tone}">
        <span class="rule-icon" data-icon="${rule.icon}" aria-hidden="true"></span>
        <div class="rule-body">
            <h3>${pick(rule.title)}</h3>
            <p>${pick(rule.desc)}</p>
            ${pick(rule.note) ? `<p class="rule-note"><span data-icon="info"></span>${pick(rule.note)}</p>` : ""}
        </div>
    </article>`;

function renderRules() {
    $("#rules-count").textContent = rulesData.length;
    $("#rules-list").innerHTML = rulesData.map(renderRuleCard).join("");
    hydrateIcons($("#rules-list"));
}


/* =========================================================
   6. КАРТА ОТЕЛЯ
   ========================================================= */

/* ---------- 6.1 Иконки ---------- */
const ICONS = {
    check: `<path d="M20 6 9 17l-5-5"/>`,
    wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/>',
    concierge: '<path d="M3 20a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1Z"/><path d="M20 16a8 8 0 1 0-16 0"/><path d="M12 4v4"/><path d="M10 4h4"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    dumbbell: '<path d="M6.5 6.5v11"/><path d="M17.5 6.5v11"/><path d="M3.5 9v6"/><path d="M20.5 9v6"/><path d="M6.5 12h11"/>',
    coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
    billiards: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>',
    wc: '<circle cx="7" cy="4.5" r="1.8"/><path d="M4.5 9.5h5M7 9.5V15M5.5 21 7 15l1.5 6"/><circle cx="17" cy="4.5" r="1.8"/><path d="M17 9l-3.5 7h7ZM15.5 16v5M18.5 16v5"/><path d="M12 3v18"/>',
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    compass: '<path d="M12 3l4.5 12L12 12.5 7.5 15z" fill="currentColor"/>',
    horse: '<path d="M4 20c0-3.5 2.5-6.5 6-7.5V9l-2-1V5l4-2 3 3-1 2 4 3v7"/><circle cx="16" cy="6" r="1"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    tree: '<path d="M12 2 6 12h3l-3 6h4v4h4v-4h4l-3-6h3z"/>',
    cabin: '<path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/>',
    lake: '<path d="M2 16c2 0 3-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2"/><path d="M2 20c2 0 3-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2"/>'
};

const svgIcon = (name) =>
    `<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] ?? ""}</svg>`;


/** Вставляет SVG-иконку в каждый элемент с data-icon="имя". */
function hydrateIcons(root = document) {
    $$("[data-icon]", root).forEach((el) => { el.innerHTML = svgIcon(el.dataset.icon); });
}

/* ---------- 6.2 Данные: зоны, категории, объекты ---------- */
const MAP_SIZE = { width: 1000, height: 620 };

const mapFloorsData = [
    { id: "complex",    icon: "layers",   tone: "deep", short: { ge: "მთელი ტერიტორია", en: "Complex Overview", ru: "Вся территория" }, shortIcon: "★",
      start: { x: 500, y: 560, labelKey: "map_entrance" } },
    { id: "building-a", icon: "building", tone: "teal", short: { ge: "კორპუსი A", en: "Building A", ru: "Корпус A" }, shortIcon: "A",
      start: { x: 420, y: 470, labelKey: "map_entrance" } },
    { id: "building-b", icon: "bed",      tone: "gold", short: { ge: "კორპუსი B", en: "Building B", ru: "Корпус B" }, shortIcon: "B",
      start: { x: 660, y: 272, labelKey: "map_stairs" } }
];

const mapCategoriesData = [
    { id: "wellness", label: { ge: "ველნესი", en: "Wellness", ru: "Велнес" } },
    { id: "leisure",  label: { ge: "გართობა", en: "Leisure",  ru: "Отдых" } },
    { id: "dining",   label: { ge: "კვება",   en: "Dining",   ru: "Питание" } },
    { id: "facility", label: { ge: "სერვისი", en: "Facility", ru: "Сервис" } },
    { id: "outdoor",  label: { ge: "ტერიტორია", en: "Outdoor", ru: "Территория" } }
];

const mapPointsData = [
    /* ==== Building A (main) ==== */
    { id: "reception", floorId: "building-a", category: "facility", icon: "concierge", hours: "24/7", x: 410, y: 395, route: [],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
      title: { ge: "რეცეფცია", en: "Reception", ru: "Ресепшен" },
      desc: { ge: "მთავარი შესასვლელი, ბარგის შენახვა, რჩევები ქალაქის შესახებ.", en: "Main entrance, luggage storage, local tips.", ru: "Главный вход, камера хранения, советы по городу." } },

    { id: "restaurant", floorId: "building-a", category: "dining", icon: "utensils", hours: "07:00 – 23:00", x: 205, y: 190, route: [[420, 190]],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
      title: { ge: "რესტორანი", en: "Restaurant", ru: "Ресторан" },
      desc: { ge: "საუზმე, სადილი და ვახშამი ადგილობრივი და საერთაშორისო კერძებით.", en: "Breakfast, lunch and dinner with local and international dishes.", ru: "Завтрак, обед и ужин с блюдами местной и международной кухни." } },

    { id: "lobby-bar", floorId: "building-a", category: "dining", icon: "coffee", hours: "09:00 – 01:00", x: 405, y: 215, route: [],
      title: { ge: "ლობი-ბარი", en: "Lobby Bar", ru: "Лобби-бар" },
      desc: { ge: "ყავა, ჩაი, კოქტეილები და მსუბუქი საჭმელები.", en: "Coffee, tea, cocktails and light snacks.", ru: "Кофе, чай, коктейли и легкие закуски." } },

    { id: "restroom-a", floorId: "building-a", category: "facility", icon: "wc", hours: "24/7", x: 650, y: 155, route: [[500, 155]],
      title: { ge: "საპირფარეშო (A)", en: "Restroom (A)", ru: "Санузел (A)" },
      desc: { ge: "საზოგადოებრივი საპირფარეშოები ჰოლში.", en: "Public restrooms in the lobby.", ru: "Общественные санузлы в холле." } },

    { id: "conference", floorId: "building-a", category: "facility", icon: "building", hours: "08:00 – 22:00", x: 650, y: 375, route: [[500, 375]],
      title: { ge: "საკონფერენციო დარბაზი", en: "Conference Hall", ru: "Конференц-зал" },
      desc: { ge: "დარბაზი ღონისძიებებისა და შეხვედრებისთვის.", en: "Hall for events and meetings.", ru: "Зал для мероприятий и встреч." } },

    /* ==== Building B (spa & pool) ==== */
    { id: "pool", floorId: "building-b", category: "wellness", icon: "waves", hours: "08:00 – 22:00", x: 290, y: 190, route: [[530, 272], [530, 190]],
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80",
      title: { ge: "აუზი", en: "Pool", ru: "Бассейн" },
      desc: { ge: "გათბობადი დახურული აუზი შეზლონგებითა და დასასვენებელი ზონით.", en: "Heated indoor pool with sunbeds and a relaxation area.", ru: "Подогреваемый крытый бассейн с шезлонгами и зоной отдыха." } },

    { id: "spa", floorId: "building-b", category: "wellness", icon: "leaf", hours: "08:00 – 22:00", x: 650, y: 155, route: [],
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80",
      title: { ge: "SPA", en: "SPA", ru: "SPA" },
      desc: { ge: "სარელაქსაციო პროცედურები, საუნა და ჰამამი.", en: "Relaxing treatments, sauna, and hammam.", ru: "Расслабляющие процедуры, сауна и хаммам." } },

    { id: "gym", floorId: "building-b", category: "wellness", icon: "dumbbell", hours: "06:00 – 22:00", x: 650, y: 375, route: [],
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
      title: { ge: "ფიტნესი", en: "Fitness", ru: "Фитнес" },
      desc: { ge: "თანამედროვე სავარჯიშო ინვენტარი და კარდიო ზონა.", en: "Modern workout equipment and cardio area.", ru: "Современные тренажеры и кардио-зона." } },

    { id: "billiards", floorId: "building-b", category: "leisure", icon: "billiards", hours: "12:00 – 00:00", x: 855, y: 375, route: [[855, 272]],
      image: "https://c4.wallpaperflare.com/wallpaper/449/866/348/billiard-balls-pool-table-wallpaper-preview.jpg",
      title: { ge: "ბილიარდი", en: "Billiards", ru: "Бильярд" },
      desc: { ge: "რუსული და ამერიკული ბილიარდი, სასმელები ბარიდან.", en: "Russian and American pool tables with bar service.", ru: "Русский бильярд и американский пул. Напитки из бара." } },

    { id: "restroom-b", floorId: "building-b", category: "facility", icon: "wc", hours: "24/7", x: 505, y: 225, route: [[540, 272]],
      title: { ge: "საპირფარეშო (B)", en: "Restroom (B)", ru: "Санузел (B)" },
      desc: { ge: "საზოგადოებრივი საპირფარეშოები B კორპუსში.", en: "Public restrooms in Building B.", ru: "Общественные санузлы в корпусе B." } },

    /* ==== Outdoor / complex ==== */
    { id: "horse-riding", floorId: "complex", category: "outdoor", icon: "horse", hours: "09:00 – 19:00", x: 165, y: 460, route: [],
      image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900&q=80",
      title: { ge: "ცხენებით ჯირითი", en: "Horse Riding", ru: "Конные прогулки" },
      desc: { ge: "ორგანიზებული საცხენოსნო ტურები სასტუმროს გარშემო.", en: "Guided horse riding tours around the hotel area.", ru: "Организованные прогулки на лошадях вокруг отеля." } },

    { id: "stable", floorId: "complex", category: "outdoor", icon: "cabin", hours: "08:00 – 20:00", x: 285, y: 495, route: [],
      title: { ge: "საჯინიბო", en: "Stables", ru: "Конюшня" },
      desc: { ge: "ადგილი, სადაც ცხენები ბინადრობენ.", en: "Horses are kept here.", ru: "Здесь содержатся лошади." } },

    { id: "lake", floorId: "complex", category: "outdoor", icon: "lake", hours: "24/7", x: 800, y: 480, route: [],
      title: { ge: "ტბა", en: "Lake", ru: "Озеро" },
      desc: { ge: "პატარა ტბა პრომენადისთვის.", en: "Small scenic lake for walks.", ru: "Небольшое живописное озеро для прогулок." } },

    { id: "parking", floorId: "complex", category: "outdoor", icon: "parking", hours: "24/7", x: 500, y: 470, route: [],
      title: { ge: "პარკინგი", en: "Parking", ru: "Парковка" },
      desc: { ge: "უფასო პარკინგი სასტუმროს სტუმრებისთვის.", en: "Free parking for hotel guests.", ru: "Бесплатная парковка для гостей отеля." } },

    { id: "garden", floorId: "complex", category: "outdoor", icon: "tree", hours: "24/7", x: 455, y: 195, route: [],
      title: { ge: "ბაღი", en: "Garden", ru: "Сад" },
      desc: { ge: "მწვანე ბაღი დასვენებისთვის.", en: "Green garden for relaxation.", ru: "Зелёный сад для отдыха." } }
];

/* ---------- 6.3 Векторные планы (рисуются как SVG) ---------- */
const svgRect   = (cls, x, y, w, h, r = 0) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const svgCircle = (cls, cx, cy, r) => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}"/>`;
const svgLine   = (cls, x1, y1, x2, y2) => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const svgLabel  = (x, y, w, h, text) => `
    <g>
        <rect class="plan-label-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>
        <text class="plan-label" x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle">${text}</text>
    </g>`;

const planTree = (cx, cy, r) => svgCircle("plan-tree", cx, cy, r) + svgCircle("plan-tree-core", cx - r * 0.2, cy - r * 0.2, r * 0.55);
const planTable = (cx, cy) => svgCircle("plan-chairs", cx, cy, 18) + svgCircle("plan-furniture", cx, cy, 10);

const planSurroundings = () => [
    [20, 90, 14], [20, 520, 14], [960, 90, 14], [960, 520, 14],
    [60, 600, 10], [940, 600, 10], [480, 20, 10]
].map(([x, y, r]) => planTree(x, y, r)).join("");

const planBuilding = () => svgRect("plan-building", 50, 60, 900, 430, 12);
const planRoom = (x, y, w, h) => svgRect("plan-room", x, y, w, h, 8);

/* ---------- Зона Complex (вся территория) ---------- */
function planComplex() {
    const paths = `
        <path class="plan-road" d="M 0 340 L 1000 340" />
        <path class="plan-road" d="M 500 0 L 500 620" />
    `;
    return [
        planSurroundings(),
        svgRect("plan-grass", 40, 40, 920, 250, 20),
        svgRect("plan-grass", 40, 380, 920, 200, 20),
        paths,

        svgRect("plan-building-a", 80, 100, 330, 220, 16),
        svgLabel(80, 100, 330, 26, "BUILDING A"),

        svgRect("plan-building-b", 590, 100, 330, 220, 16),
        svgLabel(590, 100, 330, 26, "BUILDING B"),

        svgRect("plan-parking", 400, 410, 200, 130, 16),
        svgLabel(400, 410, 200, 26, "PARKING"),

        svgRect("plan-lake", 700, 400, 220, 140, 70),

        svgRect("plan-stable", 80, 420, 260, 120, 16),
        svgLabel(80, 420, 260, 26, "STABLE"),

        svgRect("plan-fence", 20, 20, 960, 580, 20)
    ].join("");
}

/* ---------- Корпус A ---------- */
function planBuildingA() {
    const restaurantTables = [[120, 130], [200, 130], [280, 130], [120, 230], [200, 230], [280, 230]];
    return [
        planSurroundings(),
        svgRect("plan-grass", 40, 40, 920, 540, 20),
        planBuilding(),

        planRoom(80, 80, 250, 220),
        ...restaurantTables.map(([x, y]) => planTable(x, y)),
        svgLabel(80, 310, 250, 26, "RESTAURANT"),

        svgRect("plan-furniture", 360, 150, 90, 30, 10),
        svgRect("plan-furniture", 360, 250, 90, 30, 10),
        svgRect("plan-furniture", 380, 420, 60, 26, 10),
        svgLabel(340, 510, 160, 26, "LOBBY"),

        planRoom(560, 80, 180, 150),
        svgLabel(560, 240, 180, 26, "RESTROOM"),

        planRoom(560, 300, 180, 150),
        svgLabel(560, 460, 180, 26, "CONFERENCE"),

        svgLine("plan-entrance", 380, 470, 460, 470),
        svgLine("plan-path", 400, 470, 440, 620),
        svgLabel(340, 545, 160, 26, "MAIN ENTRANCE")
    ].join("");
}

/* ---------- Корпус B ---------- */
function planBuildingB() {
    const loungers = [90, 130, 170, 210, 250];
    const treadmills = [590, 630, 670];
    return [
        planSurroundings(),
        svgRect("plan-grass", 40, 40, 920, 540, 20),
        planBuilding(),

        planRoom(80, 80, 420, 220),
        svgRect("plan-water", 110, 110, 360, 160, 16),
        svgLine("plan-lane", 130, 150, 450, 150),
        svgLine("plan-lane", 130, 190, 450, 190),
        svgLine("plan-lane", 130, 230, 450, 230),
        ...loungers.map(x => svgRect("plan-furniture", x, 270, 30, 14, 4)),
        svgLabel(80, 310, 420, 26, "POOL"),

        planRoom(560, 80, 180, 150),
        svgLabel(560, 240, 180, 26, "SPA"),

        planRoom(780, 80, 150, 150),
        svgLabel(780, 240, 150, 26, "SAUNA"),

        planRoom(560, 300, 180, 150),
        ...treadmills.map(x => svgRect("plan-furniture", x, 330, 26, 60, 5)),
        svgLabel(560, 460, 180, 26, "FITNESS"),

        planRoom(780, 300, 150, 150),
        svgRect("plan-felt", 805, 330, 100, 60, 6),
        svgLabel(780, 460, 150, 26, "BILLIARDS"),

        svgRect("plan-furniture", 470, 200, 70, 60, 8),
        svgLabel(440, 270, 130, 26, "RESTROOM"),

        svgLine("plan-entrance", 620, 470, 700, 470),
        svgLine("plan-path", 640, 470, 680, 620),
        svgLabel(620, 545, 160, 26, "ENTRANCE B")
    ].join("");
}

const floorPlans = {
    "complex":    planComplex,
    "building-a": planBuildingA,
    "building-b": planBuildingB
};

/* =========================================================
   6.4 КАРТА — ЛОГИКА
   ========================================================= */
const getMapFloor = (id) => mapFloorsData.find((floor) => floor.id === id);
const getMapPoint = (id) => mapPointsData.find((point) => point.id === id);

const mapPosition = (x, y) =>
    `--x:${(x / MAP_SIZE.width * 100).toFixed(2)}%;--y:${(y / MAP_SIZE.height * 100).toFixed(2)}%`;

/** Склонение: «1 объект», «2 объекта», «5 объектов» и т.д. */
function tPlural(key, count) {
    const forms = translations[state.lang]?.[key] ?? translations.ge[key];
    const rule = new Intl.PluralRules(LOCALES[state.lang]).select(count);
    return (forms[rule] ?? forms.other).replace("{count}", count);
}

/** Объекты, подходящие под текущий поиск и категорию. */
function getVisiblePoints() {
    return mapPointsData.filter((point) => {
        const inCategory = state.mapCategory === "all" || point.category === state.mapCategory;
        const matchesSearch = pick(point.title).toLowerCase().includes(state.mapSearch);
        return inCategory && matchesSearch;
    });
}

/* ---------- События ---------- */
function initMap() {
    state.mapPointId = mapPointsData.find((point) => point.floorId === state.mapFloor)?.id ?? null;

    $("#map").addEventListener("click", (event) => {
        const floorButton = event.target.closest("[data-floor]");
        const pointButton = event.target.closest("[data-point]");

        if (floorButton) setMapFloor(floorButton.dataset.floor);
        else if (pointButton) selectMapPoint(pointButton.dataset.point);
        else if (event.target.closest("#map-route-btn")) toggleMapRoute();
    });

    $("#map-search").addEventListener("input", (event) => {
        state.mapSearch = event.target.value.trim().toLowerCase();
        applyMapFilters();
    });

    $("#map-category").addEventListener("change", (event) => {
        state.mapCategory = event.target.value;
        applyMapFilters();
    });
}

function setMapFloor(floorId) {
    if (floorId === state.mapFloor) return;
    state.mapFloor = floorId;
    state.showRoute = false;

    // Если выбранный объект находится на другой зоне — выбираем первый объект новой зоны
    if (getMapPoint(state.mapPointId)?.floorId !== floorId) {
        const visible = getVisiblePoints();
        state.mapPointId = (visible.find((point) => point.floorId === floorId) ?? visible[0])?.id ?? null;
    }
    renderMapView();
}

function selectMapPoint(id) {
    const point = getMapPoint(id);
    if (!point) return;

    state.mapPointId = id;
    state.showRoute = false;

    if (point.floorId === state.mapFloor) {
        syncMapSelection();
    } else {
        state.mapFloor = point.floorId;
        renderMapView();
    }
}

function applyMapFilters() {
    const visible = getVisiblePoints();

    if (!visible.some((point) => point.id === state.mapPointId)) {
        const next = visible.find((point) => point.floorId === state.mapFloor) ?? visible[0];
        state.mapPointId = next?.id ?? null;
        state.showRoute = false;
        if (next) state.mapFloor = next.floorId;
    }
    renderMapView();
}

function toggleMapRoute() {
    state.showRoute = !state.showRoute;
    renderMapRoute();
    if (state.showRoute) $("#map-stage").scrollIntoView({ behavior: "smooth", block: "center" });
}

/* =========================================================
   6.5 КАРТА — ОТРИСОВКА
   ========================================================= */

/** Перерисовывает всё, что зависит от языка (вызывается при смене языка). */
function renderMapStatic() {
    renderMapStats();
    renderMapFloorControls();
    renderMapCategoryOptions();
    renderMapLegend();
    renderMapView();
}

function renderMapStats() {
    $("#map-stats").innerHTML = mapFloorsData.map((floor) => {
        const count = mapPointsData.filter((point) => point.floorId === floor.id).length;
        return `
            <li class="map-stat" data-tone="${floor.tone}">
                <span class="map-stat-icon">${svgIcon(floor.icon)}</span>
                <span class="map-stat-text">
                    <strong>${pick(floor.short)}</strong>
                    <small>${tPlural("map_objects_count", count)}</small>
                </span>
            </li>`;
    }).join("");
}

function renderMapFloorControls() {
    $("#map-floor-tabs").innerHTML = mapFloorsData.map((floor) => `
        <button type="button" class="map-floor-tab" data-floor="${floor.id}" aria-pressed="false">
            ${pick(floor.short)}
        </button>`).join("");

    $("#map-level-switch").innerHTML = mapFloorsData.map((floor) => `
        <button type="button" class="map-level-btn" data-floor="${floor.id}" aria-pressed="false"
                aria-label="${pick(floor.short)}">${floor.shortIcon}</button>`).join("");
}

function renderMapCategoryOptions() {
    const options = mapCategoriesData.map((category) =>
        `<option value="${category.id}">${pick(category.label)}</option>`);

    const select = $("#map-category");
    select.innerHTML = `<option value="all">${t("map_all_categories")}</option>${options.join("")}`;
    select.value = state.mapCategory;
}

function renderMapLegend() {
    $("#map-legend").innerHTML = mapCategoriesData.map((category) => `
        <li class="map-legend-item" data-category="${category.id}">
            <span class="map-legend-dot"></span>${pick(category.label)}
        </li>`).join("");
}

function renderMapView() {
    const floor = getMapFloor(state.mapFloor) ?? mapFloorsData[0];
    const visible = getVisiblePoints();

    $("#map-plan").innerHTML = floorPlans[floor.id]();
    $("#map-pins").innerHTML = visible
        .filter((point) => point.floorId === floor.id)
        .map(renderMapPin)
        .join("");

    renderMapList(visible);
    syncMapSelection();
}

const renderMapPin = (point) => `
    <button type="button" class="map-pin" data-point="${point.id}" data-category="${point.category}"
            style="${mapPosition(point.x, point.y)}" aria-pressed="false">
        <span class="map-pin-badge">${svgIcon(point.icon)}</span>
        <span class="map-pin-label">${pick(point.title)}</span>
    </button>`;

function renderMapList(points) {
    $("#map-list").innerHTML = points.length
        ? points.map((point) => `
            <li>
                <button type="button" class="map-list-item" data-point="${point.id}"
                        data-category="${point.category}" aria-current="false">
                    <span class="map-list-icon">${svgIcon(point.icon)}</span>
                    <span class="map-list-text">
                        <strong>${pick(point.title)}</strong>
                        <small>${point.hours} · ${pick(getMapFloor(point.floorId).short)}</small>
                    </span>
                    ${svgIcon("chevronRight")}
                </button>
            </li>`).join("")
        : `<li class="map-empty">${t("map_no_items")}</li>`;
}

/** Подсвечивает выбранные зону и объект, обновляет карточку и маршрут. */
function syncMapSelection() {
    $$("[data-floor]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.floor === state.mapFloor));
    });
    $$(".map-pin").forEach((pin) => {
        pin.setAttribute("aria-pressed", String(pin.dataset.point === state.mapPointId));
    });
    $$(".map-list-item").forEach((item) => {
        item.setAttribute("aria-current", String(item.dataset.point === state.mapPointId));
    });

    keepActiveListItemInView();
    renderMapDetail();
    renderMapRoute();
}

/** Прокручивает список внутри его контейнера (сама страница не «прыгает»). */
function keepActiveListItemInView() {
    const list = $("#map-list");
    const item = $('[aria-current="true"]', list)?.closest("li");
    if (!item) return;

    if (item.offsetTop < list.scrollTop) {
        list.scrollTop = item.offsetTop;
    } else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
    }
}

function renderMapDetail() {
    const point = getMapPoint(state.mapPointId);
    $("#map-detail").hidden = !point;
    if (!point) return;

    const title = pick(point.title);
    const media = $("#map-detail-media");
    media.classList.remove("is-broken");
    media.innerHTML = point.image
        ? `<img src="${point.image}" alt="${title}" loading="lazy" decoding="async">`
        : `<span class="map-detail-fallback">${svgIcon(point.icon)}</span>`;

    $("#map-detail-icon").innerHTML = svgIcon(point.icon);
    $("#map-detail-title").textContent = title;
    $("#map-detail-floor").textContent = pick(getMapFloor(point.floorId).short);
    $("#map-detail-hours").textContent = point.hours;
    $("#map-detail-desc").textContent = pick(point.desc);
}

function renderMapRoute() {
    const point = getMapPoint(state.mapPointId);
    const floor = getMapFloor(state.mapFloor);
    const isActive = Boolean(state.showRoute && point && point.floorId === floor.id);

    $("#map-route-btn").setAttribute("aria-pressed", String(isActive));
    $("#map-route-label").textContent = t(isActive ? "map_route_hide" : "map_route_show");

    if (!isActive) {
        $("#map-route").innerHTML = "";
        return;
    }

    const path = [[floor.start.x, floor.start.y], ...point.route, [point.x, point.y]]
        .map((coords) => coords.join(","))
        .join(" ");
    $("#map-route").innerHTML = `
        <polyline class="map-route-casing" points="${path}"/>
        <polyline class="map-route-line" points="${path}"/>`;
}

/* =========================================================
   7. ЧАТ-АССИСТЕНТ
   ========================================================= */
function initChat() {
    const input = $("#chat-text-input");

    $("#chat-toggle-btn").addEventListener("click", () => {
        if (togglePanel("chat")) input.focus();
    });
    $("#chat-close-btn").addEventListener("click", () => setPanelOpen("chat", false));
    $("#chat-send-btn").addEventListener("click", sendUserMessage);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.isComposing) {
            event.preventDefault();
            sendUserMessage();
        }
    });
}

/** Очищает переписку: приветствие + кнопки с готовыми вопросами. */
function resetChat() {
    $("#chat-messages").replaceChildren();
    addChatMessage(t("chat_welcome"), "bot");

    const quickQuestions = faqData.map((faq) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chat-q-btn";
        button.textContent = pick(faq.question);
        button.addEventListener("click", () => ask(pick(faq.question), pick(faq.answer)));
        return button;
    });
    $("#chat-quick-questions").replaceChildren(...quickQuestions);
}

function sendUserMessage() {
    const input = $("#chat-text-input");
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    const match = findFaqMatch(text);
    ask(text, match ? pick(match.answer) : t("chat_fallback"));
}

/** Показывает вопрос пользователя, «печатает» и выдаёт ответ. */
function ask(question, answer) {
    addChatMessage(question, "user");
    showTyping();
    setTimeout(() => {
        removeTyping();
        addChatMessage(answer, "bot");
    }, 450);
}

/** Ищет FAQ, в вопросе которого больше всего слов из сообщения пользователя. */
function findFaqMatch(text) {
    const message = text.toLowerCase();
    let best = null;
    let bestScore = 0;

    for (const faq of faqData) {
        const words = pick(faq.question)
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, "")   // убираем эмодзи и знаки препинания
            .split(/\s+/)
            .filter((word) => word.length > 3);

        const score = words.filter((word) => message.includes(word)).length;
        if (score > bestScore) {
            best = faq;
            bestScore = score;
        }
    }
    return best;
}

function addChatMessage(text, sender, extraClass = "") {
    const messages = $("#chat-messages");
    const bubble = document.createElement("div");
    bubble.className = `chat-msg ${sender} ${extraClass}`.trim();
    bubble.textContent = text;
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
    removeTyping();
    addChatMessage("•••", "bot", "typing");
}

function removeTyping() {
    $("#chat-messages .typing")?.remove();
}

/* =========================================================
   8. КОНВЕРТЕР ВАЛЮТ
   ========================================================= */
// Сколько единиц валюты в 1 лари. Запасные значения — на случай, если сервис курсов недоступен.
const FALLBACK_RATES = { GEL: 1, USD: 0.365, EUR: 0.335 };
const rates = { ...FALLBACK_RATES };
const rateInfo = { status: "loading", updated: null };   // status: loading | live | offline

function initCurrency() {
    $("#currency-toggle-btn").addEventListener("click", () => {
        if (togglePanel("currency")) $("#currency-gel-input").focus();
    });
    $("#currency-close-btn").addEventListener("click", () => setPanelOpen("currency", false));

    // Ввод в любом из трёх полей пересчитывает два остальных
    $("#currency-panel").addEventListener("input", (event) => convertFrom(event.target));

    // Клик вне конвертера закрывает его
    document.addEventListener("click", (event) => {
        if (!event.target.closest("#currency-panel, #currency-toggle-btn")) setPanelOpen("currency", false);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAllPanels();
    });

    convertFrom($("#currency-gel-input"));
    loadExchangeRates();
}

/** Пересчитывает все поля, кроме того, в которое пользователь вводит сумму. */
function convertFrom(source) {
    const amount = parseFloat(source.value);
    const amountInGel = amount / rates[source.dataset.currency];

    $$("[data-currency]").forEach((input) => {
        if (input === source) return;
        input.value = Number.isNaN(amount) ? "" : (amountInGel * rates[input.dataset.currency]).toFixed(2);
    });
}

async function loadExchangeRates() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/GEL", { signal: AbortSignal.timeout(5000) });
        const data = await response.json();
        if (data.result !== "success" || !data.rates?.USD || !data.rates?.EUR) throw new Error("Unexpected response");

        rates.USD = data.rates.USD;
        rates.EUR = data.rates.EUR;
        rateInfo.status = "live";
        rateInfo.updated = data.time_last_update_utc ? new Date(data.time_last_update_utc) : new Date();
    } catch {
        rateInfo.status = "offline";   // остаются запасные курсы
    }

    renderCurrencyNote();
    convertFrom($("#currency-gel-input"));
}

function renderCurrencyNote() {
    const rate = (1 / rates.USD).toFixed(2);
    const note = $("#currency-note");

    if (rateInfo.status === "live") {
        note.textContent = t("currency_note", { rate, time: rateInfo.updated.toLocaleDateString(LOCALES[state.lang]) });
    } else if (rateInfo.status === "offline") {
        note.textContent = t("currency_offline", { rate });
    } else {
        note.textContent = t("currency_loading");
    }
}

/* =========================================================
   9. ЗАПУСК
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    hydrateIcons();
    initTheme();
    initNavigation();
    initLanguage();
    initMenu();
    initMap();
    initChat();
    initCurrency();
    initImageFallback();

    applyLanguage();   // первая отрисовка: переводы, услуги, меню, карта, чат
});