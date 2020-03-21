package pt.example.standup;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;

import java.util.Calendar;
import static android.content.Context.ALARM_SERVICE;

public class NotificationScheduler
{
    public NotificationScheduler()
    {

    }

    public void setAlarm(Context context, int hour, int min, int id)
    {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(System.currentTimeMillis());
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, min);

        // Set up the Notification Broadcast Intent.
        Intent notifyIntent = new Intent(context, AlarmReceiver.class);
        notifyIntent.putExtra(NotificationConstants.NOTIFICATION_ID, id);

        PendingIntent notifyPendingIntent = PendingIntent.getBroadcast(
                context,
                id,
                notifyIntent,
                PendingIntent.FLAG_UPDATE_CURRENT
        );

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(ALARM_SERVICE);

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
}
