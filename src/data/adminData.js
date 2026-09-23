/**
 * Весь статичный текст и иконки админки/аналитики — в одном месте, чтобы
 * менять формулировки не залезая в JSX. Компоненты сами держат только
 * динамику (числа, подстановки, состояния).
 */
import { MdOutlineAnalytics, MdMenu, MdClose } from 'react-icons/md';
import { FaUsers, FaArrowLeft } from 'react-icons/fa';
import { IoIosLaptop, IoIosTabletLandscape, IoMdSettings } from 'react-icons/io';
import { CiMobile1, CiWarning } from 'react-icons/ci';

const adminData = {
  common: {
    checkingSession: 'Проверяем сессию…',
    errorPrefix: 'Ошибка:',
    retry: 'Повторить',
    noData: 'Нет данных',
  },

  login: {
    title: 'Панель администратора',
    hint: 'Войдите, чтобы увидеть аналитику.',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Пароль',
    missingFieldsError: 'Введите email и пароль',
    genericError: 'Не удалось войти',
    submitLabel: 'Войти',
    submittingLabel: 'Входим...',
  },

  tabs: [
    { key: 'overview', label: 'Обзор', icon: MdOutlineAnalytics },
    { key: 'sessions', label: 'Пользователи и сессии', icon: FaUsers },
    { key: 'settings', label: 'Настройки', icon: IoMdSettings },
  ],
  menuIcons: { open: MdMenu, close: MdClose },
  menuToggleLabel: 'Открыть/закрыть меню',

  ranges: [
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' },
    { value: '90d', label: '90 дней' },
  ],
  filters: {
    countryPlaceholder: 'Страна...',
    browserPlaceholder: 'Браузер...',
    allDevices: 'Все устройства',
    allSources: 'Все источники',
    clear: 'Сбросить',
  },

  dashboard: {
    title: 'Аналитика использования',
    loading: 'Загрузка аналитики...',
    emptyPeriod:
      'За выбранный период событий нет. Если трекер только что подключили — загляните через несколько минут.',
    cards: {
      pageviews: 'Просмотры страниц',
      sessions: 'Сессии',
      visitors: 'Посетители',
      events: 'Всего событий',
      avgSession: 'Среднее время сессии',
      bounceRate: 'Показатель отказов',
      topPages: 'Популярные страницы',
      sources: 'Источники трафика',
      geography: 'География',
      devices: 'Устройства',
      dailyActivity: 'Активность по дням',
    },
    pageviewsUnit: 'просмотров',
    sessionsUnit: 'сессий',
  },

  sessionsView: {
    title: 'Сессии пользователей',
    loading: 'Загрузка сессий...',
    totalLabel: 'Всего сессий:',
    ofLabel: 'из',
    emptyFiltered: 'Под фильтры ничего не подошло',
    backButton: 'Назад',
    backTitle: 'Назад к списку',
    detailTitle: 'Детали сессии',
    selectHint: 'Выберите сессию для просмотра деталей',
    unknownOs: 'ОС неизвестна',
    unknownBrowser: 'Неизвестно',
    notAvailable: 'N/A',
    labels: {
      browser: 'Браузер:',
      location: 'Локация:',
      source: 'Источник:',
      time: 'Время:',
      events: 'События:',
      pages: 'Страниц:',
      referrer: 'Откуда:',
      device: 'Устройство:',
      os: 'ОС:',
      country: 'Страна:',
      region: 'Регион:',
      city: 'Город:',
      entry: 'Вход:',
      exit: 'Выход:',
      duration: 'Длительность:',
      trafficSource: 'Источник трафика:',
      referrerUrl: 'URL источника:',
    },
    sections: {
      generalInfo: 'Общая информация',
      visitedPages: 'Посещенные страницы',
      events: 'События',
    },
    eventsLoading: 'Загрузка событий...',
    sourceLabels: {
      direct: 'Прямой заход',
      search: 'Поиск',
      social: 'Соцсеть',
      referral: 'Переход',
      internal: 'Внутренний переход',
      campaign: 'Кампания',
      unknown: 'Неизвестно',
    },
    deviceIcons: { mobile: CiMobile1, tablet: IoIosTabletLandscape, desktop: IoIosLaptop },
    backIcon: FaArrowLeft,
  },

  settings: {
    accountTitle: 'Аккаунт',
    logoutButton: 'Выйти',
    emailLabel: 'Email:',
    roleLabel: 'Роль:',
    roleLabels: {
      owner: 'Владелец',
      admin: 'Администратор',
      developer: 'Разработчик',
    },

    passwordSectionTitle: 'Смена пароля',
    passwordSectionDesc: 'После смены пароля все остальные сессии завершаются.',
    currentPasswordPlaceholder: 'Текущий пароль',
    newPasswordPlaceholder: 'Новый пароль',
    confirmPasswordPlaceholder: 'Повторите новый пароль',
    passwordTooShort: (minLength) => `Пароль должен быть не короче ${minLength} символов`,
    passwordMismatch: 'Пароли не совпадают',
    passwordChanged: 'Пароль изменён',
    passwordChangeFailed: 'Не удалось сменить пароль',
    savingButton: 'Сохранение...',
    saveButton: 'Сменить пароль',

    dangerSectionTitle: 'Удаление данных',
    dangerIcon: CiWarning,
    dangerIntro:
      'Через админку статистика не удаляется — это защита от случайной чистки. Старые события убираются на сервере:',
    serverCommandSummary: 'Команда для сервера',
    serverCommand:
      'docker compose exec db psql -U portfolio -d portfolio -c "delete from analytics_events where occurred_at < now() - interval \'90 days\';"',

    devClearTitle:
      'Бэкенд сейчас в dev-режиме. Локальному переходы пишутся в базу. Эта кнопка не появляется в проде',
    devClearConfirm: 'Удалить все локальные события аналитики без возможности отмены?',
    devClearButton: 'Удалить локальные данные аналитики',
    devClearingButton: 'Удаление...',
    devClearSuccess: (deleted) => `Удалено событий: ${deleted}`,
    devClearFailed: 'Не удалось удалить данные',
  },
};

export default adminData;
