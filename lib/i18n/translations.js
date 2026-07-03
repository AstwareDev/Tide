export const SUPPORTED_LOCALES = ["en", "ru", "hy"];
export const DEFAULT_LOCALE = "en";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "hy", label: "Armenian", native: "Հայերեն" },
];

export const translations = {
  en: {
    nav: {
      inbox: "Inbox",
      agents: "Agents",
      activity: "Activity",
      settings: "Settings",
      logout: "Log out",
      gmailConnected: "Gmail connected",
      connecting: "Connecting…",
    },
    topbar: {
      searchHint: "K to search",
      runNow: "Run now",
      running: "Running…",
      inboxSubtitle: "Your Gmail, triaged",
      agentsSubtitle: "Rules that run on autopilot",
      activitySubtitle: "Everything your agents did",
      settingsSubtitle: "Provider, cadence, account",
    },
    landing: {
      getStarted: "Get Started",
      heroTitle: "Let AI keep your inbox clean",
      heroSubtitle:
        "Tide connects to your Gmail and runs AI agents that automatically label, archive, and delete the noise — so your inbox stays organized without you lifting a finger.",
      useApp: "Use the App",
      feature1: "Passive agents run in the background, no babysitting",
      feature2: "Labels, archives, and deletes based on rules you define",
      feature3: "Your email is only sent to your AI provider for classification",
    },
    login: {
      welcome: "Welcome to Tide",
      subtitle:
        "Connect your Gmail and let AI agents keep your inbox clean — automatically labeling, archiving, and deleting the noise.",
      feature1: "Passive agents run in the background, no babysitting",
      feature2: "Labels, archives, and deletes based on rules you define",
      feature3: "Your email is only sent to your AI provider for classification",
      connectGmail: "Connect Gmail",
    },
    inbox: {
      searchPlaceholder: "Search emails…",
      noMatch: "No emails match",
      inboxZero: "Inbox zero — nice.",
      selectEmail: "Select an email to preview",
      filters: "Filters",
      unread: "Unread",
      labels: "Labels",
      noLabelsYet: "No labels yet",
      clearFilters: "Clear filters",
      expandLabels: "Expand labels",
      collapse: "Collapse",
    },
    agents: {
      activeTotal: "{active} active · {total} total",
      newAgent: "New agent",
    },
    activity: {
      emptyTitle: "No activity yet",
      emptySubtitle: "Run your agents to see what they do here.",
      today: "Today",
      yesterday: "Yesterday",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your preferences, providers, and account",
      tabs: {
        general: "General",
        ai: "AI Provider",
        agents: "Agents",
        account: "Account",
      },
      language: {
        label: "Language",
        description: "Choose the language used across Tide",
      },
      ai: {
        provider: "AI Provider",
        providerDesc: "The SDK used to run email classification agents",
        providerValue: "Google Gemini",
        apiKey: "API Key",
        apiKeyDesc: "Set GEMINI_API_KEY in your Vercel project's environment variables",
        configured: "Configured",
        notSet: "Not set",
      },
      agentsTab: {
        pollingInterval: "Polling interval",
        pollingDesc:
          "Actual cadence is set by the Vercel Cron schedule (vercel.json) at deploy time — this is informational only",
        every1: "Every minute",
        every5: "Every 5 minutes",
        every15: "Every 15 minutes",
        every30: "Every 30 minutes",
        every60: "Every hour",
      },
      account: {
        gmailAccount: "Gmail account",
        connected: "Connected",
        disconnect: "Disconnect",
      },
      privacyTitle: "Privacy",
      privacyBody:
        "Email content is sent to your AI provider for classification only. OAuth tokens are stored in Vercel KV, scoped to this deployment. Tide has no third-party analytics.",
    },
  },
  ru: {
    nav: {
      inbox: "Входящие",
      agents: "Агенты",
      activity: "Активность",
      settings: "Настройки",
      logout: "Выйти",
      gmailConnected: "Gmail подключён",
      connecting: "Подключение…",
    },
    topbar: {
      searchHint: "K для поиска",
      runNow: "Запустить",
      running: "Выполняется…",
      inboxSubtitle: "Ваш Gmail, отсортированный",
      agentsSubtitle: "Правила, работающие автономно",
      activitySubtitle: "Всё, что сделали ваши агенты",
      settingsSubtitle: "Провайдер, частота, аккаунт",
    },
    landing: {
      getStarted: "Начать",
      heroTitle: "Пусть ИИ следит за порядком в почте",
      heroSubtitle:
        "Tide подключается к вашему Gmail и запускает ИИ-агентов, которые автоматически помечают, архивируют и удаляют лишнее — почта остаётся организованной без лишних усилий.",
      useApp: "Открыть приложение",
      feature1: "Фоновые агенты работают без присмотра",
      feature2: "Метки, архивация и удаление по вашим правилам",
      feature3: "Письма отправляются только вашему ИИ-провайдеру для классификации",
    },
    login: {
      welcome: "Добро пожаловать в Tide",
      subtitle:
        "Подключите Gmail, и ИИ-агенты будут поддерживать порядок в почте — автоматически помечая, архивируя и удаляя лишнее.",
      feature1: "Фоновые агенты работают без присмотра",
      feature2: "Метки, архивация и удаление по вашим правилам",
      feature3: "Письма отправляются только вашему ИИ-провайдеру для классификации",
      connectGmail: "Подключить Gmail",
    },
    inbox: {
      searchPlaceholder: "Поиск писем…",
      noMatch: "Совпадений не найдено",
      inboxZero: "Входящие пусты — отлично.",
      selectEmail: "Выберите письмо для просмотра",
      filters: "Фильтры",
      unread: "Непрочитанные",
      labels: "Метки",
      noLabelsYet: "Меток пока нет",
      clearFilters: "Сбросить фильтры",
      expandLabels: "Развернуть метки",
      collapse: "Свернуть",
    },
    agents: {
      activeTotal: "Активно: {active} · Всего: {total}",
      newAgent: "Новый агент",
    },
    activity: {
      emptyTitle: "Активности пока нет",
      emptySubtitle: "Запустите агентов, чтобы увидеть их действия здесь.",
      today: "Сегодня",
      yesterday: "Вчера",
    },
    settings: {
      title: "Настройки",
      subtitle: "Управляйте настройками, провайдерами и аккаунтом",
      tabs: {
        general: "Общее",
        ai: "ИИ-провайдер",
        agents: "Агенты",
        account: "Аккаунт",
      },
      language: {
        label: "Язык",
        description: "Выберите язык интерфейса Tide",
      },
      ai: {
        provider: "ИИ-провайдер",
        providerDesc: "SDK, используемый для классификации писем агентами",
        providerValue: "Google Gemini",
        apiKey: "API-ключ",
        apiKeyDesc: "Укажите GEMINI_API_KEY в переменных окружения вашего проекта Vercel",
        configured: "Настроено",
        notSet: "Не задано",
      },
      agentsTab: {
        pollingInterval: "Интервал опроса",
        pollingDesc:
          "Фактическая частота задаётся расписанием Vercel Cron (vercel.json) при деплое — здесь только для справки",
        every1: "Каждую минуту",
        every5: "Каждые 5 минут",
        every15: "Каждые 15 минут",
        every30: "Каждые 30 минут",
        every60: "Каждый час",
      },
      account: {
        gmailAccount: "Аккаунт Gmail",
        connected: "Подключено",
        disconnect: "Отключить",
      },
      privacyTitle: "Конфиденциальность",
      privacyBody:
        "Содержимое писем отправляется вашему ИИ-провайдеру только для классификации. Токены OAuth хранятся в Vercel KV в рамках этого деплоя. Tide не использует сторонней аналитики.",
    },
  },
  hy: {
    nav: {
      inbox: "Մուտքային",
      agents: "Գործակալներ",
      activity: "Ակտիվություն",
      settings: "Կարգավորումներ",
      logout: "Ելք",
      gmailConnected: "Gmail-ը միացված է",
      connecting: "Միանում է…",
    },
    topbar: {
      searchHint: "K՝ որոնման համար",
      runNow: "Գործարկել",
      running: "Աշխատում է…",
      inboxSubtitle: "Ձեր Gmail-ը, դասակարգված",
      agentsSubtitle: "Կանոններ, որոնք աշխատում են ինքնուրույն",
      activitySubtitle: "Այն ամենը, ինչ արել են ձեր գործակալները",
      settingsSubtitle: "Մատակարար, հաճախականություն, հաշիվ",
    },
    landing: {
      getStarted: "Սկսել",
      heroTitle: "Թող AI-ը մաքուր պահի ձեր փոստարկղը",
      heroSubtitle:
        "Tide-ը միանում է ձեր Gmail-ին և գործարկում է AI գործակալներ, որոնք ավտոմատ կերպով պիտակավորում, արխիվացնում և ջնջում են ավելորդը՝ առանց ձեր միջամտության։",
      useApp: "Օգտագործել հավելվածը",
      feature1: "Ֆոնային գործակալներն աշխատում են առանց հսկողության",
      feature2: "Պիտակավորում, արխիվացում և ջնջում՝ ըստ ձեր կանոնների",
      feature3: "Ձեր նամակներն ուղարկվում են միայն ձեր AI մատակարարին՝ դասակարգման համար",
    },
    login: {
      welcome: "Բարի գալուստ Tide",
      subtitle:
        "Միացրեք ձեր Gmail-ը, և AI գործակալները կպահեն ձեր փոստարկղը մաքուր՝ ավտոմատ պիտակավորելով, արխիվացնելով և ջնջելով ավելորդը։",
      feature1: "Ֆոնային գործակալներն աշխատում են առանց հսկողության",
      feature2: "Պիտակավորում, արխիվացում և ջնջում՝ ըստ ձեր կանոնների",
      feature3: "Ձեր նամակներն ուղարկվում են միայն ձեր AI մատակարարին՝ դասակարգման համար",
      connectGmail: "Միացնել Gmail-ը",
    },
    inbox: {
      searchPlaceholder: "Փնտրել նամակներ…",
      noMatch: "Համընկնումներ չկան",
      inboxZero: "Փոստարկղը դատարկ է — հիանալի է։",
      selectEmail: "Ընտրեք նամակ՝ նախադիտելու համար",
      filters: "Զտիչներ",
      unread: "Չկարդացած",
      labels: "Պիտակներ",
      noLabelsYet: "Պիտակներ դեռ չկան",
      clearFilters: "Մաքրել զտիչները",
      expandLabels: "Ընդարձակել պիտակները",
      collapse: "Ծալել",
    },
    agents: {
      activeTotal: "{active} ակտիվ · {total} ընդամենը",
      newAgent: "Նոր գործակալ",
    },
    activity: {
      emptyTitle: "Ակտիվություն դեռ չկա",
      emptySubtitle: "Գործարկեք ձեր գործակալներին՝ այստեղ դրանց գործողությունները տեսնելու համար։",
      today: "Այսօր",
      yesterday: "Երեկ",
    },
    settings: {
      title: "Կարգավորումներ",
      subtitle: "Կառավարեք ձեր նախապատվությունները, մատակարարներն ու հաշիվը",
      tabs: {
        general: "Ընդհանուր",
        ai: "AI մատակարար",
        agents: "Գործակալներ",
        account: "Հաշիվ",
      },
      language: {
        label: "Լեզու",
        description: "Ընտրեք Tide-ի ինտերֆեյսի լեզուն",
      },
      ai: {
        provider: "AI մատակարար",
        providerDesc: "SDK-ն, որն օգտագործվում է նամակների դասակարգման գործակալների համար",
        providerValue: "Google Gemini",
        apiKey: "API բանալի",
        apiKeyDesc: "Սահմանեք GEMINI_API_KEY-ը ձեր Vercel նախագծի միջավայրի փոփոխականներում",
        configured: "Կարգավորված է",
        notSet: "Սահմանված չէ",
      },
      agentsTab: {
        pollingInterval: "Հարցման միջակայք",
        pollingDesc:
          "Իրական հաճախականությունը սահմանվում է Vercel Cron ժամանակացույցով (vercel.json)՝ տեղակայման ժամանակ — սա միայն տեղեկատվական է",
        every1: "Ամեն րոպե",
        every5: "Ամեն 5 րոպեն",
        every15: "Ամեն 15 րոպեն",
        every30: "Ամեն 30 րոպեն",
        every60: "Ամեն ժամը",
      },
      account: {
        gmailAccount: "Gmail հաշիվ",
        connected: "Միացված է",
        disconnect: "Անջատել",
      },
      privacyTitle: "Գաղտնիություն",
      privacyBody:
        "Նամակների պարունակությունն ուղարկվում է ձեր AI մատակարարին միայն դասակարգման նպատակով։ OAuth տոկենները պահվում են Vercel KV-ում՝ սահմանափակված այս տեղակայմամբ։ Tide-ն օգտագործում է երրորդ կողմի անալիտիկա։",
    },
  },
};

export function translate(locale, key, vars) {
  const dict = translations[locale] || translations[DEFAULT_LOCALE];
  const fallback = translations[DEFAULT_LOCALE];
  const parts = key.split(".");
  const lookup = (source) => parts.reduce((node, part) => (node == null ? node : node[part]), source);
  const value = lookup(dict) ?? lookup(fallback) ?? key;
  if (typeof value !== "string") return key;
  if (!vars) return value;
  return Object.entries(vars).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), value);
}
