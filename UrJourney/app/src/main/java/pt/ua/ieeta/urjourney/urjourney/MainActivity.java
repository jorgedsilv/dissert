package pt.ua.ieeta.urjourney.urjourney;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
//import android.support.v4.app.Fragment;
import android.app.Fragment;
//import android.support.v4.app.FragmentTransaction;
import android.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

import pt.ua.ieeta.urjourney.urjourney.checkin.Study;
import pt.ua.ieeta.urjourney.urjourney.loggin.LoginActivity;
import pt.ua.ieeta.urjourney.urjourney.checkin.CheckinActivity;

import pt.ua.ieeta.urjourney.urjourney.history.*;
import pt.ua.ieeta.urjourney.urjourney.notifications.*;
import pt.ua.ieeta.urjourney.urjourney.profile.*;

public class MainActivity extends AppCompatActivity implements TimelineFragment.OnTimelineItemSelectedListener
{
    /* Firebase references */
    private FirebaseAuth mFirebaseAuth;
    private FirebaseUser mFirebaseUser;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;

    /* Study model and list of studies */
    private Study s;
    private List<Study> studyList = new ArrayList<>();

    private static boolean flag = false;
    private static boolean check = false;

    private BottomNavigationView navigation;

    private NotificationManager mNotificationManager;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mFirebaseAuth = FirebaseAuth.getInstance();
        mFirebaseUser = mFirebaseAuth.getCurrentUser();
        database = FirebaseDatabase.getInstance();

        navigation = findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);

        //boolean logged =  mFirebaseUser != null;
        //showToast("USER LOGGED?"+ logged);

        if(mFirebaseUser == null) // No user is signed in
        {
            //Not logged in , launch the Login activity
            startActivity(new Intent(this, LoginActivity.class));
            finish();

            return;
        }

        //testing
        /*if(flag == false)
        {
            //Not logged in , launch the Login activity
            startActivity(new Intent(this, LoginActivity.class));
            finish();

            flag = true;
        }*/

        loadDatabaseData();

        //moveToCheckin(check);

        /*if(check == false) //user not in study
        {
            //Start after login the check-in process
            startActivity(new Intent(this, CheckinActivity.class));
            finish();

            //check = true;
        }*/

        //-- Notifications
        mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        NotificationScheduler morning = new NotificationScheduler();
        morning.setAlarm(
                MainActivity.this,
                NotificationConstants.NOTIFICATION_MORNING_HOUR,
                NotificationConstants.NOTIFICATION_MORNING_MINUTE,
                NotificationConstants.NOTIFICATION_MORNING_ID
        );

        NotificationScheduler afternoon = new NotificationScheduler();
        afternoon.setAlarm(
                MainActivity.this,
                NotificationConstants.NOTIFICATION_AFTERNOON_HOUR,
                NotificationConstants.NOTIFICATION_AFTERNOON_MINUTE,
                NotificationConstants.NOTIFICATION_AFTERNOON_ID
        );

        NotificationScheduler evening = new NotificationScheduler();
        evening.setAlarm(
                MainActivity.this,
                NotificationConstants.NOTIFICATION_EVENING_HOUR,
                NotificationConstants.NOTIFICATION_EVENING_MINUTE,
                NotificationConstants.NOTIFICATION_EVENING_ID
        );

        createNotificationChannel();
        //--

        /* load the store fragment by default */
        loadFragment(new HomeFragment());
    }

    /*@Override
    public void onStart()
    {
        super.onStart();
    }*/

    private void loadDatabaseData()
    {
        databaseReference = database.getReference().child("study_data");
        final String uid = mFirebaseUser.getUid();

        databaseReference.addValueEventListener(new ValueEventListener()
        {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot)
            {
                for(DataSnapshot singleSnap : dataSnapshot.getChildren()) //a fazer loop pelos study
                {
                    Study entry = singleSnap.getValue(Study.class);

                    List<String> participants = new ArrayList<>();
                    participants = entry.participants;

                    //showToast("Tamanho = "+participants.size());

                    if (participants.contains(uid))
                    {
                        check = true;
                        break;
                    }
                }

                moveToCheckin(check);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                Log.e(this.toString(), "onCancelled", databaseError.toException());
            }
        });
    }

    private void moveToCheckin(boolean result)
    {
        if(result == false) //user not in study
        {
            //Start after login the check-in process
            startActivity(new Intent(this, CheckinActivity.class));
            finish();
        }
    }

    private boolean inStudy(String uid)
    {
        List<String> participants = new ArrayList<>();

        //showToast("Size (inStudy) = "+studyList.size());

        for(int i = 0; i < studyList.size(); i++)
        {
            participants = studyList.get(i).getParticipants();

            if (participants.contains(uid))
            {
                //Toast.makeText(getApplicationContext(), "here", Toast.LENGTH_SHORT).show();
                return true;
            }
        }

        return false;
    }

    /**
     * Items on Bottom Navigation Bar
     */
    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item)
        {
            Fragment fragment;

            switch (item.getItemId())
            {
                case R.id.navigation_home:
                    fragment = new HomeFragment();
                    loadFragment(fragment);
                    return true;
                case R.id.navigation_timeline:
                    fragment = new TimelineFragment();
                    loadFragment(fragment);
                    return true;
                case R.id.navigation_profile:
                    fragment = new ProfileFragment();
                    loadFragment(fragment);
                    return true;
            }
            return false;
        }
    };

    /**
     * Loads the fragment
     */
    private void loadFragment(Fragment fragment)
    {
        getFragmentManager().beginTransaction()
                .replace(R.id.frame_container, fragment)
                .addToBackStack(null)
                .commit();
    }

    /**
     * Helper to lauch TimelineDetails. Without it TimelineDetails doesn't know which item was selected
     * @param fragment
     */
    @Override
    public void onAttachFragment(Fragment fragment)
    {
        if (fragment instanceof TimelineFragment)
        {
            TimelineFragment detailsFragment = (TimelineFragment) fragment;
            detailsFragment.setOnTimelineItemSelectedListener(this);
        }
    }

    /**
     * Lauch Timeline with details from selected item
     * @param position
     */
    public void onItemSelected(long position)
    {
        // The user selected the headline of an article from the HeadlinesFragment
        // Do something here to display that article

        // Create fragment and give it an argument for the selected article
        TimelineDetailFragment newFragment = new TimelineDetailFragment();
        Bundle args = new Bundle();
        //args.putInt(TimelineDetailFragment.ARG_POSITION, position);
        args.putLong(TimelineDetailFragment.ARG_POSITION, position);

        newFragment.setArguments(args);

        FragmentTransaction transaction = getFragmentManager().beginTransaction();

        // Replace whatever is in the fragment_container view with this fragment,
        // and add the transaction to the back stack so the user can navigate back
        transaction.replace(R.id.frame_container, newFragment);
        transaction.addToBackStack(null);

        // Commit the transaction
        transaction.commit();
    }

    /**
     * Shows a toast with the given text.
     */
    private void showToast(String text)
    {
        final Context context = getApplicationContext();
        final int duration = Toast.LENGTH_SHORT;

        Toast.makeText(context, text, duration).show();
    }

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
                    "UrJourney notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );

            notificationChannel.enableLights(true);
            notificationChannel.setLightColor(Color.RED);
            notificationChannel.enableVibration(true);
            notificationChannel.setDescription("Notifies to log your mood");
            mNotificationManager.createNotificationChannel(notificationChannel);
        }
    }
}
