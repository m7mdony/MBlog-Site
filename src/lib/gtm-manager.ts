// إدارة Google Tag Manager
export interface GTMSettings {
  gtmId: string;
  isEnabled: boolean;
  lastUpdated: string;
}

const GTM_STORAGE_KEY = 'mariam_bassitman_gtm_settings';

// الحصول على إعدادات GTM
export const getGTMSettings = (): GTMSettings => {
  const stored = localStorage.getItem(GTM_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // إعدادات افتراضية
  return {
    gtmId: '',
    isEnabled: false,
    lastUpdated: new Date().toISOString()
  };
};

// حفظ إعدادات GTM
export const saveGTMSettings = (settings: GTMSettings): void => {
  settings.lastUpdated = new Date().toISOString();
  localStorage.setItem(GTM_STORAGE_KEY, JSON.stringify(settings));
  
  // تحديث GTM في الصفحة
  updateGTMInPage(settings);
};

// تحديث GTM في الصفحة
export const updateGTMInPage = (settings: GTMSettings): void => {
  if (!settings.isEnabled || !settings.gtmId) {
    removeGTMFromPage();
    return;
  }

  // إزالة GTM القديم إذا كان موجوداً
  removeGTMFromPage();

  // إضافة GTM الجديد
  const head = document.head;
  
  // إضافة GTM script
  const gtmScript = document.createElement('script');
  gtmScript.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${settings.gtmId}');
  `;
  head.appendChild(gtmScript);

  // إضافة GTM noscript
  const gtmNoscript = document.createElement('noscript');
  gtmNoscript.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;
  document.body.appendChild(gtmNoscript);
};

// إزالة GTM من الصفحة
export const removeGTMFromPage = (): void => {
  // إزالة GTM scripts
  const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
  gtmScripts.forEach(script => script.remove());
  
  // إزالة GTM noscript
  const gtmNoscripts = document.querySelectorAll('noscript iframe[src*="googletagmanager.com"]');
  gtmNoscripts.forEach(noscript => noscript.parentElement?.remove());
  
  // إزالة dataLayer
  if (window.dataLayer) {
    delete window.dataLayer;
  }
};

// تهيئة GTM عند تحميل الصفحة
export const initializeGTM = (): void => {
  const settings = getGTMSettings();
  if (settings.isEnabled && settings.gtmId) {
    updateGTMInPage(settings);
  }
};

// إرسال حدث مخصص إلى GTM
export const sendGTMEvent = (eventName: string, eventData: any): void => {
  const settings = getGTMSettings();
  if (settings.isEnabled && settings.gtmId && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
}; 