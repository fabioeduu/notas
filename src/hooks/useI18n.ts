import { useTranslation } from "react-i18next";

/**
 * Hook customizado para usar i18n de forma simples
 * Retorna objetos de tradução organizados por tópico
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  return {
    t,
    i18n,
    // Objetos de tradução organizados
    common: {
      save: t("common.save"),
      cancel: t("common.cancel"),
      delete: t("common.delete"),
      edit: t("common.edit"),
      back: t("common.back"),
      close: t("common.close"),
      loading: t("common.loading"),
      error: t("common.error"),
      success: t("common.success"),
      warning: t("common.warning"),
      logout: t("common.logout"),
    },
    auth: {
      email: t("auth.email"),
      password: t("auth.password"),
      confirmPassword: t("auth.confirmPassword"),
      login: t("auth.login"),
      register: t("auth.register"),
      doNotHaveAccount: t("auth.doNotHaveAccount"),
      alreadyHaveAccount: t("auth.alreadyHaveAccount"),
      invalidEmail: t("auth.invalidEmail"),
      passwordTooShort: t("auth.passwordTooShort"),
      passwordsDoNotMatch: t("auth.passwordsDoNotMatch"),
      loginError: t("auth.loginError"),
      registerError: t("auth.registerError"),
      registerHere: t("auth.registerHere"),
      loginHere: t("auth.loginHere"),
    },
    home: {
      title: t("home.title"),
      subtitle: t("home.subtitle"),
      newNote: t("home.newNote"),
      emptyTitle: t("home.emptyTitle"),
      emptyMessage: t("home.emptyMessage"),
      deleteConfirm: t("home.deleteConfirm"),
      deleteMessage: t("home.deleteMessage"),
      confirmDelete: t("home.confirmDelete"),
      cancelDelete: t("home.cancelDelete"),
      loadError: t("home.loadError"),
      deleteError: t("home.deleteError"),
    },
    note: {
      title: t("note.title"),
      noteTitle: t("note.noteTitle"),
      noteContent: t("note.noteContent"),
      createdAt: t("note.createdAt"),
      location: t("note.location"),
      viewMap: t("note.viewMap"),
      save: t("note.save"),
      titlePlaceholder: t("note.titlePlaceholder"),
      contentPlaceholder: t("note.contentPlaceholder"),
      saveError: t("note.saveError"),
      locationError: t("note.locationError"),
      noLocation: t("note.noLocation"),
      coordinates: t("note.coordinates"),
      address: t("note.address"),
    },
    location: {
      permissionRequired: t("location.permissionRequired"),
      permissionMessage: t("location.permissionMessage"),
      permissionDenied: t("location.permissionDenied"),
      obtainingLocation: t("location.obtainingLocation"),
      locationObtained: t("location.locationObtained"),
    },
    notifications: {
      permissionRequired: t("notifications.permissionRequired"),
      permissionMessage: t("notifications.permissionMessage"),
      welcome: t("notifications.welcome"),
      welcomeMessage: t("notifications.welcomeMessage"),
      noteCreated: t("notifications.noteCreated"),
      noteCreatedMessage: t("notifications.noteCreatedMessage"),
      permissionDenied: t("notifications.permissionDenied"),
    },
    map: {
      title: t("map.title"),
      noteLocation: t("map.noteLocation"),
      close: t("map.close"),
      unavailable: t("map.unavailable"),
    },
  };
};
