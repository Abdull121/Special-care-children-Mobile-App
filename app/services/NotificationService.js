import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  initialize: async () => {
    if (!Device.isDevice) {
      throw new Error('Must use physical device for Push Notifications');
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Failed to get permission for notifications');
    }
  },

  scheduleTaskNotification: async (task) => {
    try {
      // Validate time format (HH:mm)
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timePattern.test(task.time)) {
        throw new Error('Invalid time format. Use HH:mm (24-hour format)');
      }

      // Parse date/time
      const [hours, minutes] = task.time.split(':');
      const [day, month, year] = task.date.split('/');
      console.log(hours, minutes, day, month, year);

      // Create Date object (months are 0-indexed in JS)
      const triggerDate = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      // Validate date
      if (isNaN(triggerDate.getTime())) {
        throw new Error('Invalid date/time combination');
      }

      // Check if date is in future
      if (triggerDate <= new Date()) {
        throw new Error('Cannot schedule notifications for past times');
      }

      // Log the trigger date to verify it is correct
    //   console.log('Notification will be triggered at:', triggerDate.toISOString());
    //   console.log('Trigger Date Details:', {
    //     year: triggerDate.getFullYear(),
    //     month: triggerDate.getMonth() + 1, // Month is 0-indexed
    //     day: triggerDate.getDate(),
    //     hours: triggerDate.getHours(),
    //     minutes: triggerDate.getMinutes(),
    //   });

      // Schedule notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for : ${task.title}  📝`,
          body: `${task.category} scheduled for ${task.time}`,
          data: { taskId: task.id },
          sound: 'default',
        },
        trigger: { type: 'date', date: triggerDate },
      });

      return notificationId;
    } catch (error) {
      console.error('Notification Error:', error);
      throw error;
    }
  },

  cancelNotification: async (notificationId) => {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  }
};