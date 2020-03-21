package pt.example.standup;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.SystemClock;
import android.support.v4.app.NotificationCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.CompoundButton;
import android.widget.Toast;
import android.widget.ToggleButton;

import java.util.Calendar;

//https://codelabs.developers.google.com/codelabs/android-training-alarm-manager/index.html?index=..%2F..android-training#4

/**
 * MainActivity for the Stand up! app. Contains a toggle button that
 * sets an alarm which delivers a Stand up notification every 15 minutes.
 */
public class MainActivity extends AppCompatActivity
{

    private ToggleButton alarmToggle;

    private NotificationManager mNotificationManager;

    //private AlarmManager alarmManager;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        alarmToggle = findViewById(R.id.alarmToggle);

        NotificationScheduler morning = new NotificationScheduler();
        morning.setAlarm(MainActivity.this, 15, 10, NotificationConstants.NOTIFICATION_MORNING_ID);

        NotificationScheduler afternoon = new NotificationScheduler();
        afternoon.setAlarm(MainActivity.this, 15, 25, NotificationConstants.NOTIFICATION_NOON_ID);

        NotificationScheduler evening = new NotificationScheduler();
        evening.setAlarm(MainActivity.this, 15,40, NotificationConstants.NOTIFICATION_EVENING_ID);

        // Set up the Notification Broadcast Intent.
        /*Intent notifyIntent = new Intent(this, AlarmReceiver.class);

        boolean alarmUp = (PendingIntent.getBroadcast(this, NOTIFICATION_ID,
                notifyIntent, PendingIntent.FLAG_NO_CREATE) != null);
        alarmToggle.setChecked(alarmUp);

        final PendingIntent notifyPendingIntent = PendingIntent.getBroadcast
                (this, NOTIFICATION_ID, notifyIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        final AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);

        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(System.currentTimeMillis());
        cal.set(Calendar.HOUR_OF_DAY, 21);
        cal.set(Calendar.MINUTE, 35);

        if (alarmManager != null)
        {
            //alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
            //                triggerTime, repeatInterval, notifyPendingIntent);

            alarmManager.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(),
                    AlarmManager.INTERVAL_DAY, notifyPendingIntent);

            //alarmManagerNight.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,cal.getTimeInMillis(),notifyPendingIntent);
        }*/


        /*final AlarmManager alarmManagerMorning = (AlarmManager) getSystemService(ALARM_SERVICE);
        final AlarmManager alarmManagerAfternoon = (AlarmManager) getSystemService(ALARM_SERVICE);
        final AlarmManager alarmManagerNight = (AlarmManager) getSystemService(ALARM_SERVICE);

        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(System.currentTimeMillis());
        cal.set(Calendar.HOUR_OF_DAY, 21);
        cal.set(Calendar.MINUTE, 35);

        if (alarmManagerNight != null)
        {
            //alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
            //                triggerTime, repeatInterval, notifyPendingIntent);

            alarmManagerNight.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(),
                    AlarmManager.INTERVAL_DAY, notifyPendingIntent);

            //alarmManagerNight.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,cal.getTimeInMillis(),notifyPendingIntent);
        }

        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(System.currentTimeMillis());
        c.set(Calendar.HOUR_OF_DAY, 21);
        c.set(Calendar.MINUTE, 40);

        if (alarmManagerMorning != null)
        {
            //alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
            //                triggerTime, repeatInterval, notifyPendingIntent);

            alarmManagerMorning.setInexactRepeating(AlarmManager.RTC_WAKEUP, c.getTimeInMillis(),
                    AlarmManager.INTERVAL_DAY, notifyPendingIntent);
        }*/

        /*Calendar cal_18 = Calendar.getInstance();
        cal_18.setTimeInMillis(System.currentTimeMillis());
        cal_18.set(Calendar.HOUR_OF_DAY, 18);
        cal_18.set(Calendar.MINUTE, 0);

        if (alarmManagerMorning != null)
        {
            //alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
            //                triggerTime, repeatInterval, notifyPendingIntent);

            alarmManagerMorning.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal_18.getTimeInMillis(),
                    AlarmManager.INTERVAL_DAY, notifyPendingIntent);
        }

        Calendar cal_18_30 = Calendar.getInstance();
        cal_18_30.setTimeInMillis(System.currentTimeMillis());
        cal_18_30.set(Calendar.HOUR_OF_DAY, 18);
        cal_18_30.set(Calendar.MINUTE, 30);

        if (alarmManagerAfternoon != null)
        {
            //alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
            //                triggerTime, repeatInterval, notifyPendingIntent);

            alarmManagerAfternoon.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal_18_30.getTimeInMillis(),
                    AlarmManager.INTERVAL_DAY, notifyPendingIntent);

        }

        Calendar cal_19 = Calendar.getInstance();
        cal_19.setTimeInMillis(System.currentTimeMillis());
        cal_19.set(Calendar.HOUR_OF_DAY, 19);
        cal_19.set(Calendar.MINUTE, 0);

        if (alarmManagerNight != null)
        {
            //alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
            //                triggerTime, repeatInterval, notifyPendingIntent);

            alarmManagerNight.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal_19.getTimeInMillis(),
                    AlarmManager.INTERVAL_DAY, notifyPendingIntent);
        }*/

        /*alarmToggle.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener()
        {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked)
            {
                String toastMessage;
                if(isChecked)
                {
                    //long interval = AlarmManager.INTERVAL_FIFTEEN_MINUTES;
                    //long repeatInterval = interval / AlarmManager.INTERVAL_FIFTEEN_MINUTES;

                    //long triggerTime = SystemClock.elapsedRealtime() + repeatInterval;

                    // Set the alarm to start at approximately 2:00 p.m.
                    Calendar cal_14 = Calendar.getInstance();
                    cal_14.setTimeInMillis(System.currentTimeMillis());
                    cal_14.set(Calendar.HOUR_OF_DAY, 14);

                    Calendar cal_12 = Calendar.getInstance();
                    cal_12.setTimeInMillis(System.currentTimeMillis());
                    cal_12.set(Calendar.HOUR_OF_DAY, 12);

                    Calendar cal_13_15 = Calendar.getInstance();
                    cal_13_15.setTimeInMillis(System.currentTimeMillis());
                    cal_13_15.set(Calendar.HOUR_OF_DAY, 13);
                    cal_13_15.set(Calendar.MINUTE, 15);

                    Calendar cal_13_30 = Calendar.getInstance();
                    cal_13_30.setTimeInMillis(System.currentTimeMillis());
                    cal_13_30.set(Calendar.HOUR_OF_DAY, 13);
                    cal_13_30.set(Calendar.MINUTE, 30);

                    //If the Toggle is turned on, set the repeating alarm with a 15 minute interval
                    if (alarmManager != null)
                    {
                        //alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
                        //                triggerTime, repeatInterval, notifyPendingIntent);

                        alarmManager.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal_14.getTimeInMillis(),
                                AlarmManager.INTERVAL_DAY, notifyPendingIntent);

                        alarmManager.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal_12.getTimeInMillis(),
                                AlarmManager.INTERVAL_DAY, notifyPendingIntent);

                        alarmManager.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal_13_15.getTimeInMillis(),
                                AlarmManager.INTERVAL_DAY, notifyPendingIntent);

                        alarmManager.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal_13_30.getTimeInMillis(),
                                AlarmManager.INTERVAL_DAY, notifyPendingIntent);
                    }


                    //Set the toast message for the "on" case.
                    toastMessage = "Stand Up Alarm On!";
                }
                else
                {
                    //Set the toast message for the "off" case.
                    toastMessage = "Stand Up Alarm Off!";

                    if (alarmManager != null)
                    {
                        alarmManager.cancel(notifyPendingIntent);
                    }

                    mNotificationManager.cancelAll();
                }

                //Show a toast to say the alarm is turned on or off.
                Toast.makeText(MainActivity.this, toastMessage,Toast.LENGTH_SHORT).show();
            }
        });*/

        // Create the notification channel.
        createNotificationChannel();
    }

    /**
     * Creates a Notification channel, for OREO and higher.
     */
    public void createNotificationChannel()
    {
        // Create a notification manager object.
        mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        // Notification channels are only available in OREO and higher.
        // So, add a check on SDK version.
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O)
        {

            // Create the NotificationChannel with all the parameters.
            NotificationChannel notificationChannel = new NotificationChannel(
                    NotificationConstants.PRIMARY_CHANNEL_ID,
                    "Stand up notification",
                    NotificationManager.IMPORTANCE_HIGH
            );

            notificationChannel.enableLights(true);
            notificationChannel.setLightColor(Color.RED);
            notificationChannel.enableVibration(true);
            notificationChannel.setDescription("Notifies every 15 minutes to stand up and walk");
            mNotificationManager.createNotificationChannel(notificationChannel);
        }
    }
}
