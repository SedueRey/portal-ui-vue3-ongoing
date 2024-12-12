import { type Ref, ref } from 'vue';
import { dateToInt } from '../utils/utils';
import { defineStore } from 'pinia';
import type { Notificacion } from '../shared.types';
import sharedApi from '../api/shared.api';

async function fnGetNotificationes(page, notificaciones = []): Promise<Notificacion[]> {
  const resp = await sharedApi.notifications('NL', page, 50);
  const notis = await resp.data;
  notificaciones = notificaciones.concat(notis.datos);
  return notificaciones;
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications: Ref<Notificacion[]> = ref([]);
  // Mutaciones
  const markAsReadNotificationMutation = (payload) => {
    const i = notifications.value.map((item) => item.codigo_alerta).indexOf(payload);
    notifications.value.splice(i, 1);
  };
  // Acciones
  const getNotifications = async () => {
    fnGetNotificationes(0).then((not) => {
      not.sort((a, b) => dateToInt(b.fecha_envio) - dateToInt(a.fecha_envio));
      notifications.value = not;
    });
  };
  const markNotificationAsRead = async (idNotification) => {
    try {
      await sharedApi.markAsReadNotification(idNotification);
      markAsReadNotificationMutation(idNotification);
    } catch (_err) {}
  };
  const markAllNotificationAsRead = async (arraynotifications: number[]) => {
    await sharedApi.markAllAsReadNotification(arraynotifications);
    notifications.value = [];
  };
  return {
    notifications,
    // Acciones
    getNotifications,
    markAllNotificationAsRead,
    markNotificationAsRead,
  };
});
