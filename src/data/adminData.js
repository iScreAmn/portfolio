import {
  MdOutlineAnalytics,
  MdSpaceDashboard,
  MdLogout,
  MdOutlineEmail,
} from 'react-icons/md';
import { FaUsers, FaArrowLeft, FaPlus, FaRegTrashAlt, FaTelegram } from 'react-icons/fa';
import { FaWhatsapp, FaPhoneFlip } from 'react-icons/fa6';
import { CgWebsite } from 'react-icons/cg';
import {
  HiOutlineEye,
  HiOutlineCursorClick,
  HiOutlineUserGroup,
  HiOutlineInbox,
} from 'react-icons/hi';
import { IoIosLaptop, IoIosTabletLandscape, IoMdSettings } from 'react-icons/io';
import { CiMobile1, CiWarning } from 'react-icons/ci';

const adminData = {
  common: {
    checkingSession: 'Проверяем сессию…',
    errorPrefix: 'Ошибка:',
    retry: 'Повторить',
    noData: 'Нет данных',
    cancel: 'Отмена',
  },

  nav: {
    logoAria: 'На дашборд',
    logoAlt: 'DJ',
    open: 'Открыть меню',
    close: 'Закрыть меню',
    panelLabel: 'Разделы админки',
    sectionsTitle: 'Разделы',
    accountTitle: 'Аккаунт',
    items: [
      { href: '/admin', label: 'Дашборд', hint: 'Сводка за неделю', icon: MdSpaceDashboard },
      {
        href: '/admin/analytics',
        label: 'Аналитика',
        hint: 'Трафик и сессии',
        icon: MdOutlineAnalytics,
      },
      {
        href: '/admin/crm',
        label: 'Управление клиентами',
        hint: 'Заявки с сайта и свои',
        icon: FaUsers,
      },
      {
        href: '/',
        label: 'Вернуться на сайт',
        hint: 'Открыть djcode.ge',
        icon: CgWebsite,
      },
    ],
    account: [
      {
        href: '/admin/settings',
        label: 'Настройки',
        hint: 'Пароль и удаление данных',
        icon: IoMdSettings,
      },
    ],
    logout: { label: 'Выйти', hint: 'Завершить сессию', icon: MdLogout },
  },

  login: {
    title: 'Панель администратора',
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
  ],
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
      campaign: 'Проект',
      unknown: 'Неизвестно',
    },
    deviceIcons: { mobile: CiMobile1, tablet: IoIosTabletLandscape, desktop: IoIosLaptop },
    backIcon: FaArrowLeft,
  },

  overview: {
    title: 'Обзор',
    subtitle: 'Коротко о том, что происходило за последние 7 дней.',
    loading: 'Загрузка обзора…',
    analytics: {
      title: 'Аналитика',
      periodLabel: 'за 7 дней',
      linkLabel: 'Вся аналитика',
      loadFailed: 'Не удалось загрузить сводку',
      metrics: [
        { key: 'pageviews', label: 'Просмотры', icon: HiOutlineEye },
        { key: 'sessions', label: 'Сессии', icon: HiOutlineCursorClick },
        { key: 'visitors', label: 'Посетители', icon: HiOutlineUserGroup },
      ],
    },
    leads: {
      title: 'Новые заявки',
      countHint: 'в статусе «новая»',
      icon: HiOutlineInbox,
      linkLabel: 'Все клиенты',
      recentTitle: 'Последние обращения',
      loadFailed: 'Не удалось загрузить заявки',
      empty: 'Новых заявок нет.',
    },
    reviews: {
      title: 'Отзывы',
      tabs: [
        { status: 'pending', label: 'На модерации' },
        { status: 'approved', label: 'Опубликованные' },
      ],
      loading: 'Загрузка отзывов…',
      loadFailed: 'Не удалось загрузить отзывы',
      empty: {
        pending: 'Новых отзывов нет. Как только посетитель оставит отзыв, он появится здесь.',
        approved: 'Опубликованных отзывов пока нет.',
      },
      submittedAt: 'Получен',
      approvedAt: 'Опубликован',
      edit: 'Изменить',
      editTitle: 'Редактировать отзыв',
      nameLabel: 'Имя',
      namePlaceholder: 'Имя автора',
      nameRequired: 'Имя не может быть пустым',
      companyLabel: 'Компания',
      companyPlaceholder: 'Необязательно',
      textLabel: 'Отзыв',
      textRequired: 'Текст отзыва не может быть пустым',
      photoLabel: 'Фотография',
      logoLabel: 'Логотип компании',
      upload: 'Загрузить',
      replace: 'Заменить',
      remove: 'Убрать',
      imageFailed: 'Не получилось прочитать файл как картинку',
      imageTooLarge: 'Картинка слишком большая',
      save: 'Сохранить',
      saving: 'Сохраняем…',
      saveFailed: 'Не удалось сохранить изменения',
      approve: 'Подтвердить',
      approving: 'Публикуем…',
      approveFailed: 'Не удалось подтвердить отзыв',
      delete: 'Удалить',
      deleteModal: {
        title: 'Удалить отзыв?',
        text: (name) => `Отзыв от «${name}» удалится без возможности восстановления.`,
        confirm: 'Удалить',
        deleting: 'Удаляем…',
        failed: 'Не удалось удалить отзыв',
      },
    },
  },

  crm: {
    title: 'Управление клиентами',
    loading: 'Загрузка клиентов…',
    loadFailed: 'Не удалось загрузить клиентов',
    empty: 'Клиентов пока нет. Добавьте первого вручную или дождитесь заявки с сайта.',
    emptyFiltered: 'Под фильтр ничего не подошло.',
    totalLabel: 'Всего:',
    addButton: 'Добавить клиента',
    addIcon: FaPlus,
    deleteIcon: FaRegTrashAlt,
    filterAll: 'Все',

    columns: {
      name: 'Имя',
      contact: 'Контакт',
      status: 'Статус',
      source: 'Источник',
      created: 'Дата',
      actions: 'Действия',
    },

    statusOrder: ['new', 'in_progress', 'promotion', 'done'],
    statusLabels: {
      new: 'Новая',
      in_progress: 'В работе',
      promotion: 'Продвижение',
      done: 'Завершена',
    },
    statusAria: 'Статус клиента',
    statusUpdateFailed: 'Не удалось сменить статус',

    sourceLabels: {
      form: 'Форма',
      calculator: 'Калькулятор',
      package: 'Пакет услуг',
      manual: 'Вручную',
    },

    contactIcons: {
      Email: MdOutlineEmail,
      Telegram: FaTelegram,
      WhatsApp: FaWhatsapp,
      Phone: FaPhoneFlip,
    },
    mailtoTitle: (value) => `Написать на ${value}`,
    telTitle: (value) => `Позвонить на ${value}`,

    detailsTitle: 'Карточка клиента',
    detailsOpen: 'Открыть карточку',
    detailsClose: 'Закрыть карточку',

    dragTitle: 'Перетащить строку',
    reorderFailed: 'Не удалось сохранить порядок',

    payloadLabel: 'Детали заявки',
    payloadYes: 'Да',
    payloadNo: 'Нет',
    // У заявок на пакет со страницы /services свои поля вместо шагов
    // калькулятора — подписываем их по-человечески.
    payloadKeys: {
      package: 'Пакет',
      price: 'Цена',
      support: 'Поддержка после запуска',
    },

    editTitle: 'Данные клиента',
    nameLabel: 'Имя',
    namePlaceholder: 'Имя клиента',
    nameRequired: 'Имя не может быть пустым',
    companyLabel: 'Компания',
    companyPlaceholder: 'Например: ООО «Ромашка»',
    contactLabel: 'Контакт',
    contactPlaceholder: 'Телефон, email или @ник',
    contactRequired: 'Контакт не может быть пустым',
    messageLabel: 'Что нужно клиенту',
    messagePlaceholder: 'Коротко о задаче',

    noteLabel: 'Приватная заметка',
    noteHint: 'Видна только в админке, клиенту не уходит.',
    notePlaceholder: 'Например: перезвонить после 18:00',

    cardSave: 'Сохранить',
    cardSaving: 'Сохраняем…',
    cardSaved: 'Изменения сохранены',
    cardFailed: 'Не удалось сохранить изменения',
    cardReset: 'Отменить',

    addModal: {
      title: 'Новый клиент',
      hint: 'Запись создастся с источником «вручную» и статусом «новая».',
      namePlaceholder: 'Имя',
      companyPlaceholder: 'Компания (необязательно)',
      methodLabel: 'Способ связи',
      contactPlaceholder: 'Телефон, email или @ник',
      messagePlaceholder: 'Что нужно клиенту (необязательно)',
      notePlaceholder: 'Приватная заметка (необязательно)',
      methods: ['Telegram', 'WhatsApp', 'Email', 'Phone'],
      missingFields: 'Заполните имя и контакт',
      submit: 'Добавить',
      submitting: 'Добавляем…',
      failed: 'Не удалось добавить клиента',
    },

    deleteModal: {
      title: 'Удалить клиента?',
      text: (name) => `Клиент «${name}» и его заметка удалятся без возможности восстановления.`,
      confirm: 'Удалить',
      deleting: 'Удаляем…',
      failed: 'Не удалось удалить клиента',
    },
  },

  settings: {
    accountTitle: 'Аккаунт',
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
