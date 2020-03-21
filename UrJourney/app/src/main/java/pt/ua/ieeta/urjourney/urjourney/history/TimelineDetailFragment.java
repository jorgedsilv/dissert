package pt.ua.ieeta.urjourney.urjourney.history;

import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.Context;
import android.content.res.ColorStateList;
import android.os.Bundle;
//import android.support.v4.app.Fragment;
import android.app.Fragment;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import pt.ua.ieeta.urjourney.urjourney.R;


public class TimelineDetailFragment extends Fragment
{
    private static final String TAG = "TimelineDetailFragment";

    /* UI references */
    private TextView header;

    private ImageButton btnGreen;
    private ImageButton btnYellow;
    private ImageButton btnRed;

    private ImageButton btnUp;
    private ImageButton btnUncertain;
    private ImageButton btnDown;

    private EditText feelingNote;

    private ImageView weatherIcon;
    private TextView weatherDescript;
    private TextView weatherTemperature;

    private TextView location;

    private TextView bpm;
    private TextView steps;

    private TextView sleep_duration;
    private TextView sleep_start;
    private TextView sleep_end;

    private FloatingActionButton completeFAB;
    private FloatingActionButton cancelFAB;

    private Button btnComplete;
    private Button btnCancel;

    /* Firebase references */
    private FirebaseAuth mAuth;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;

    /* Model */
    private Timeline t = new Timeline();

    private int color;
    private final int COLOR_GREEN = 1;
    private final int COLOR_YELLOW = 2;
    private final int COLOR_RED = 3;

    private int yellowCount = 0;
    private String yellowInfo = "yellow";

    private int redCount = 0;
    private String redInfo = "red";

    private int greenCount = 0;
    private String greenInfo = "green";

    /* getting info from selected item on TimelineFragment*/
    public final static String ARG_POSITION = "position";
    long mCurrentPosition = -1;

    public TimelineDetailFragment()
    {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        final Context context = getContext();
        final int duration = Toast.LENGTH_SHORT;

        View view = inflater.inflate(R.layout.fragment_timeline_detail, container, false);

        // If activity recreated (such as from screen rotate), restore
        // the previous article selection set by onSaveInstanceState().
        if (savedInstanceState != null)
        {
            mCurrentPosition = savedInstanceState.getLong(ARG_POSITION);
        }

        /* Firebase */
        mAuth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance();

        header = view.findViewById(R.id.timeline_detail_header);

        btnGreen = view.findViewById(R.id.btnGreen);
        btnYellow = view.findViewById(R.id.btnYellow);
        btnRed = view.findViewById(R.id.btnRed);

        btnUp = view.findViewById(R.id.btnUp);
        btnUncertain = view.findViewById(R.id.btnUncertain);
        btnDown = view.findViewById(R.id.btnDown);

        feelingNote = view.findViewById(R.id.timeline_detail_feeling_note);

        //weatherIcon = view.findViewById(R.id.timeline_detail_weather_icon);
        weatherDescript = view.findViewById(R.id.timeline_detail_weather_description);
        weatherTemperature = view.findViewById(R.id.timeline_detail_weather_temperature);

        location = view.findViewById(R.id.timeline_detail_location);

        bpm = view.findViewById(R.id.timeline_detail_bpm);
        steps = view.findViewById(R.id.timeline_detail_steps);

        sleep_duration = view.findViewById(R.id.timeline_detail_sleep_duration);
        sleep_start = view.findViewById(R.id.timeline_detail_sleep_start);
        sleep_end = view.findViewById(R.id.timeline_detail_sleep_end);

        /*completeFAB = view.findViewById(R.id.complete_fab);
        cancelFAB = view.findViewById(R.id.cancel_fab);


        completeFAB.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {

                String note = feelingNote.getText().toString().trim();

                updateFeelingNote(note);
                updateMoodValues(color);
                updateFeelingValues(t.getFeeling());

                //Toast.makeText(context, "Updated!", duration).show();

                moveBack();
            }
        });

        cancelFAB.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                //Toast.makeText(context, "Cancelled!", duration).show();

                moveBack();
            }
        });*/

        btnComplete = view.findViewById(R.id.complete_button);
        btnCancel = view.findViewById(R.id.cancel_button);

        btnComplete.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                String note = feelingNote.getText().toString().trim();

                updateFeelingNote(note);
                //updateMoodValues(color);
                //updateMoodValues(t.getMood());
                updateFeelingValues(t.getFeeling());

                //Toast.makeText(context, "Color = "+color, duration).show();

                moveBack();
            }
        });

        btnCancel.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                //Toast.makeText(context, "Cancelled!", duration).show();

                moveBack();
            }
        });

        btnGreen.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                //color = COLOR_GREEN;
                //t.setMood("green");
                //updateUI();
                //updateMoodValues(color);
            }
        });

        btnYellow.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                //color = COLOR_YELLOW;
                //t.setMood("yellow");
                //updateUI();
                //updateMoodValues(color);
            }
        });

        btnRed.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                //color = COLOR_RED;
                //t.setMood("red");
                //updateUI();
                //updateMoodValues(color);
            }
        });

        btnUp.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                t.setFeeling("up");
                updateUI();
                //updateFeelingValues("up");
            }
        });

        btnUncertain.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                t.setFeeling("uncertain");
                updateUI();
                //updateFeelingValues("uncertain");
            }
        });

        btnDown.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                t.setFeeling("down");
                updateUI();
                //updateFeelingValues("down");
            }
        });

        return view;
    }

    private void moveBack()
    {
        Fragment fragment = new TimelineFragment();
        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.frame_container, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();
    }

    private void updateFeelingNote(String text)
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        databaseReference = database.getReference("mood_data").child(uid);
        String pos = Long.toString(mCurrentPosition);

        if (!TextUtils.isEmpty(text))
        {
            databaseReference.child(pos).child("feedback").child("note").setValue(text);
        }
        else
        {
            databaseReference.child(pos).child("feedback").child("note").setValue("null");
        }

        t.setNote(text);

        updateUI();
    }

    /* Felling passou a ser Sleep, apesar de ser mantida a estrutura em código */
    private void updateFeelingValues(String feel)
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        databaseReference = database.getReference("mood_data").child(uid);
        String pos = Long.toString(mCurrentPosition);

        if(feel.equals("up"))
        {
            databaseReference.child(pos).child("feedback").child("feeling").setValue("up");
            t.setFeeling("up");
        }
        else if(feel.equals("uncertain"))
        {
            databaseReference.child(pos).child("feedback").child("feeling").setValue("uncertain");
            t.setFeeling("uncertain");
        }
        else if(feel.equals("down"))
        {
            databaseReference.child(pos).child("feedback").child("feeling").setValue("down");
            t.setFeeling("down");
        }

        updateUI();
    }

    //private void updateMoodValues(int color)
    private void updateMoodValues(String mood)
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        databaseReference = database.getReference("mood_data").child(uid);

        //if (color == COLOR_GREEN)
        if (mood.equals(greenInfo))
        {
            final Context context = getContext();
            final int duration = Toast.LENGTH_SHORT;

            if (t.getMood().equals(yellowInfo))
            {
                yellowCount -= 1;
                Toast.makeText(context, "Yellow = "+yellowCount, duration).show();
                //databaseReference.child(yellowInfo).setValue(yellowCount);
            }

            if (t.getMood().equals(redInfo))
            {
                redCount -= 1;
                Toast.makeText(context, "Red = "+redCount, duration).show();
                //databaseReference.child(redInfo).setValue(redCount);
            }

            greenCount += 1;
            databaseReference.child(greenInfo).setValue(greenCount);

            String pos = Long.toString(mCurrentPosition);
            databaseReference.child(pos).child("mood").setValue(greenInfo);

            t.setMood(greenInfo);
        }
        //else if (color == COLOR_YELLOW)
        else if (mood.equals(yellowInfo))
        {
            final Context context = getContext();
            final int duration = Toast.LENGTH_SHORT;
            Toast.makeText(context, "Color = "+color, duration).show();

            if (t.getMood().equals(greenInfo))
            {
                greenCount -= 1;
                databaseReference.child(greenInfo).setValue(greenCount);
            }

            if (t.getMood().equals(redInfo))
            {
                redCount -= 1;
                databaseReference.child(redInfo).setValue(redCount);
            }

            yellowCount += 1;
            databaseReference.child(yellowInfo).setValue(yellowCount);

            String pos = Long.toString(mCurrentPosition);
            databaseReference.child(pos).child("mood").setValue(yellowInfo);

            t.setMood(yellowInfo);
        }
        //else if (color == COLOR_RED)
        else if (mood.equals(redInfo))
        {
            if (t.getMood().equals(greenInfo))
            {
                greenCount -= 1;
                databaseReference.child(greenInfo).setValue(greenCount);
            }

            if (t.getMood().equals(yellowInfo))
            {
                yellowCount -= 1;
                databaseReference.child(yellowInfo).setValue(yellowCount);
            }

            redCount += 1;
            databaseReference.child(redInfo).setValue(redCount);

            String pos = Long.toString(mCurrentPosition);
            databaseReference.child(pos).child("mood").setValue(redInfo);

            t.setMood(redInfo);
        }

        updateUI();
    }

    @Override
    public void onStart()
    {
        super.onStart();

        // During startup, check if there are arguments passed to the fragment.
        // onStart is a good place to do this because the layout has already been
        // applied to the fragment at this point so we can safely call the method
        // below that sets the article text.
        Bundle args = getArguments();
        if (args != null)
        {
            // Set item based on argument passed in
            updateItemView(args.getLong(ARG_POSITION));
        }
        else if (mCurrentPosition != -1)
        {
            // Set item based on saved instance state defined during onCreateView
            updateItemView(mCurrentPosition);
        }
    }

    public void updateItemView(long position)
    {
        mCurrentPosition = position;
        loadDatabaseData(position);
    }

    public void updateUI()
    {
        ColorStateList gray = ColorStateList.valueOf(getResources().getColor(R.color.gray));
        ColorStateList black = ColorStateList.valueOf(getResources().getColor(R.color.black));
        ColorStateList red = ColorStateList.valueOf(getResources().getColor(R.color.home_button_red));
        ColorStateList yellow = ColorStateList.valueOf(getResources().getColor(R.color.home_button_yellow));
        ColorStateList green = ColorStateList.valueOf(getResources().getColor(R.color.home_button_green));
        ColorStateList blue = ColorStateList.valueOf(getResources().getColor(R.color.blue));

        Log.i(TAG, "updateUI: "+t.getDate()+", "+t.getTime()+"h");
        String headerText = "Data from "+t.getDate()+", at "+t.getTime()+"h";

        header.setText(headerText);

        /* User input mood */
        if (t.getMood().equals(greenInfo))
        {
            btnGreen.setBackgroundTintList(green);
            btnYellow.setBackgroundTintList(black);
            btnRed.setBackgroundTintList(black);
        }
        if (t.getMood().equals(yellowInfo))
        {
            btnGreen.setBackgroundTintList(black);
            btnYellow.setBackgroundTintList(yellow);
            btnRed.setBackgroundTintList(black);
        }
        if (t.getMood().equals(redInfo))
        {
            btnGreen.setBackgroundTintList(black);
            btnYellow.setBackgroundTintList(black);
            btnRed.setBackgroundTintList(red);
        }

        /* User input sleep */
        if (t.getFeeling().equals("null"))
        {

            btnUp.setBackgroundTintList(gray);
            btnUncertain.setBackgroundTintList(gray);
            btnDown.setBackgroundTintList(gray);
        }
        else
        {
            if (t.getFeeling().equals("up"))
            {
                btnUp.setBackgroundTintList(blue);
                btnUncertain.setBackgroundTintList(black);
                btnDown.setBackgroundTintList(black);
            }
            if (t.getFeeling().equals("uncertain"))
            {
                btnUp.setBackgroundTintList(black);
                btnUncertain.setBackgroundTintList(blue);
                btnDown.setBackgroundTintList(black);
            }
            if (t.getFeeling().equals("down"))
            {
                btnUp.setBackgroundTintList(black);
                btnUncertain.setBackgroundTintList(black);
                btnDown.setBackgroundTintList(blue);
            }
        }

        if (!t.getNote().equals("null"))
        {
            feelingNote.setText(t.getNote());
        }

        /* Weather */
        //Picasso.with(getContext()).load(t.getIcon()).into(weatherIcon);
        if (t.getTemperature().equals("null") || t.getDescription().equals("null"))
        {
            weatherTemperature.setText("Temperature not available");
            weatherDescript.setText("Temperature description not available");
        }
        else
        {
            if (!t.getTemperature().equals("null"))
            {
                weatherTemperature.setText(t.getTemperature());
            }

            if (!t.getDescription().equals("null"))
            {
                weatherDescript.setText(t.getDescription());
            }
        }

        /* Location */
        if (!t.getLocation().equals("null"))
        {
            location.setText(t.getLocation());
        }
        else
        {
            location.setText("Location data not available");
        }

        /* Health */
        if (!t.getBpm().equals("null"))
        {
            bpm.setText(t.getBpm());
        }
        else
        {
            bpm.setText("BPM data not available");
        }

        if (!t.getSteps().equals("null"))
        {
            steps.setText("Steps: "+t.getSteps());
        }
        else
        {
            steps.setText("Step count not available");
        }

        /* Sleep */
        if (t.getDuration().equals("null") || t.getStart().equals("null") || t.getEnd().equals("null"))
        {
            sleep_duration.setText("Sleep data not available");
            sleep_start.setText("Sleep data not available");
            sleep_end.setText("Sleep data not available");
        }
        else
        {
            if (!t.getDuration().equals("null"))
            {
                sleep_duration.setText("Sleep session: "+t.getDuration());
            }

            if (!t.getStart().equals("null"))
            {
                sleep_start.setText("Fell asleep: "+t.getStart());
            }

            if (!t.getEnd().equals("null"))
            {
                sleep_end.setText("Wake up: "+t.getEnd());
            }
        }
    }

    /**
     * Loads timeline data from Firebase database
     */
    private void loadDatabaseData(final long position)
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        final Context context = getContext();
        final int duration = Toast.LENGTH_SHORT;

        databaseReference = database.getReference().child("mood_data").child(uid);

        databaseReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot)
            {
                for(DataSnapshot singleSnap : dataSnapshot.getChildren())
                {
                    String key = singleSnap.getKey(); // "id"

                    if(!key.equals("green") && !key.equals("red") && !key.equals("yellow"))
                    {
                        long id = Long.parseLong(key);

                        if(id == position)
                        {
                            Timeline entry = singleSnap.getValue(Timeline.class);

                            /* valores sem array*/
                            t.setMood(entry.mood);
                            t.setTime(entry.time);
                            t.setDate(entry.date);

                            /* array contexto */
                            DataSnapshot contextSnapshot = singleSnap.child("context");
                            entry = contextSnapshot.getValue(Timeline.class);
                            t.setLocation(entry.location);

                            /* array contexto: array health */
                            DataSnapshot healthSnapshot = contextSnapshot.child("health");
                            entry = healthSnapshot.getValue(Timeline.class);
                            t.setBpm(entry.bpm);
                            t.setSteps(entry.steps);

                            DataSnapshot sleepSnapshot = healthSnapshot.child("sleep");
                            entry = sleepSnapshot.getValue(Timeline.class);
                            //Toast.makeText(context, entry.duration, duration).show();
                            t.setDuration(entry.duration);
                            t.setStart(entry.start);
                            t.setEnd(entry.end);

                            /* array contexto: array weather */
                            DataSnapshot weatherSnapshot = contextSnapshot.child("weather");
                            entry = weatherSnapshot.getValue(Timeline.class);
                            //Toast.makeText(context, entry.description, duration).show();
                            t.setDescription(entry.description);
                            t.setTemperature(entry.temperature);

                            /* array feedback*/
                            DataSnapshot feedbackSnapshot = singleSnap.child("feedback");
                            entry = feedbackSnapshot.getValue(Timeline.class);
                            t.setNote(entry.note);
                            t.setFeeling(entry.feeling);
                        }
                    }
                    else
                    {
                        String value = singleSnap.getValue().toString();

                        if (key.equals(greenInfo))
                        {
                            greenCount = Integer.parseInt(value);
                        }
                        if (key.equals(yellowInfo))
                        {
                            yellowCount = Integer.parseInt(value);
                        }
                        if (key.equals(redInfo))
                        {
                            redCount = Integer.parseInt(value);
                        }
                    }
                }
                //Toast.makeText(context, "Data: " + t.getDate(), duration).show();
                Log.i(TimelineDetailFragment.this.toString(), "Successfully obtained data!");
                updateUI();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                Log.i(TimelineDetailFragment.this.toString(), "onCancelled", databaseError.toException());
            }
        });
    }

    @Override
    public void onSaveInstanceState(Bundle outState)
    {
        super.onSaveInstanceState(outState);

        // Save the current article selection in case we need to recreate the fragment
        outState.putLong(ARG_POSITION, mCurrentPosition);
    }

    @Override
    public void onAttach(Context context)
    {
        super.onAttach(context);
    }

    @Override
    public void onDetach()
    {
        super.onDetach();
    }
}
