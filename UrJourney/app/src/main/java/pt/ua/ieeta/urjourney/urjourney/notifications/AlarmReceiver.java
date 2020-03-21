package pt.ua.ieeta.urjourney.urjourney.notifications;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;

import pt.ua.ieeta.urjourney.urjourney.MainActivity;
import pt.ua.ieeta.urjourney.urjourney.R;

public class AlarmReceiver extends BroadcastReceiver
{
    private NotificationManager mNotificationManager;

    @Override
    public void onReceive(Context context, Intent intent)
    {
        mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        int id = intent.getIntExtra(NotificationConstants.NOTIFICATION_ID , 0 ) ;

        deliverNotification(context, id);
    }

    private void deliverNotification(Context context, int notif_id)
    {
        String notif_title = context.getResources().getString(R.string.app_name);
        //String notif_content = "NOTIFICATION_ID = "+notif_id;
        String notif_content = context.getResources().getString(R.string.app_name);

        // Create the content intent for the notification, which launches
        // this activity
        Intent contentIntent = new Intent(context, MainActivity.class);

        PendingIntent contentPendingIntent = PendingIntent.getActivity(
                context,
                notif_id,
                contentIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);

        switch (notif_id)
        {
            case NotificationConstants.NOTIFICATION_MORNING_ID:
                notif_content = context.getResources().getString(R.string.notification_morning_text);
                break;

            case NotificationConstants.NOTIFICATION_AFTERNOON_ID:
                notif_content = context.getResources().getString(R.string.notification_afternoon_text);
                break;

            case NotificationConstants.NOTIFICATION_EVENING_ID:
                notif_content = context.getResources().getString(R.string.notification_evening_text);
                break;
        }

        // Build the notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, NotificationConstants.PRIMARY_CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification_mood)
                .setContentTitle(notif_title)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(notif_content))
                .setContentText(notif_content)
                .setContentIntent(contentPendingIntent)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setDefaults(NotificationCompat.DEFAULT_ALL);

        // Deliver the notification
        mNotificationManager.notify(notif_id, builder.build());
    }
}
