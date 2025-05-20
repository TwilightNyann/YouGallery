"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "uk"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

// Define our translations
const translations: Translations = {
  en: {
    // Navigation
    "nav.help": "Help",
    "nav.price": "Price",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.myGallery": "My Gallery",
    "nav.logout": "Logout",
    "nav.profile": "Profile",
    "nav.settings": "Settings",

    // Home page
    "home.welcome": "Welcome to YouGallery",
    "home.subtitle":
      "Your personal photo gallery platform for storing, organizing, and sharing your precious memories.",
    "home.getStarted": "Get Started",
    "home.viewPricing": "View Pricing",
    "home.store.title": "Store",
    "home.store.description":
      "Securely store all your photos in one place. Never worry about losing your precious memories again with our reliable cloud storage.",
    "home.organize.title": "Organize",
    "home.organize.description":
      "Create custom galleries, add tags, and sort your photos however you like. Finding specific photos has never been easier.",
    "home.share.title": "Share",
    "home.share.description":
      "Share your galleries with friends and family. Control who sees what with our flexible privacy settings.",
    "home.cta.title": "Ready to get started?",
    "home.cta.description":
      "Join thousands of users who trust YouGallery with their photo collections. Sign up today and get started with our free plan.",
    "home.cta.button": "Sign Up Now",

    // Price page
    "price.title": "Choose Your Plan",
    "price.subtitle": "Select the perfect plan for your photo storage needs",
    "price.basic": "Basic",
    "price.pro": "Pro",
    "price.elite": "Elite",
    "price.month": "/month",
    "price.getStarted": "Get Started",
    "price.requestQuote": "Request a quote",

    // Help page
    "help.title": "Help Center",
    "help.subtitle": "Need assistance? We're here to help you with any questions or issues.",
    "help.contact.title": "Contact Us",
    "help.contact.email": "Email:",
    "help.contact.phone": "Phone:",
    "help.contact.hours": "Hours:",
    "help.contact.address": "Address:",
    "help.message.title": "Send a Message",
    "help.message.name": "Your Name",
    "help.message.email": "Your Email",
    "help.message.message": "Your Message",
    "help.message.send": "Send Message",
    "help.faq.title": "Frequently Asked Questions",

    // Footer
    "footer.contactUs": "Contact us:",
    "footer.subscribe": "Subscribe to news",
    "footer.rights": "© 2023 YouGallery. All Rights Reserved.",
    "footer.privacy": "Privacy Policy",

    // Auth
    "auth.login.title": "Welcome Back",
    "auth.login.subtitle": "Sign in to your YouGallery account",
    "auth.login.email": "Email",
    "auth.login.password": "Password",
    "auth.login.forgotPassword": "Forgot password?",
    "auth.login.signIn": "Sign In",
    "auth.login.withGoogle": "Sign in with Google",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.signUp": "Sign up",

    "auth.register.title": "Create Account",
    "auth.register.subtitle": "Join YouGallery today",
    "auth.register.name": "Name",
    "auth.register.email": "Email",
    "auth.register.password": "Password",
    "auth.register.confirmPassword": "Confirm Password",
    "auth.register.terms": "I agree to the",
    "auth.register.termsLink": "Terms of Service",
    "auth.register.and": "and",
    "auth.register.privacyLink": "Privacy Policy",
    "auth.register.createAccount": "Create Account",
    "auth.register.withGoogle": "Sign up with Google",
    "auth.register.haveAccount": "Already have an account?",
    "auth.register.signIn": "Sign in",

    // Gallery
    "gallery.create": "Create Gallery",
    "gallery.createNew": "Create New Gallery",
    "gallery.galleryName": "Gallery Name",
    "gallery.galleryNamePlaceholder": "Enter gallery name",
    "gallery.shootingDate": "Shooting Date",
    "gallery.nameRequired": "Gallery name is required",
    "gallery.dateRequired": "Shooting date is required",
    "gallery.cancel": "Cancel",
    "gallery.galleries": "Galleries",
    "gallery.favorites": "Favorites",
    "gallery.noFavorites": "No favorite photos yet. Mark some photos as favorites to see them here.",
    "gallery.statistics": "Statistics",
    "gallery.totalViews": "Total Views",
    "gallery.totalPhotos": "Total Photos",
    "gallery.totalShares": "Total Shares",
    "gallery.avgTime": "Avg. Time (min)",
    "gallery.galleryList": "Gallery List",
    "gallery.galleryViews": "Gallery Views",
    "gallery.numberOfPhotos": "Number of Photos",
    "gallery.galleryShares": "Gallery Shares",
    "gallery.averageViewingTime": "Average Viewing Time (minutes)",
    "gallery.views": "Views",
    "gallery.photos": "Photos",
    "gallery.shares": "Shares",
    "gallery.time": "Time",
    "gallery.sortBy": "Sort by",
    "gallery.newest": "Newest First",
    "gallery.oldest": "Oldest First",
    "gallery.name": "Name",
    "gallery.upload": "Upload",
    "gallery.edit": "Edit",
    "gallery.save": "Save Changes",
    "gallery.design": "Design",
    "gallery.designInDevelopment": "Design Feature Coming Soon",
    "gallery.designInDevelopmentMessage":
      "We're working hard to bring you powerful design tools for your galleries. Stay tuned for updates!",
    "gallery.settings": "Settings",
    "gallery.generalSettings": "General Settings",
    "gallery.generalSettingsDescription": "Basic information about your gallery",
    "gallery.privacySettings": "Privacy Settings",
    "gallery.privacySettingsDescription": "Control who can see your gallery",
    "gallery.makePublic": "Make this gallery public",
    "gallery.makePublicDescription":
      "Public galleries can be viewed by anyone with the link. Private galleries are only visible to you.",
    "gallery.dangerZone": "Danger Zone",
    "gallery.dangerZoneDescription": "Irreversible actions",
    "gallery.deleteGallery": "Delete Gallery",
    "gallery.deleteGalleryWarning": "Once you delete a gallery, there is no going back. Please be certain.",
    "gallery.addScene": "Add scene",
    "gallery.copyLink": "Copy Link to Gallery",
    "gallery.shareGallery": "Share Gallery",
    "gallery.shareLinkDescription": "Share this link with others to give them access to this gallery:",
    "gallery.ok": "OK",
    "gallery.uploadPhotos": "Upload Photos",
    "gallery.uploadPhotosDescription": "Select photos to upload to this scene.",
    "gallery.dragAndDrop": "Drag and drop files here or",
    "gallery.browseFiles": "Browse Files",
    "gallery.scenes": "Scenes",
    "gallery.noPhotos": "No Photos Yet",
    "gallery.noPhotosDescription": "This scene is empty. Upload photos to get started.",
    "gallery.uploadPhotos": "Upload Photos",
    "gallery.uploadPhotosToScene": "Select photos to upload to the current scene.",
    "gallery.dragAndDrop": "Drag and drop files here or",
    "gallery.browseFiles": "Browse Files",
    "gallery.search": "Search galleries...",
    "gallery.creationDate": "Creation Date",
    "gallery.timeSpent": "Time Spent",
    "gallery.minutes": "min",
    "gallery.noGalleriesFound": "No galleries found",
    "gallery.size": "Size",
    "gallery.uploadedPhotos": "Uploaded Photos",
    "gallery.editPhotos": "Edit Photos",
    "gallery.doneEditing": "Done Editing",
    "gallery.deletePhotoTitle": "Delete Photo",
    "gallery.deletePhotoConfirmation": "Are you sure you want to delete this photo? This action cannot be undone.",
    "gallery.delete": "Delete",
    "gallery.photoUpdated": "Photo Updated",
    "gallery.favoriteStatusChanged": "Favorite status changed successfully",
    "gallery.photoDeleted": "Photo Deleted",
    "gallery.photoDeletedDescription": "The photo has been permanently deleted",
    "gallery.uploadSuccess": "Upload Successful",
    "gallery.photosUploaded": "photos uploaded successfully",
    "gallery.viewPhoto": "View Photo",
    "gallery.addToFavorites": "Add to Favorites",
    "gallery.removeFromFavorites": "Remove from Favorites",
    "gallery.deletePhoto": "Delete Photo",
    "gallery.removedFromFavorites": "Photo removed from favorites",
    "gallery.passwordProtection": "Password Protection",
    "gallery.passwordProtectionDescription": "Set a password to restrict access to your gallery",
    "gallery.enablePasswordProtection": "Enable password protection",
    "gallery.password": "Password",
    "gallery.confirmPassword": "Confirm Password",
    "gallery.enterPassword": "Enter password",
    "gallery.confirmPasswordPlaceholder": "Confirm your password",
    "gallery.passwordRequired": "Password is required when protection is enabled",
    "gallery.passwordMismatch": "Passwords do not match",
    "gallery.settingsSaved": "Settings Saved",
    "gallery.passwordSettingsUpdated": "Password protection settings have been updated",
    "gallery.savePassword": "Save Password Settings",
    "gallery.noScenes": "No Scenes Available",
    "gallery.noScenesDescription": "You need to create at least one scene to start working with your gallery.",
    "gallery.setAsCover": "Set as Gallery Cover",
    "gallery.coverUpdated": "Gallery Cover Updated",
    "gallery.coverUpdatedDescription": "This photo has been set as the gallery cover",
    "gallery.linkCopied": "Link Copied",
    "gallery.linkCopiedDescription": "Gallery link has been copied to clipboard",
    "gallery.sceneAdded": "Scene Added",
    "gallery.sceneAddedDescription": "New scene has been added to your gallery",
    "gallery.sceneUpdated": "Scene Updated",
    "gallery.sceneUpdatedDescription": "Scene has been updated successfully",
    "gallery.sceneDeleted": "Scene Deleted",
    "gallery.sceneDeletedDescription": "Scene has been deleted from your gallery",
    "gallery.deleteSceneConfirmation":
      "Are you sure you want to delete this scene? All photos in this scene will be removed.",
    "gallery.deleteScene": "Delete Scene",
    "gallery.editScene": "Edit Scene",
    "gallery.sceneName": "Scene Name",
    "gallery.enterSceneName": "Enter scene name",
    "gallery.add": "Add",

    // User Profile
    "profile.title": "Account Settings",
    "profile.personalInfo": "Personal Information",
    "profile.name": "Name",
    "profile.email": "Email Address",
    "profile.phone": "Phone Number",
    "profile.save": "Save Changes",
    "profile.password": "Password",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm New Password",
    "profile.updatePassword": "Update Password",
    "profile.deleteAccount": "Delete Account",
    "profile.deleteWarning":
      "This action cannot be undone. This will permanently delete your account and all associated data.",
    "profile.deleteButton": "Delete Account",

    // Storage
    "storage.title": "Storage Usage",
    "storage.freePlan": "Free Plan: 5GB storage",
    "storage.almostFull": "Your storage is almost full! Upgrade your plan for more space.",
    "storage.upgrade": "Upgrade Plan",
    "storage.used": "Used",
    "storage.available": "Available",
    "storage.total": "Total",
  },
  uk: {
    // Navigation
    "nav.help": "Допомога",
    "nav.price": "Ціни",
    "nav.login": "Увійти",
    "nav.register": "Реєстрація",
    "nav.myGallery": "Моя Галерея",
    "nav.logout": "Вийти",
    "nav.profile": "Профіль",
    "nav.settings": "Налаштування",

    // Home page
    "home.welcome": "Ласкаво просимо до YouGallery",
    "home.subtitle":
      "Ваша особиста платформа фотогалереї для зберігання, організації та обміну дорогоцінними спогадами.",
    "home.getStarted": "Почати",
    "home.viewPricing": "Переглянути ціни",
    "home.store.title": "Зберігання",
    "home.store.description":
      "Надійно зберігайте всі свої фотографії в одному місці. Ніколи не турбуйтеся про втрату дорогоцінних спогадів завдяки нашому надійному хмарному сховищу.",
    "home.organize.title": "Організація",
    "home.organize.description":
      "Створюйте власні галереї, додавайте теги та сортуйте фотографії як вам зручно. Знайти потрібні фотографії ще ніколи не було так просто.",
    "home.share.title": "Поділитися",
    "home.share.description":
      "Діліться своїми галереями з друзями та родиною. Контролюйте, хто що бачить, за допомогою гнучких налаштувань конфіденційності.",
    "home.cta.title": "Готові почати?",
    "home.cta.description":
      "Приєднуйтесь до тисяч користувачів, які довіряють YouGallery свої фотоколекції. Зареєструйтеся сьогодні та почніть з нашого безкоштовного плану.",
    "home.cta.button": "Зареєструватися зараз",

    // Price page
    "price.title": "Оберіть Свій План",
    "price.subtitle": "Виберіть ідеальний план для ваших потреб зберігання фотографій",
    "price.basic": "Базовий",
    "price.pro": "Професійний",
    "price.elite": "Елітний",
    "price.month": "/місяць",
    "price.getStarted": "Почати",
    "price.requestQuote": "Запросити пропозицію",

    // Help page
    "help.title": "Центр допомоги",
    "help.subtitle": "Потрібна допомога? Ми тут, щоб допомогти вам з будь-якими питаннями чи проблемами.",
    "help.contact.title": "Зв'яжіться з нами",
    "help.contact.email": "Електронна пошта:",
    "help.contact.phone": "Телефон:",
    "help.contact.hours": "Години роботи:",
    "help.contact.address": "Адреса:",
    "help.message.title": "Надіслати повідомлення",
    "help.message.name": "Ваше ім'я",
    "help.message.email": "Ваша електронна пошта",
    "help.message.message": "Ваше повідомлення",
    "help.message.send": "Надіслати повідомлення",
    "help.faq.title": "Часті запитання",

    // Footer
    "footer.contactUs": "Зв'яжіться з нами:",
    "footer.subscribe": "Підписатися на новини",
    "footer.rights": "© 2023 YouGallery. Всі права захищені.",
    "footer.privacy": "Політика конфіденційності",

    // Auth
    "auth.login.title": "Ласкаво просимо назад",
    "auth.login.subtitle": "Увійдіть до свого облікового запису YouGallery",
    "auth.login.email": "Електронна пошта",
    "auth.login.password": "Пароль",
    "auth.login.forgotPassword": "Забули пароль?",
    "auth.login.signIn": "Увійти",
    "auth.login.withGoogle": "Увійти через Google",
    "auth.login.noAccount": "Немає облікового запису?",
    "auth.login.signUp": "Зареєструватися",

    "auth.register.title": "Створити обліковий запис",
    "auth.register.subtitle": "Приєднуйтесь до YouGallery сьогодні",
    "auth.register.name": "Ім'я",
    "auth.register.email": "Електронна пошта",
    "auth.register.password": "Пароль",
    "auth.register.confirmPassword": "Підтвердіть пароль",
    "auth.register.terms": "Я погоджуюсь з",
    "auth.register.termsLink": "Умовами обслуговування",
    "auth.register.and": "та",
    "auth.register.privacyLink": "Політикою конфіденційності",
    "auth.register.createAccount": "Створити обліковий запис",
    "auth.register.withGoogle": "Зареєструватися через Google",
    "auth.register.haveAccount": "Вже маєте обліковий запис?",
    "auth.register.signIn": "Увійти",

    // Gallery
    "gallery.create": "Створити галерею",
    "gallery.createNew": "Створити нову галерею",
    "gallery.galleryName": "Назва галереї",
    "gallery.galleryNamePlaceholder": "Введіть назву галереї",
    "gallery.shootingDate": "Дата зйомки",
    "gallery.nameRequired": "Назва галереї обов'язкова",
    "gallery.dateRequired": "Дата зйомки обов'язкова",
    "gallery.cancel": "Скасувати",
    "gallery.galleries": "Галереї",
    "gallery.favorites": "Улюблені",
    "gallery.noFavorites":
      "Поки немає улюблених фотографій. Позначте деякі фотографії як улюблені, щоб побачити їх тут.",
    "gallery.statistics": "Статистика",
    "gallery.totalViews": "Загальні перегляди",
    "gallery.totalPhotos": "Загальна кількість фото",
    "gallery.totalShares": "Загальні поширення",
    "gallery.avgTime": "Сер. час (хв)",
    "gallery.galleryList": "Список галерей",
    "gallery.galleryViews": "Перегляди галереї",
    "gallery.numberOfPhotos": "Кількість фотографій",
    "gallery.galleryShares": "Поширення галереї",
    "gallery.averageViewingTime": "Середній час перегляду (хвилини)",
    "gallery.views": "Перегляди",
    "gallery.photos": "Фото",
    "gallery.shares": "Поширення",
    "gallery.time": "Час",
    "gallery.sortBy": "Сортувати за",
    "gallery.newest": "Спочатку нові",
    "gallery.oldest": "Спочатку старі",
    "gallery.name": "Назва",
    "gallery.upload": "Завантажити",
    "gallery.edit": "Редагувати",
    "gallery.save": "Зберегти зміни",
    "gallery.design": "Дизайн",
    "gallery.designInDevelopment": "Функція дизайну скоро з'явиться",
    "gallery.designInDevelopmentMessage":
      "Ми наполегливо працюємо, щоб надати вам потужні інструменти дизайну для ваших галерей. Слідкуйте за оновленнями!",
    "gallery.settings": "Налаштування",
    "gallery.generalSettings": "Загальні налаштування",
    "gallery.generalSettingsDescription": "Основна інформація про вашу галерею",
    "gallery.privacySettings": "Налаштування конфіденційності",
    "gallery.privacySettingsDescription": "Контролюйте, хто може бачити вашу галерею",
    "gallery.makePublic": "Зробити цю галерею публічною",
    "gallery.makePublicDescription":
      "Публічні галереї можуть переглядати всі, хто має посилання. Приватні галереї видно лише вам.",
    "gallery.dangerZone": "Небезпечна зона",
    "gallery.dangerZoneDescription": "Незворотні дії",
    "gallery.deleteGallery": "Видалити галерею",
    "gallery.deleteGalleryWarning": "Після видалення галереї повернути її неможливо. Будь ласка, будьте впевнені.",
    "gallery.addScene": "Додати сцену",
    "gallery.copyLink": "Копіювати посилання на галерею",
    "gallery.shareGallery": "Поділитися галереєю",
    "gallery.shareLinkDescription": "Поділіться цим посиланням з іншими, щоб надати їм доступ до цієї галереї:",
    "gallery.ok": "OK",
    "gallery.uploadPhotos": "Завантажити фотографії",
    "gallery.uploadPhotosDescription": "Виберіть фотографії для завантаження в цю сцену.",
    "gallery.dragAndDrop": "Перетягніть файли сюди або",
    "gallery.browseFiles": "Вибрати файли",
    "gallery.scenes": "Сцени",
    "gallery.noPhotos": "Ще немає фотографій",
    "gallery.noPhotosDescription": "Ця сцена порожня. Завантажте фотографії, щоб почати.",
    "gallery.uploadPhotos": "Завантажити фотографії",
    "gallery.uploadPhotosToScene": "Виберіть фотографії для завантаження в поточну сцену.",
    "gallery.dragAndDrop": "Перетягніть файли сюди або",
    "gallery.browseFiles": "Вибрати файли",
    "gallery.search": "Пошук галерей...",
    "gallery.creationDate": "Дата створення",
    "gallery.timeSpent": "Витрачений час",
    "gallery.minutes": "хв",
    "gallery.noGalleriesFound": "Галереї не знайдено",
    "gallery.size": "Розмір",
    "gallery.uploadedPhotos": "Завантажені фото",
    "gallery.editPhotos": "Редагувати фото",
    "gallery.doneEditing": "Завершити редагування",
    "gallery.deletePhotoTitle": "Видалити фото",
    "gallery.deletePhotoConfirmation": "Ви впевнені, що хочете видалити це фото? Цю дію неможливо скасувати.",
    "gallery.delete": "Видалити",
    "gallery.photoUpdated": "Фото оновлено",
    "gallery.favoriteStatusChanged": "Статус улюбленого успішно змінено",
    "gallery.photoDeleted": "Фото видалено",
    "gallery.photoDeletedDescription": "Фото було назавжди видалено",
    "gallery.uploadSuccess": "Завантаження успішне",
    "gallery.photosUploaded": "фото успішно завантажено",
    "gallery.viewPhoto": "Переглянути фото",
    "gallery.addToFavorites": "Додати до улюблених",
    "gallery.removeFromFavorites": "Видалити з улюблених",
    "gallery.deletePhoto": "Видалити фото",
    "gallery.removedFromFavorites": "Фото видалено з улюблених",
    "gallery.passwordProtection": "Захист паролем",
    "gallery.passwordProtectionDescription": "Встановіть пароль для обмеження доступу до вашої галереї",
    "gallery.enablePasswordProtection": "Увімкнути захист паролем",
    "gallery.password": "Пароль",
    "gallery.confirmPassword": "Підтвердіть пароль",
    "gallery.enterPassword": "Введіть пароль",
    "gallery.confirmPasswordPlaceholder": "Підтвердіть ваш пароль",
    "gallery.passwordRequired": "Пароль обов'язковий, коли захист увімкнено",
    "gallery.passwordMismatch": "Паролі не співпадають",
    "gallery.settingsSaved": "Налаштування збережено",
    "gallery.passwordSettingsUpdated": "Налаштування захисту паролем оновлено",
    "gallery.savePassword": "Зберегти налаштування пароля",
    "gallery.noScenes": "Немає доступних сцен",
    "gallery.noScenesDescription": "Вам потрібно створити хоча б одну сцену, щоб почати роботу з галереєю.",
    "gallery.setAsCover": "Встановити як обкладинку галереї",
    "gallery.coverUpdated": "Обкладинку галереї оновлено",
    "gallery.coverUpdatedDescription": "Це фото встановлено як обкладинку галереї",
    "gallery.linkCopied": "Посилання скопійовано",
    "gallery.linkCopiedDescription": "Посилання на галерею скопійовано в буфер обміну",
    "gallery.sceneAdded": "Сцену додано",
    "gallery.sceneAddedDescription": "Нову сцену додано до вашої галереї",
    "gallery.sceneUpdated": "Сцену оновлено",
    "gallery.sceneUpdatedDescription": "Сцену успішно оновлено",
    "gallery.sceneDeleted": "Сцену видалено",
    "gallery.sceneDeletedDescription": "Сцену видалено з вашої галереї",
    "gallery.deleteSceneConfirmation":
      "Ви впевнені, що хочете видалити цю сцену? Усі фотографії в цій сцені будуть видалені.",
    "gallery.deleteScene": "Видалити сцену",
    "gallery.editScene": "Редагувати сцену",
    "gallery.sceneName": "Назва сцени",
    "gallery.enterSceneName": "Введіть назву сцени",
    "gallery.add": "Додати",

    // User Profile
    "profile.title": "Налаштування облікового запису",
    "profile.personalInfo": "Особиста інформація",
    "profile.name": "Ім'я",
    "profile.email": "Електронна адреса",
    "profile.phone": "Номер телефону",
    "profile.save": "Зберегти зміни",
    "profile.password": "Пароль",
    "profile.currentPassword": "Поточний пароль",
    "profile.newPassword": "Новий пароль",
    "profile.confirmPassword": "Підтвердіть новий пароль",
    "profile.updatePassword": "Оновити пароль",
    "profile.deleteAccount": "Видалити обліковий запис",
    "profile.deleteWarning":
      "Цю дію неможливо скасувати. Це назавжди видалить ваш обліковий запис та всі пов'язані дані.",
    "profile.deleteButton": "Видалити обліковий запис",

    // Storage
    "storage.title": "Використання сховища",
    "storage.freePlan": "Безкоштовний план: 5ГБ сховища",
    "storage.almostFull": "Ваше сховище майже заповнене! Оновіть свій план для отримання більшого простору.",
    "storage.upgrade": "Оновити план",
    "storage.used": "Використано",
    "storage.available": "Доступно",
    "storage.total": "Всього",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on client side
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "uk")) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.error("Failed to load language from localStorage:", error)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("language", language)
    } catch (error) {
      console.error("Failed to save language to localStorage:", error)
    }
  }, [language])

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
