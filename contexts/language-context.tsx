"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "uk"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Site branding
    "site.title": "YouGallery",
    "site.description": "Professional photo gallery platform",

    // Navigation
    "nav.home": "Home",
    "nav.galleries": "Galleries",
    "nav.help": "Help",
    "nav.price": "Pricing",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.profile": "Profile",
    "nav.myGallery": "My Gallery",

    // Language switcher
    "language.switch": "Switch language",
    "language.english": "English",
    "language.ukrainian": "Українська",

    // Home page
    "home.welcome": "Welcome to YouGallery",
    "home.subtitle": "Create, organize, and share your photo galleries with ease",
    "home.store.title": "Store Your Memories",
    "home.store.description": "Securely upload and store thousands of photos with unlimited cloud storage",
    "home.organize.title": "Organize Effortlessly",
    "home.organize.description": "Create custom galleries, add tags, and organize your photos the way you want",
    "home.share.title": "Share Beautifully",
    "home.share.description": "Share your galleries with friends and family through beautiful, customizable links",
    "home.cta.title": "Start Your Gallery Today",
    "home.cta.description": "Join thousands of users who trust YouGallery with their precious memories",
    "home.cta.button": "Get Started Free",

    // Price page
    "price.title": "Choose Your Plan",
    "price.subtitle": "Select the perfect plan for your photo storage needs",
    "price.basic": "Basic",
    "price.pro": "Pro",
    "price.elite": "Elite",
    "price.month": "/month",
    "price.getStarted": "Get Started",
    "price.requestQuote": "Request a quote",

    // Pricing features
    "pricing.basic.features.galleries": "Up to 10 galleries",
    "pricing.basic.features.organization": "Basic photo organization",
    "pricing.basic.features.quality": "Standard image quality",
    "pricing.basic.features.support": "Email support",
    "pricing.basic.features.mobile": "Mobile access",
    "pricing.basic.features.scenes": "Scene management",

    "pricing.pro.features.galleries": "Up to 50 galleries",
    "pricing.pro.features.organization": "Advanced photo organization",
    "pricing.pro.features.quality": "High image quality",
    "pricing.pro.features.support": "Priority email support",
    "pricing.pro.features.mobile": "Mobile access",
    "pricing.pro.features.themes": "Custom gallery themes",
    "pricing.pro.features.password": "Password-protected galleries",
    "pricing.pro.features.scenes": "Unlimited scenes",

    "pricing.elite.features.galleries": "Unlimited galleries",
    "pricing.elite.features.organization": "Professional photo organization",
    "pricing.elite.features.quality": "Original image quality",
    "pricing.elite.features.support": "Priority support",
    "pricing.elite.features.mobile": "Mobile access",
    "pricing.elite.features.themes": "Custom gallery themes",
    "pricing.elite.features.password": "Password-protected galleries",
    "pricing.elite.features.domain": "Custom domain name",
    "pricing.elite.features.analytics": "Analytics and insights",
    "pricing.elite.features.collaboration": "Collaborative editing",

    // Help page
    "help.title": "Help Center",
    "help.subtitle": "Need assistance? We're here to help you with any questions or issues.",
    "help.contact.title": "Contact Us",
    "help.contact.email": "Email:",
    "help.contact.phone": "Phone:",
    "help.contact.hours": "Hours:",
    "help.contact.address": "Address:",
    "help.contact.emailValue": "support@yougallery.com",
    "help.contact.phoneValue": "555-567-8901",
    "help.contact.hoursValue": "Monday - Friday, 9:00 - 17:00 EST",
    "help.contact.addressValue": "83a, Yuliana Matviychuk Street, Poltava",
    "help.contact.author":"Author",
    "help.contact.name":"Yudin Yurii Olegovich",
    "help.message.title": "Send a Message",
    "help.message.name": "Your Name",
    "help.message.email": "Your Email",
    "help.message.message": "Your Message",
    "help.message.send": "Send Message",
    "help.faq.title": "Frequently Asked Questions",
    "help.faq.question1": "How to create a gallery?",
    "help.faq.answer1":
      "To create a gallery, log into your account, go to the 'My Galleries' page and click the 'Create New Gallery' button. Follow the instructions to set up your gallery.",
    "help.faq.question2": "How to upload photos?",
    "help.faq.answer2":
      "In your gallery, click the 'Upload Photo' button or drag and drop files directly into the upload area. JPG, PNG and GIF formats are supported.",
    "help.faq.question3": "Can I make the gallery private?",
    "help.faq.answer3":
      "Yes, you can configure the gallery's privacy in the settings. You can make it public, private, or password protected.",
    "help.faq.question4": "What tariff plans are available?",
    "help.faq.answer4":
      "We offer three plans: Basic (free), Pro ($9.99/month) and Elite ($19.99/month). Each plan has different limits on the number of galleries and storage.",

    // Footer
    "footer.contactUs": "Contact us:",
    "footer.subscribe": "Subscribe to news",
    "footer.rights": "© 2023 YouGallery. All Rights Reserved.",
    "footer.privacy": "Privacy Policy",

    // Privacy Policy
    "privacy.title": "Privacy Policy",
    "privacy.lastUpdated": "Last Updated:",
    "privacy.lastUpdatedDate": "May 14, 2024",
    "privacy.section1.title": "1. Introduction",
    "privacy.section1.content":
      "Welcome to YouGallery. We respect your privacy and are committed to protecting your personal data. This privacy policy informs you about how we handle your personal data when you visit our website and tells you about your privacy rights and how the law protects you.",
    "privacy.section2.title": "2. The data we collect about you",
    "privacy.section2.intro":
      "Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).",
    "privacy.section2.description":
      "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:",
    "privacy.section2.identity": "includes first name, last name, username or similar identifier.",
    "privacy.section2.contact": "includes email address and telephone numbers.",
    "privacy.section2.technical":
      "includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.",
    "privacy.section2.profile":
      "includes your username and password, your interests, preferences, feedback and survey responses.",
    "privacy.section2.usage": "includes information about how you use our website, products and services.",
    "privacy.section2.content": "includes photos, videos and other media files that you upload to our service.",
    "privacy.section3.title": "3. How we use your personal data",
    "privacy.section3.intro":
      "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:",
    "privacy.section3.contract":
      "Where we need to perform a contract we are about to enter into or have entered into with you.",
    "privacy.section3.interests":
      "Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.",
    "privacy.section3.legal": "Where we need to comply with a legal obligation.",
    "privacy.section3.consent":
      "Generally we do not rely on consent as a legal basis for processing your personal data although we will get your consent before sending third party direct marketing communications to you via email or text message.",
    "privacy.section4.title": "4. Data security",
    "privacy.section4.content":
      "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.",
    "privacy.section5.title": "5. Data retention",
    "privacy.section5.content":
      "We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.",
    "privacy.section6.title": "6. Your legal rights",
    "privacy.section6.intro":
      "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:",
    "privacy.section6.access": "Request access to your personal data.",
    "privacy.section6.correction": "Request correction of your personal data.",
    "privacy.section6.erasure": "Request erasure of your personal data.",
    "privacy.section6.object": "Object to processing of your personal data.",
    "privacy.section6.restriction": "Request restriction of processing your personal data.",
    "privacy.section6.transfer": "Request transfer of your personal data.",
    "privacy.section6.withdraw": "Right to withdraw consent.",
    "privacy.section6.contact": "If you wish to exercise any of the rights set out above, please contact us.",
    "privacy.section7.title": "7. Third-party links",
    "privacy.section7.content":
      "This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.",
    "privacy.section8.title": "8. Cookies",
    "privacy.section8.content":
      "You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.",
    "privacy.section9.title": "9. Changes to the privacy policy",
    "privacy.section9.content":
      "We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the 'Last Updated' date at the top of this privacy policy.",
    "privacy.section10.title": "10. Contact us",
    "privacy.section10.intro":
      "If you have any questions about this privacy policy or our privacy practices, please contact us:",
    "privacy.section10.email": "privacy@yougallery.com",
    "privacy.section10.phone": "555-567-8901",
    "privacy.section10.address": "1234 Gallery St, 83a, Yuliana Matviychuk Street, Poltava, Image State 12345",
    "privacy.dataCollection": "Identification data",
    "privacy.contact": "Contact details",

    // Common UI
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.upload": "Upload",
    "common.download": "Download",
    "common.share": "Share",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",
    "common.view": "View",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.name": "Full Name",
    "auth.phone": "Phone Number",
    "auth.forgotPassword": "Forgot Password?",
    "auth.rememberMe": "Remember me",
    "auth.loginButton": "Sign In",
    "auth.registerButton": "Create Account",
    "auth.haveAccount": "Already have an account?",
    "auth.noAccount": "Don't have an account?",

    // Auth - додаткові переклади для Login/Register
    "auth.login.title": "Sign In",
    "auth.login.subtitle": "Enter your credentials to access your account",
    "auth.login.email": "Email",
    "auth.login.password": "Password",
    "auth.login.forgotPassword": "Forgot Password?",
    "auth.login.signIn": "Sign In",
    "auth.login.withGoogle": "Continue with Google",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.signUp": "Sign up",

    "auth.register.title": "Create Account",
    "auth.register.subtitle": "Enter your information to create your account",
    "auth.register.name": "Full Name",
    "auth.register.email": "Email",
    "auth.register.password": "Password",
    "auth.register.confirmPassword": "Confirm Password",
    "auth.register.createAccount": "Create Account",
    "auth.register.haveAccount": "Already have an account?",
    "auth.register.signIn": "Sign in",

    // Gallery editing and management
    "gallery.save": "Save",
    "gallery.cancel": "Cancel",
    "gallery.delete": "Delete",
    "gallery.edit": "Edit",
    "gallery.upload": "Upload",
    "gallery.uploadPhotos": "Upload Photos",
    "gallery.selectFiles": "Select Files",
    "gallery.browseFiles": "Browse Files",
    "gallery.dragAndDrop": "Drag and drop files here or click to browse",
    "gallery.selectedFiles": "Selected Files",
    "gallery.clearAll": "Clear All",
    "gallery.uploading": "Uploading...",
    "gallery.uploadComplete": "Upload Complete",
    "gallery.photosUploaded": "photos uploaded successfully",

    // Sorting and display
    "gallery.sortBy": "Sort by",
    "gallery.newest": "Newest",
    "gallery.oldest": "Oldest",
    "gallery.name": "Name",
    "gallery.showNames": "Show Names",

    // Photo actions
    "gallery.setAsCover": "Set as Cover",
    "gallery.removeFromFavorites": "Remove from Favorites",
    "gallery.addToFavorites": "Add to Favorites",
    "gallery.deletePhoto": "Delete Photo",
    "gallery.photoDeleted": "Photo Deleted",
    "gallery.photoDeletedDescription": "Photo has been deleted successfully",
    "gallery.coverUpdated": "Cover Updated",
    "gallery.coverUpdatedDescription": "Photo has been set as gallery cover",
    "gallery.photoUpdated": "Photo Updated",
    "gallery.removedFromFavorites": "Removed from favorites",

    // Error messages
    "gallery.error": "Error",
    "gallery.errorLoadingData": "Failed to load data",
    "gallery.errorUpdatingFavorite": "Failed to update favorite",
    "gallery.errorDeletingPhoto": "Failed to delete photo",
    "gallery.errorSettingCover": "Failed to set cover photo",

    // Empty states
    "gallery.noPhotos": "No photos",
    "gallery.noFavorites": "No favorite photos yet",
    "gallery.selectScene": "Select a scene to view photos",

    // Gallery management
    "gallery.gallerySettings": "Gallery Settings",
    "gallery.galleryName": "Gallery Name",
    "gallery.shootingDate": "Shooting Date",
    "gallery.isPublic": "Public Gallery",
    "gallery.isPasswordProtected": "Password Protected",
    "gallery.password": "Password",
    "gallery.confirmPassword": "Confirm Password",
    "gallery.saveSettings": "Save Settings",
    "gallery.deleteGallery": "Delete Gallery",
    "gallery.deleteGalleryConfirmation": "Are you sure you want to delete this gallery? This action cannot be undone.",
    "gallery.galleryDeleted": "Gallery deleted successfully",
    "gallery.settingsUpdated": "Settings updated successfully",

    // Gallery sidebar and scenes
    "gallery.scenes": "Scenes",
    "gallery.addScene": "Add Scene",
    "gallery.favorites": "Favorites",
    "gallery.design": "Design",
    "gallery.settings": "Settings",
    "gallery.copyLink": "Copy Link",
    "gallery.shareGallery": "Share Gallery",
    "gallery.shareLinkDescription": "Share this gallery with others using the link below",
    "gallery.ok": "OK",
    "gallery.deleteScene": "Delete Scene",
    "gallery.deleteSceneConfirmation": "Are you sure you want to delete this scene?",

    // Profile settings
    "profile.title": "Profile Settings",
    "profile.personalInfo": "Personal Information",
    "profile.personalInfoDescription": "Update your personal information",
    "profile.name": "Name",
    "profile.email": "Email",
    "profile.phone": "Phone",
    "profile.emailChangeNote": "Contact support to change your email address",
    "profile.save": "Save Changes",
    "profile.saving": "Saving...",
    "profile.profileUpdateSuccess": "Profile updated successfully",
    "profile.profileUpdateError": "Failed to update profile",

    // Password section
    "profile.password": "Password",
    "profile.passwordDescription": "Change your account password",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm New Password",
    "profile.updatePassword": "Update Password",
    "profile.updating": "Updating...",
    "profile.passwordUpdateSuccess": "Password updated successfully",
    "profile.passwordUpdateError": "Failed to update password",
    "profile.passwordsDontMatch": "Passwords don't match",
    "profile.fillAllFields": "Please fill in all fields",

    // Account deletion
    "profile.deleteAccount": "Delete Account",
    "profile.deleteWarning": "This action is permanent and cannot be undone",
    "profile.deleteButton": "Delete Account",
    "profile.confirmDeleteTitle": "Confirm Account Deletion",
    "profile.confirmDeleteDescription":
      "Are you sure you want to delete your account? All your data will be permanently removed.",
    "profile.cancel": "Cancel",
    "profile.deleteButtonConfirm": "Delete Account",
    "profile.deleting": "Deleting...",
    "profile.accountDeleteSuccess": "Account deleted successfully",
    "profile.accountDeleteError": "Failed to delete account",

    // Galleries
    "galleries.title": "My Galleries",
    "galleries.create": "Create Gallery",
    "galleries.empty": "No galleries yet",
    "galleries.emptyDescription": "Create your first gallery to get started",
  },
  uk: {
    // Site branding
    "site.title": "YouGallery",
    "site.description": "Професійна платформа фотогалерей",

    // Navigation
    "nav.home": "Головна",
    "nav.galleries": "Галереї",
    "nav.help": "Допомога",
    "nav.price": "Тарифи",
    "nav.login": "Вхід",
    "nav.register": "Реєстрація",
    "nav.settings": "Налаштування",
    "nav.logout": "Вихід",
    "nav.profile": "Профіль",
    "nav.myGallery": "Моя Галерея",

    // Language switcher
    "language.switch": "Змінити мову",
    "language.english": "English",
    "language.ukrainian": "Українська",

    // Home page
    "home.welcome": "Ласкаво просимо до YouGallery",
    "home.subtitle": "Створюйте, організовуйте та діліться своїми фотогалереями з легкістю",
    "home.store.title": "Зберігайте Спогади",
    "home.store.description": "Безпечно завантажуйте та зберігайте тисячі фотографій з необмеженим хмарним сховищем",
    "home.organize.title": "Організовуйте Легко",
    "home.organize.description": "Створюйте власні галереї, додавайте теги та організовуйте фото так, як вам зручно",
    "home.share.title": "Діліться Красиво",
    "home.share.description": "Діліться галереями з друзями та родиною через красиві, налаштовувані посилання",
    "home.cta.title": "Почніть Свою Галерею Сьогодні",
    "home.cta.description": "Приєднуйтесь до тисяч користувачів, які довіряють YouGallery свої дорогоцінні спогади",
    "home.cta.button": "Почати Безкоштовно",

    // Price page
    "price.title": "Оберіть Свій План",
    "price.subtitle": "Виберіть ідеальний план для ваших потреб зберігання фото",
    "price.basic": "Базовий",
    "price.pro": "Професійний",
    "price.elite": "Елітний",
    "price.month": "/місяць",
    "price.getStarted": "Почати",
    "price.requestQuote": "Запросити пропозицію",

    // Pricing features
    "pricing.basic.features.galleries": "До 10 галерей",
    "pricing.basic.features.organization": "Базова організація фото",
    "pricing.basic.features.quality": "Стандартна якість зображень",
    "pricing.basic.features.support": "Підтримка електронною поштою",
    "pricing.basic.features.mobile": "Мобільний доступ",
    "pricing.basic.features.scenes": "Управління сценами",

    "pricing.pro.features.galleries": "До 50 галерей",
    "pricing.pro.features.organization": "Розширена організація фото",
    "pricing.pro.features.quality": "Висока якість зображень",
    "pricing.pro.features.support": "Пріоритетна підтримка електронною поштою",
    "pricing.pro.features.mobile": "Мобільний доступ",
    "pricing.pro.features.themes": "Власні теми галерей",
    "pricing.pro.features.password": "Галереї, захищені паролем",
    "pricing.pro.features.scenes": "Необмежені сцени",

    "pricing.elite.features.galleries": "Необмежені галереї",
    "pricing.elite.features.organization": "Професійна організація фото",
    "pricing.elite.features.quality": "Оригінальна якість зображень",
    "pricing.elite.features.support": "Пріоритетна підтримка",
    "pricing.elite.features.mobile": "Мобільний доступ",
    "pricing.elite.features.themes": "Власні теми галерей",
    "pricing.elite.features.password": "Галереї, захищені паролем",
    "pricing.elite.features.domain": "Власне доменне ім'я",
    "pricing.elite.features.analytics": "Аналітика та статистика",
    "pricing.elite.features.collaboration": "Спільне редагування",

    // Help page
    "help.title": "Центр Допомоги",
    "help.subtitle": "Потрібна допомога? Ми тут, щоб допомогти вам з будь-якими питаннями чи проблемами.",
    "help.contact.title": "Зв'яжіться з нами",
    "help.contact.email": "Електронна пошта:",
    "help.contact.phone": "Телефон:",
    "help.contact.hours": "Години роботи:",
    "help.contact.address": "Адреса:",
    "help.contact.emailValue": "support@yougallery.com",
    "help.contact.phoneValue": "555-567-8901",
    "help.contact.hoursValue": "Понеділок - П'ятниця, 9:00 - 17:00 EST",
    "help.contact.addressValue": "вулиця Юліана Матвійчука, 83а, Полтава",
    "help.contact.author":"Автор",
    "help.contact.name":"Юдін Юрій Олегович",
    "help.message.title": "Надіслати повідомлення",
    "help.message.name": "Ваше ім'я",
    "help.message.email": "Ваша електронна пошта",
    "help.message.message": "Ваше повідомлення",
    "help.message.send": "Надіслати повідомлення",
    "help.faq.title": "Часті Запитання",
    "help.faq.question1": "Як створити галерею?",
    "help.faq.answer1":
      "Щоб створити галерею, увійдіть у свій обліковий запис, перейдіть на сторінку 'Мої галереї' та натисніть кнопку 'Створити нову галерею'. Слідуйте інструкціям для налаштування вашої галереї.",
    "help.faq.question2": "Як завантажити фотографії?",
    "help.faq.answer2":
      "У вашій галереї натисніть кнопку 'Завантажити фото' або перетягніть файли прямо в область завантаження. Підтримуються формати JPG, PNG та GIF.",
    "help.faq.question3": "Чи можу я зробити галерею приватною?",
    "help.faq.answer3":
      "Так, ви можете налаштувати приватність галереї в налаштуваннях. Ви можете зробити її публічною, приватною або захищеною паролем.",
    "help.faq.question4": "Які тарифні плани доступні?",
    "help.faq.answer4":
      "Ми пропонуємо три плани: Basic (безкоштовний), Pro (9.99$/місяць) та Elite (19.99$/місяць). Кожен план має різні обмеження на кількість галерей та сховище.",

    // Footer
    "footer.contactUs": "Зв'яжіться з нами:",
    "footer.subscribe": "Підписатися на новини",
    "footer.rights": "© 2025 YouGallery. Всі права захищені.",
    "footer.privacy": "Політика конфіденційності",

    // Privacy Policy
    "privacy.title": "Політика Конфіденційності",
    "privacy.lastUpdated": "Останнє оновлення:",
    "privacy.lastUpdatedDate": "14 травня 2025 року",
    "privacy.section1.title": "1. Вступ",
    "privacy.section1.content":
      "Ласкаво просимо до YouGallery. Ми поважаємо вашу приватність і зобов'язуємося захищати ваші персональні дані. Ця політика конфіденційності інформує вас про те, як ми обробляємо ваші персональні дані під час відвідування нашого веб-сайту, і розповідає про ваші права на приватність та як закон захищає вас.",
    "privacy.section2.title": "2. Дані, які ми збираємо про вас",
    "privacy.section2.intro":
      "Персональні дані або персональна інформація означає будь-яку інформацію про особу, за якою цю особу можна ідентифікувати. Це не включає дані, де особу було деідентифіковано (анонімні дані).",
    "privacy.section2.description":
      "Ми можемо збирати, використовувати, зберігати та передавати різні види персональних даних про вас, які ми згрупували наступним чином:",
    "privacy.section2.identity": "включає ім'я, прізвище, ім'я користувача або подібний ідентифікатор.",
    "privacy.section2.contact": "включає електронну адресу та номери телефонів.",
    "privacy.section2.technical":
      "включає IP-адресу, дані входу, тип і версію браузера, налаштування часового поясу та місцезнаходження, типи та версії плагінів браузера, операційну систему та платформу.",
    "privacy.section2.profile":
      "включає ваше ім'я користувача та пароль, ваші інтереси, уподобання, відгуки та відповіді на опитування.",
    "privacy.section2.usage": "включає інформацію про те, як ви використовуєте наш веб-сайт, продукти та послуги.",
    "privacy.section2.content": "включає фотографії, відео та інші медіафайли, які ви завантажуєте в наш сервіс.",
    "privacy.section3.title": "3. Як ми використовуємо ваші персональні дані",
    "privacy.section3.intro":
      "Ми будемо використовувати ваші персональні дані лише тоді, коли закон дозволяє нам це робити. Найчастіше ми будемо використовувати ваші персональні дані в наступних обставинах:",
    "privacy.section3.contract": "Коли нам потрібно виконати договір, який ми збираємося укласти або уклали з вами.",
    "privacy.section3.interests":
      "Коли це необхідно для наших законних інтересів (або інтересів третьої сторони), і ваші інтереси та основні права не переважають ці інтереси.",
    "privacy.section3.legal": "Коли нам потрібно дотримуватися правового зобов'язання.",
    "privacy.section3.consent":
      "Зазвичай ми не покладаємося на згоду як правову основу для обробки ваших персональних даних, хоча ми отримаємо вашу згоду перед надсиланням вам маркетингових повідомлень від третіх сторін електронною поштою або текстовими повідомленнями.",
    "privacy.section4.title": "4. Безпека даних",
    "privacy.section4.content":
      "Ми впровадили відповідні заходи безпеки для запобігання випадковій втраті, використанню або несанкціонованому доступу, зміні або розкриттю ваших персональних даних. Крім того, ми обмежуємо доступ до ваших персональних даних тим співробітникам, агентам, підрядникам та іншим третім сторонам, які мають ділову потребу знати.",
    "privacy.section5.title": "5. Зберігання даних",
    "privacy.section5.content":
      "Ми будемо зберігати ваші персональні дані лише стільки, скільки це розумно необхідно для виконання цілей, для яких ми їх зібрали, включаючи цілі задоволення будь-яких правових, регулятивних, податкових, облікових або звітних вимог.",
    "privacy.section6.title": "6. Ваші законні права",
    "privacy.section6.intro":
      "За певних обставин у вас є права згідно з законами про захист даних стосовно ваших персональних даних, включаючи право:",
    "privacy.section6.access": "Запросити доступ до ваших персональних даних.",
    "privacy.section6.correction": "Запросити виправлення ваших персональних даних.",
    "privacy.section6.erasure": "Запросити видалення ваших персональних даних.",
    "privacy.section6.object": "Заперечити проти обробки ваших персональних даних.",
    "privacy.section6.restriction": "Запросити обмеження обробки ваших персональних даних.",
    "privacy.section6.transfer": "Запросити передачу ваших персональних даних.",
    "privacy.section6.withdraw": "Право відкликати згоду.",
    "privacy.section6.contact":
      "Якщо ви бажаєте скористатися будь-яким із прав, викладених вище, будь ласка, зв'яжіться з нами.",
    "privacy.section7.title": "7. Посилання третіх сторін",
    "privacy.section7.content":
      "Цей веб-сайт може містити посилання на веб-сайти третіх сторін, плагіни та додатки. Натискання на ці посилання або увімкнення цих з'єднань може дозволити третім сторонам збирати або ділитися даними про вас. Ми не контролюємо ці веб-сайти третіх сторін і не несемо відповідальності за їхні заяви про конфіденційність.",
    "privacy.section8.title": "8. Файли cookie",
    "privacy.section8.content":
      "Ви можете налаштувати свій браузер на відхилення всіх або деяких файлів cookie браузера або на попередження, коли веб-сайти встановлюють або отримують доступ до файлів cookie. Якщо ви вимкнете або відхилите файли cookie, зверніть увагу, що деякі частини цього веб-сайту можуть стати недоступними або не функціонувати належним чином.",
    "privacy.section9.title": "9. Зміни в політиці конфіденційності",
    "privacy.section9.content":
      "Ми можемо час від часу оновлювати нашу політику конфіденційності. Ми повідомимо вас про будь-які зміни, розмістивши нову політику конфіденційності на цій сторінці та оновивши дату 'Останнє оновлення' у верхній частині цієї політики конфіденційності.",
    "privacy.section10.title": "10. Зв'яжіться з нами",
    "privacy.section10.intro":
      "Якщо у вас є запитання щодо цієї політики конфіденційності або наших практик конфіденційності, будь ласка, зв'яжіться з нами:",
    "privacy.section10.email": "privacy@yougallery.com",
    "privacy.section10.phone": "555-567-8901",
    "privacy.section10.address": "83a, Yuliana Matviychuk Street, Poltava",
    "privacy.dataCollection": "Дані ідентифікації",
    "privacy.contact": "Контактні дані",

    // Common UI
    "common.loading": "Завантаження...",
    "common.error": "Помилка",
    "common.success": "Успішно",
    "common.cancel": "Скасувати",
    "common.save": "Зберегти",
    "common.delete": "Видалити",
    "common.edit": "Редагувати",
    "common.create": "Створити",
    "common.upload": "Завантажити",
    "common.download": "Скачати",
    "common.share": "Поділитися",
    "common.back": "Назад",
    "common.next": "Далі",
    "common.previous": "Попередній",
    "common.close": "Закрити",
    "common.confirm": "Підтвердити",
    "common.yes": "Так",
    "common.no": "Ні",
    "common.view": "Переглянути",

    // Auth
    "auth.login": "Вхід",
    "auth.register": "Реєстрація",
    "auth.logout": "Вихід",
    "auth.email": "Електронна пошта",
    "auth.password": "Пароль",
    "auth.confirmPassword": "Підтвердити пароль",
    "auth.name": "Повне ім'я",
    "auth.phone": "Номер телефону",
    "auth.forgotPassword": "Забули пароль?",
    "auth.rememberMe": "Запам'ятати мене",
    "auth.loginButton": "Увійти",
    "auth.registerButton": "Створити акаунт",
    "auth.haveAccount": "Вже маєте акаунт?",
    "auth.noAccount": "Немає акаунта?",

    // Auth - додаткові переклади для Login/Register
    "auth.login.title": "Вхід",
    "auth.login.subtitle": "Введіть свої дані для доступу до облікового запису",
    "auth.login.email": "Електронна пошта",
    "auth.login.password": "Пароль",
    "auth.login.forgotPassword": "Забули пароль?",
    "auth.login.signIn": "Увійти",
    "auth.login.withGoogle": "Продовжити з Google",
    "auth.login.noAccount": "Немає облікового запису?",
    "auth.login.signUp": "Зареєструватися",

    "auth.register.title": "Створити Обліковий Запис",
    "auth.register.subtitle": "Введіть свою інформацію для створення облікового запису",
    "auth.register.name": "Повне ім'я",
    "auth.register.email": "Електронна пошта",
    "auth.register.password": "Пароль",
    "auth.register.confirmPassword": "Підтвердити пароль",
    "auth.register.createAccount": "Створити обліковий запис",
    "auth.register.haveAccount": "Вже маєте обліковий запис?",
    "auth.register.signIn": "Увійти",

    // Gallery editing and management
    "gallery.save": "Зберегти",
    "gallery.cancel": "Скасувати",
    "gallery.delete": "Видалити",
    "gallery.edit": "Редагувати",
    "gallery.upload": "Завантажити",
    "gallery.uploadPhotos": "Завантажити Фото",
    "gallery.selectFiles": "Вибрати Файли",
    "gallery.browseFiles": "Огляд Файлів",
    "gallery.dragAndDrop": "Перетягніть файли сюди або натисніть для вибору",
    "gallery.selectedFiles": "Вибрані Файли",
    "gallery.clearAll": "Очистити Все",
    "gallery.uploading": "Завантаження...",
    "gallery.uploadComplete": "Завантаження Завершено",
    "gallery.photosUploaded": "фото успішно завантажено",

    // Sorting and display
    "gallery.sortBy": "Сортувати за",
    "gallery.newest": "Найновіші",
    "gallery.oldest": "Найстаріші",
    "gallery.name": "Назва",
    "gallery.showNames": "Показати Назви",

    // Photo actions
    "gallery.setAsCover": "Встановити як Обкладинку",
    "gallery.removeFromFavorites": "Видалити з Улюблених",
    "gallery.addToFavorites": "Додати до Улюблених",
    "gallery.deletePhoto": "Видалити Фото",
    "gallery.photoDeleted": "Фото Видалено",
    "gallery.photoDeletedDescription": "Фото було успішно видалено",
    "gallery.coverUpdated": "Обкладинка Оновлена",
    "gallery.coverUpdatedDescription": "Фото встановлено як обкладинку галереї",
    "gallery.photoUpdated": "Фото Оновлено",
    "gallery.removedFromFavorites": "Видалено з улюблених",

    // Error messages
    "gallery.error": "Помилка",
    "gallery.errorLoadingData": "Не вдалося завантажити дані",
    "gallery.errorUpdatingFavorite": "Не вдалося оновити улюблене",
    "gallery.errorDeletingPhoto": "Не вдалося видалити фото",
    "gallery.errorSettingCover": "Не вдалося встановити обкладинку",

    // Empty states
    "gallery.noPhotos": "Немає фото",
    "gallery.noFavorites": "Поки немає улюблених фото",
    "gallery.selectScene": "Виберіть сцену для перегляду фото",

    // Gallery management
    "gallery.gallerySettings": "Налаштування Галереї",
    "gallery.galleryName": "Назва Галереї",
    "gallery.shootingDate": "Дата Зйомки",
    "gallery.isPublic": "Публічна Галерея",
    "gallery.isPasswordProtected": "Захищена Паролем",
    "gallery.password": "Пароль",
    "gallery.confirmPassword": "Підтвердити Пароль",
    "gallery.saveSettings": "Зберегти Налаштування",
    "gallery.deleteGallery": "Видалити Галерею",
    "gallery.deleteGalleryConfirmation": "Ви впевнені, що хочете видалити цю галерею? Цю дію неможливо скасувати.",
    "gallery.galleryDeleted": "Галерею успішно видалено",
    "gallery.settingsUpdated": "Налаштування оновлено успішно",

    // Gallery sidebar and scenes
    "gallery.scenes": "Сцени",
    "gallery.addScene": "Додати Сцену",
    "gallery.favorites": "Улюблені",
    "gallery.design": "Дизайн",
    "gallery.settings": "Налаштування",
    "gallery.copyLink": "Копіювати Посилання",
    "gallery.shareGallery": "Поділитися Галереєю",
    "gallery.shareLinkDescription": "Поділіться цією галереєю з іншими, використовуючи посилання нижче",
    "gallery.ok": "ОК",
    "gallery.deleteScene": "Видалити Сцену",
    "gallery.deleteSceneConfirmation": "Ви впевнені, що хочете видалити цю сцену?",

    // Profile settings
    "profile.title": "Налаштування Профілю",
    "profile.personalInfo": "Особиста Інформація",
    "profile.personalInfoDescription": "Оновіть свою особисту інформацію",
    "profile.name": "Ім'я",
    "profile.email": "Електронна Пошта",
    "profile.phone": "Телефон",
    "profile.emailChangeNote": "Зверніться до підтримки для зміни електронної пошти",
    "profile.save": "Зберегти Зміни",
    "profile.saving": "Збереження...",
    "profile.profileUpdateSuccess": "Профіль успішно оновлено",
    "profile.profileUpdateError": "Не вдалося оновити профіль",

    // Password section
    "profile.password": "Пароль",
    "profile.passwordDescription": "Змініть пароль вашого облікового запису",
    "profile.currentPassword": "Поточний Пароль",
    "profile.newPassword": "Новий Пароль",
    "profile.confirmPassword": "Підтвердити Новий Пароль",
    "profile.updatePassword": "Оновити Пароль",
    "profile.updating": "Оновлення...",
    "profile.passwordUpdateSuccess": "Пароль успішно оновлено",
    "profile.passwordUpdateError": "Не вдалося оновити пароль",
    "profile.passwordsDontMatch": "Паролі не співпадають",
    "profile.fillAllFields": "Будь ласка, заповніть всі поля",

    // Account deletion
    "profile.deleteAccount": "Видалити Обліковий Запис",
    "profile.deleteWarning": "Ця дія є остаточною і не може бути скасована",
    "profile.deleteButton": "Видалити Обліковий Запис",
    "profile.confirmDeleteTitle": "Підтвердити Видалення Облікового Запису",
    "profile.confirmDeleteDescription":
      "Ви впевнені, що хочете видалити свій обліковий запис? Всі ваші дані будуть остаточно видалені.",
    "profile.cancel": "Скасувати",
    "profile.deleteButtonConfirm": "Видалити Обліковий Запис",
    "profile.deleting": "Видалення...",
    "profile.accountDeleteSuccess": "Обліковий запис успішно видалено",
    "profile.accountDeleteError": "Не вдалося видалити обліковий запис",

    // Galleries
    "galleries.title": "Мої Галереї",
    "galleries.create": "Створити Галерею",
    "galleries.empty": "Поки що немає галерей",
    "galleries.emptyDescription": "Створіть свою першу галерею, щоб почати",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("uk") // Default to Ukrainian

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "uk")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    const translation = translations[language][key] || translations["en"][key] || key
    return translation
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
