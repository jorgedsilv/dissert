package pt.ua.ieeta.urjourney.urjourney.notifications;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import java.util.Calendar;

import static android.content.Context.ALARM_SERVICE;

public class NotificationScheduler
{
    public NotificationScheduler()
    {

    }

    public void setAlarm(Context context, int hour, int min, int id)
    {
        Calendar currently = Calendar.getInstance();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(ALARM_SERVICE);

        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(System.currentTimeMillis());
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, min);

        // cancel already scheduled alarms
        cancelAlarm(context, id, alarmManager);

        if(cal.before(currently))
        {
            cal.add(Calendar.DATE, 1);
        }

        // Set up the Notification Broadcast Intent.
        Intent notifyIntent = new Intent(context, AlarmReceiver.class);
        notifyIntent.putExtra(NotificationConstants.NOTIFICATION_ID, id);

        PendingIntent notifyPendingIntent = PendingIntent.getBroadcast(
                context,
                id,
                notifyIntent,
                PendingIntent.FLAG_UPDATE_CURRENT
        );

        if (alarmManager != null)
        {
            alarmManager.setInexactRepeating(
                    AlarmManager.RTC_WAKEUP,
                    cal.getTimeInMillis(),
                    AlarmManager.INTERVAL_DAY,
                    notifyPendingIntent
            );
        }
    }

    public void cancelAlarm(Context context, int id, AlarmManager alarmManager)
    {
        Intent notifyIntent = new Intent(context, AlarmReceiver.class);
        notifyIntent.putExtra(NotificationConstants.NOTIFICATION_ID, id);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                id,
                notifyIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);

        if(alarmManager != null)
        {
            alarmManager.cancel(pendingIntent);
            pendingIntent.cancel();
        }
    }
}
