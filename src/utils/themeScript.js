export const THEME_STORAGE_KEY = "saved-theme";

/**
 * Блокирующий скрипт для корневого layout: вешает `dark-theme` на body ещё до
 * первой отрисовки, иначе при SSR страница успевает моргнуть светлой темой.
 *
 * Модуль намеренно без "use client" — его читает серверный layout, а значение
 * из клиентского модуля на сервере было бы недоступно.
 */
export const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem('${THEME_STORAGE_KEY}')==='dark'){document.body.classList.add('dark-theme')}}catch(e){}})()`;
