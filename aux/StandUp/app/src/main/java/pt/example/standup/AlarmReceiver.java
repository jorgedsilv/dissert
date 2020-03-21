package pt.example.standup;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

/**
 * Broadcast receiver for the alarm, which delivers the notification.
 */
public class AlarmReceiver extends BroadcastReceiver
{
    private NotificationManager mNotificationManager;

    //public static String NOTIFICATION_ID = "notification-id" ;

    /**
     * Called when the BroadcastReceiver receives an Intent broadcast.
     *
     * @param context The Context in which the receiver is running.
     * @param intent The Intent being received.
     */
    @Override
    public void onReceive(Context context, Intent intent)
    {
        mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        int id = intent.getIntExtra(NotificationConstants.NOTIFICATION_ID , 0 ) ;

        deliverNotification(context, id);
    }

    /**
     * Builds and delivers the notification.
     *
     * @param context, activity context.
     */
    private void deliverNotification(Context context, int notif_id)
    {
        String notif_title = context.getResources().getString(R.string.NOTIFICATION_HEADER);
        String notif_content = "NOTIFICATION_ID = "+notif_id;

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
                notif_content = context.getResources().getString(R.string.NOTIFICATION_MORNING_TEXT);
                break;

            case NotificationConstants.NOTIFICATION_NOON_ID:
                notif_content = context.getResources().getString(R.string.NOTIFICATION_AFTERNOON_TEXT);
                break;

            case NotificationConstants.NOTIFICATION_EVENING_ID:
                notif_content = context.getResources().getString(R.string.NOTIFICATION_EVENING_TEXT);
                break;
        }

        // Build the notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, NotificationConstants.PRIMARY_CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stand_up)
                .setContentTitle(notif_title)
                .setContentText(notif_content)
                .setContentIntent(contentPendingIntent)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setDefaults(NotificationCompat.DEFAULT_ALL);

        // Deliver the notification
        mNotificationManager.notify(notif_id, builder.build());
    }
}
