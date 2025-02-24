import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationService = {
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
      // const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      // if (!timePattern.test(task.time)) {
      //   throw new Error('Invalid time format. Use HH:mm (24-hour format)');
      // }
      console.log(task)

      let hours = 0;
    let minutes = 0;

    if (task.time.includes('AM') || task.time.includes('PM')) {
      const timeParts = task.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeParts) {
        hours = parseInt(timeParts[1]);
        minutes = parseInt(timeParts[2]);
        const period = timeParts[3].toUpperCase();
        
        // Convert to 24-hour format
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
      }
    } else {
      // Fallback for 24-hour format if present
      const [hoursStr, minutesStr] = task.time.split(':');
      hours = parseInt(hoursStr);
      minutes = parseInt(minutesStr);
    }

      // Parse date/time
      const [day, month, year] = task.date.split('/');
      console.log(hours, minutes, day, month, year);

       // Create Date object (months are 0-indexed in JS)

       
      const triggerDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hours,
      minutes
    );
    console.log(new Date().getDate())

      // Validate date
      if (isNaN(triggerDate.getTime())) {
        throw new Error('Invalid date/time combination');
      }

      // Check if date is in future
      if (triggerDate <= new Date()) {
        throw new Error('Cannot schedule notifications for past times');
      }

      

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
export  default NotificationService;