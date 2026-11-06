export const THEME_STORAGE_KEY = "saved-theme";

export const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem('${THEME_STORAGE_KEY}')==='dark'){document.body.classList.add('dark-theme')}}catch(e){}})()`;
