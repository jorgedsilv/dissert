package pt.ua.ieeta.urjourney.urjourney;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Geocoder;
import android.location.Location;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
//import android.support.v4.app.Fragment;
import android.app.Fragment;
import android.os.Handler;
import android.os.ResultReceiver;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.constraint.ConstraintLayout;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
//import com.google.android.gms.awareness.Awareness;
//import com.google.android.gms.awareness.snapshot.WeatherResponse;
//import com.google.android.gms.awareness.state.Weather;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.FitnessActivities;
import com.google.android.gms.fitness.FitnessOptions;
import com.google.android.gms.fitness.data.Bucket;
import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataSet;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;
import com.google.android.gms.fitness.data.Session;
import com.google.android.gms.fitness.request.DataReadRequest;
import com.google.android.gms.fitness.request.SessionReadRequest;
import com.google.android.gms.fitness.result.DataReadResponse;
import com.google.android.gms.fitness.result.SessionReadResponse;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import pt.ua.ieeta.urjourney.urjourney.addr.Constants;
import pt.ua.ieeta.urjourney.urjourney.addr.FetchAddressIntentService;

import static java.text.DateFormat.getDateInstance;
import static java.text.DateFormat.getTimeInstance;

//OpenWeatherMap
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;
import org.json.JSONObject;

import cz.msebera.android.httpclient.Header;


public class HomeFragment extends Fragment
{
    /* Button Green info init */
    private ImageButton btnGreen;
    private String greenInfo = "green";
    private static int greenCount = 0;

    /* Button Yellow info init */
    private ImageButton btnYellow;
    private String yellowInfo = "yellow";
    private static int yellowCount = 0;

    /* Button Red info init */
    private ImageButton btnRed;
    private String redInfo = "red";
    private static int redCount = 0;

    private TextView detailsView;

    private int color;
    private final int COLOR_GREEN = 1;
    private final int COLOR_YELLOW = 2;
    private final int COLOR_RED = 3;

    /* Location info */
    private static final String TAG = "HomeFragment";

    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

    private static final String ADDRESS_REQUESTED_KEY = "address-request-pending";
    private static final String LOCATION_ADDRESS_KEY = "location-address";

    private FusedLocationProviderClient mFusedLocationClient;

    private Location mLastLocation;

    private boolean mAddressRequested;

    private String mAddressOutput;

    private AddressResultReceiver mResultReceiver;

    private View snackbarContainer;

    /* Weather */
    Meteo.placeIdTask meteoTask;
    private static String myTemperature = "null";
    private static String myDescription = "null";
    //private static String icon;
    private final String WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather";
    private final String API_KEY = "adc4db327e2aca6d7a1a4b17680ea4c2";

    /* Google Fit */
    private static final int REQUEST_OAUTH_REQUEST_CODE = 1;
    private static String bpm = "null";
    private static String steps = "null";
    private static String sleep_duration = "null";
    private static String sleep_start = "null";
    private static String sleep_end = "null";

    /* Firebase references */
    private FirebaseAuth mAuth;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;

    public HomeFragment() {
        // Required empty public constructor
    }

    public static HomeFragment newInstance(String param1, String param2)
    {
        HomeFragment fragment = new HomeFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
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
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        meteoTask = new Meteo.placeIdTask(new Meteo.AsyncResponse()
        {
            @Override
            public void processFinish(String description, String temperature)
            {
                Log.i(TAG, "processFinish: Description = "+description);
                Log.i(TAG, "processFinish: Temperature = "+temperature);

                myTemperature = temperature;
                myDescription = description;
            }
        });

        /* Firebase */
        mAuth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance();

        detailsView = view.findViewById(R.id.detailsView);

        //initCounters();

        btnGreen = view.findViewById(R.id.btnGreen);
        btnYellow = view.findViewById(R.id.btnYellow);
        btnRed = view.findViewById(R.id.btnRed);

        snackbarContainer = view.findViewById(android.R.id.content);

        mResultReceiver = new AddressResultReceiver(new Handler());

        btnGreen.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                color = COLOR_GREEN;
                greenCount += 1;
                fetchAddressButtonHandler(v);
            }
        });

        btnYellow.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                color = COLOR_YELLOW;
                yellowCount += 1;
                fetchAddressButtonHandler(v);
            }
        });

        btnRed.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                //btnRed.setLayoutParams(new ConstraintLayout.LayoutParams(50,50));

                /*
                ViewGroup.LayoutParams params = btnRed.getLayoutParams();
                params.height += 10;
                params.width += 10;

                btnRed.setLayoutParams(params);
                */

                //ConstraintLayout.LayoutParams lp = (ConstraintLayout.LayoutParams) btnRed.getLayoutParams();
                //lp.height = lp.height * 2;
                //lp.width = lp.width * 2;
                /*
                lp.leftMargin = 8;      //android:layout_marginLeft="8dp"
                lp.topMargin = 60;      //android:layout_marginTop="60dp"
                lp.rightMargin = 60;    //android:layout_marginRight="60dp"

                //android:layout_marginStart="8dp"
                lp.setMarginStart(lp.getMarginStart());

                //android:layout_marginEnd="60dp"
                lp.setMarginEnd(lp.getMarginEnd());

                lp.endToEnd = 0;        //app:layout_constraintEnd_toEndOf="parent"
                lp.startToStart = 0;    //app:layout_constraintStart_toStartOf="parent"
                */
                //lp.topToBottom;

                //btnRed.setLayoutParams(lp);

                /*

        app:layout_constraintHorizontal_bias="1.0"

        app:layout_constraintTop_toBottomOf="@+id/btnYellow"
                */

                color = COLOR_RED;
                redCount += 1;

                /*ConstraintLayout.LayoutParams lp = (ConstraintLayout.LayoutParams) btnRed.getLayoutParams();

                int h = lp.height;
                int w = lp.width;

                int total = greenCount + yellowCount + redCount;
                int pRed = (int) Math.round((redCount * 100.2f) / total);

                int newH = h * pRed + h;
                int newW = w * pRed + w;

                lp.height = newH;
                lp.width = newW;

                btnRed.setLayoutParams(lp);*/

                fetchAddressButtonHandler(v);
            }
        });

        // Set defaults, then update using values stored in the Bundle.
        mAddressRequested = false;
        //mAddressOutput = "";
        updateValuesFromBundle(savedInstanceState);

        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getContext());

        return view;
    }

    private void initCounters()
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        databaseReference = database.getReference().child("mood_data").child(uid);

        databaseReference.addValueEventListener(new ValueEventListener()
        {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot)
            {
                for(DataSnapshot singleSnap : dataSnapshot.getChildren())
                {
                    String key = singleSnap.getKey();
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
                textuallyInfo();
                Log.i(HomeFragment.this.toString(), "Successfully read counters data!");
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                Log.i(HomeFragment.this.toString(), "onCancelled", databaseError.toException());
            }
        });
    }

    private void updateCounters()
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        databaseReference = database.getReference("mood_data").child(uid);

        if (color == COLOR_GREEN)
        {
            databaseReference.child(greenInfo).setValue(greenCount);
        }
        else if (color == COLOR_YELLOW)
        {
            databaseReference.child(yellowInfo).setValue(yellowCount);
        }
        else if (color == COLOR_RED)
        {
            databaseReference.child(redInfo).setValue(redCount);
        }
        //textuallyInfo();
    }

    private void textuallyInfo()
    {
        int total = greenCount + yellowCount + redCount;
        //showToast(total+"");
        int pRed = (int)Math.round((redCount * 100.2f) / total);
        int pYellow = (int)Math.round((yellowCount * 100.2f) / total);
        int pGreen = (int)Math.round((greenCount * 100.2f) / total);

        String g = Integer.toString(pGreen)+"%" + " " + getString(R.string.home_textually_mood_green);
        Spannable sG =  new SpannableString(g);
        sG.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.home_button_green)), 0, g.indexOf("%")+1,Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        String y = Integer.toString(pYellow)+"%" + " " + getString(R.string.home_textually_mood_yellow);
        Spannable sY =  new SpannableString(y);
        sY.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.home_button_yellow)), 0, y.indexOf("%")+1,Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        String r = Integer.toString(pRed)+"%" + " " + getString(R.string.home_textually_mood_red);
        Spannable sR = new SpannableString(r);
        sR.setSpan(new ForegroundColorSpan(getResources().getColor(R.color.home_button_red)), 0, r.indexOf("%")+1,Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        detailsView.setText(sG);
        detailsView.append(", ");
        detailsView.append(sY);
        detailsView.append(" and ");
        detailsView.append(sR);

        /*int largest = Math.max(pRed, Math.max(pGreen, pYellow));
        int smallest = Math.min(pRed, Math.max(pGreen, pYellow));

        if(largest == pRed && smallest == pGreen)
        {
            moodView1.setText(sR + " " + getString(R.string.home_textually_mood_red));
            moodView1.setTextColor(getResources().getColor(R.color.home_button_red));

            moodView2.setText(sY +" "+ getString(R.string.home_textually_mood_yellow));
            moodView2.setTextColor(getResources().getColor(R.color.home_button_yellow));

            moodView3.setText(sG + " "+getString(R.string.home_textually_mood_green));
            moodView3.setTextColor(getResources().getColor(R.color.home_button_green));

        }
        else if(largest == pRed && smallest == pYellow)
        {
            moodView1.setText(sR + " " + getString(R.string.home_textually_mood_red));
            moodView2.setText(sG + " "+getString(R.string.home_textually_mood_green));
            moodView3.setText(sY +" "+ getString(R.string.home_textually_mood_yellow));
        }

        if(largest == pGreen && smallest == pYellow)
        {
            moodView1.setText(sG + " "+getString(R.string.home_textually_mood_green));
            moodView2.setText(sR + " " + getString(R.string.home_textually_mood_red));
            moodView3.setText(sY +" "+ getString(R.string.home_textually_mood_yellow));
        }
        else if(largest == pGreen && smallest == pRed)
        {
            moodView1.setText(sG + " "+getString(R.string.home_textually_mood_green));
            moodView1.setTextColor(getResources().getColor(R.color.home_button_green));

            moodView2.setText(sY +" "+ getString(R.string.home_textually_mood_yellow));
            moodView2.setTextColor(getResources().getColor(R.color.home_button_yellow));

            moodView3.setText(sR + " " + getString(R.string.home_textually_mood_red));
            moodView3.setTextColor(getResources().getColor(R.color.home_button_red));
        }

        if(largest == pYellow && smallest == pRed)
        {
            moodView1.setText(sY +" "+ getString(R.string.home_textually_mood_yellow));
            moodView2.setText(sG + " "+getString(R.string.home_textually_mood_green));
            moodView3.setText(sR + " " + getString(R.string.home_textually_mood_red));
        }
        else if(largest == pYellow && smallest == pGreen)
        {
            moodView1.setText(sY +" "+ getString(R.string.home_textually_mood_yellow));
            moodView2.setText(sR + " " + getString(R.string.home_textually_mood_red));
            moodView3.setText(sG + " "+getString(R.string.home_textually_mood_green));
        }*/
    }

    /** Launches the Google SignIn activity to request OAuth permission for the user. */
    private void requestOAuthPermission()
    {
        FitnessOptions fitnessOptions =
                FitnessOptions.builder()
                        .addDataType(DataType.TYPE_HEART_RATE_BPM, FitnessOptions.ACCESS_READ)
                        .addDataType(DataType.TYPE_STEP_COUNT_DELTA, FitnessOptions.ACCESS_READ)
                        .addDataType(DataType.TYPE_ACTIVITY_SEGMENT, FitnessOptions.ACCESS_READ)
                        .build();

        if (!GoogleSignIn.hasPermissions(GoogleSignIn.getLastSignedInAccount(getActivity()), fitnessOptions))
        {
            GoogleSignIn.requestPermissions(
                    getActivity(),
                    REQUEST_OAUTH_REQUEST_CODE,
                    GoogleSignIn.getLastSignedInAccount(getActivity()),
                    fitnessOptions);
        }
        else
        {
            readGoogleFitData();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        if (resultCode == Activity.RESULT_OK)
        {
            if (requestCode == REQUEST_OAUTH_REQUEST_CODE)
            {
                readGoogleFitData();
            }
        }
    }

    /**
     * Reads Google Fit data
     */
    private void readGoogleFitData()
    {
        readStepHistoryData();
        readBPMHistoryData();
        readSleepHistoryData();
    }

    /**
     * Asynchronous task to read the Step history data. When the task succeeds, it will print out the data.
     */
    private Task<DataReadResponse> readStepHistoryData()
    {
        final String tag = "StepHistory";

        // Begin by creating the query.
        Calendar cal = Calendar.getInstance();
        Date now = new Date();

        cal.setTime(now);
        long endTime = cal.getTimeInMillis();

        cal.add(Calendar.WEEK_OF_YEAR, -1);
        long startTime = cal.getTimeInMillis();

        DataReadRequest readRequest = new DataReadRequest.Builder()
                .aggregate(DataType.TYPE_STEP_COUNT_DELTA, DataType.AGGREGATE_STEP_COUNT_DELTA)
                .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
                .bucketByTime(1, TimeUnit.DAYS)
                .build();

        Context cont = getActivity();

        // Invoke the History API to fetch the data with the query
        return Fitness.getHistoryClient(cont, GoogleSignIn.getLastSignedInAccount(cont))
                .readData(readRequest)
                .addOnSuccessListener(new OnSuccessListener<DataReadResponse>()
                {
                    @Override
                    public void onSuccess(DataReadResponse dataReadResponse)
                    {
                        //DataSet dataSet = dataReadResponse.getDataSet(DataType.TYPE_STEP_COUNT_DELTA);
                        Log.i(tag, "Reading STEPS data success!");
                        printData(dataReadResponse, tag);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e)
                    {
                        steps = "null";
                        Log.i(tag, "There was a problem reading STEPS data", e);
                    }
                });

    }

    /**
     * Asynchronous task to read the BPM history data. When the task succeeds, it will print out the data.
     */
    private Task<DataReadResponse> readBPMHistoryData()
    {
        final String tag = "BPMHistory";

        // Begin by creating the query.
        Calendar cal = Calendar.getInstance();
        Date now = new Date();

        cal.setTime(now);
        long endTime = cal.getTimeInMillis();

        cal.set(Calendar.HOUR_OF_DAY, 0);
        long startTime = cal.getTimeInMillis();

        DataReadRequest readRequest = new DataReadRequest.Builder()
                .read(DataType.TYPE_HEART_RATE_BPM)
                .enableServerQueries()
                .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
                .build();

        // Invoke the History API to fetch the data with the query
        return Fitness.getHistoryClient(getActivity(), GoogleSignIn.getLastSignedInAccount(getActivity()))
                .readData(readRequest)
                .addOnSuccessListener(new OnSuccessListener<DataReadResponse>()
                {
                    @Override
                    public void onSuccess(DataReadResponse dataReadResponse)
                    {
                        //DataSet dataSet = dataReadResponse.getDataSet(DataType.TYPE_HEART_RATE_BPM);
                        Log.i(tag, "Reading BPM data success!");
                        printData(dataReadResponse, tag);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e)
                    {
                        bpm = "null";
                        Log.i(tag, "There was a problem reading BPM data.");
                    }
                });
    }

    /**
     *  Creates and executes a {@link SessionReadRequest} using {@link
     *  com.google.android.gms.fitness.SessionsClient} to read sleep data .
     */
    private Task<SessionReadResponse> readSleepHistoryData()
    {
        final String tag = "SleepHistory";

        // Begin by creating the query.
        Calendar cal = Calendar.getInstance();
        Date now = new Date();

        cal.setTime(now);
        long endTime = cal.getTimeInMillis();

        cal.add(Calendar.WEEK_OF_YEAR, -1);
        long startTime = cal.getTimeInMillis();

        // Build a session read request
        SessionReadRequest readRequest = new SessionReadRequest.Builder()
                .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
                .read(DataType.TYPE_ACTIVITY_SEGMENT)
                .readSessionsFromAllApps()
                .enableServerQueries()
                .build();

        // Invoke the Sessions API to fetch the session with the query and wait for the result of the read request.
        return Fitness.getSessionsClient(getActivity(), GoogleSignIn.getLastSignedInAccount(getActivity()))
                .readSession(readRequest)
                .addOnSuccessListener(new OnSuccessListener<SessionReadResponse>()
                {
                    @Override
                    public void onSuccess(SessionReadResponse sessionReadResponse)
                    {
                        // Get a list of the sessions that match the criteria to check the result.
                        List<Session> sessions = sessionReadResponse.getSessions();
                        //Log.i(tag, "Session read was successful. Number of returned sessions is: " + sessions.size());

                        for (Session session : sessions)
                        {
                            if(session.getActivity() == FitnessActivities.SLEEP)
                            {
                                Date start = new Date(session.getStartTime(TimeUnit.MILLISECONDS));
                                Date end = new Date(session.getEndTime(TimeUnit.MILLISECONDS));

                                // obtain start time as 24h and hh:mm
                                String strStart = String.format("%tR", start);

                                // obtain end time as 24h and hh:mm
                                String strEnd = String.format("%tR", end);

                                // calculate how long sleep lasted
                                long diff = end.getTime() - start.getTime();

                                final long secondsInMilli = 1000;
                                final long minutesInMilli = secondsInMilli * 60;
                                final long hoursInMilli = minutesInMilli * 60;

                                long elapsedHours = diff / hoursInMilli;
                                diff = diff % hoursInMilli;

                                long elapsedMinutes = diff / minutesInMilli;
                                diff = diff % minutesInMilli;
                                //Log.d(tag, "\tduration:" + elapsedHours+":"+elapsedMinutes);

                                sleep_start = strStart;
                                sleep_end = strEnd;
                                sleep_duration = elapsedHours+"h. "+elapsedMinutes+"m.";
                            }
                        }
                    }
                })
                .addOnFailureListener(new OnFailureListener()
                {
                    @Override
                    public void onFailure(@NonNull Exception e)
                    {
                        Log.i(tag, "Failed to read sleep session");
                        sleep_start = "null";
                        sleep_end = "null";
                        sleep_duration = "null";
                    }
                });
    }

    /**
     * Logs a record of the query result.
     * @param dataReadResult
     * @param tag
     */
    public static void printData(DataReadResponse dataReadResult, String tag)
    {
        /* If the DataReadRequest object specified aggregated data, dataReadResult will be returned
            as buckets containing DataSets, instead of just DataSets. */
        if (dataReadResult.getBuckets().size() > 0)
        {
            for (Bucket bucket : dataReadResult.getBuckets())
            {
                List<DataSet> dataSets = bucket.getDataSets();
                for (DataSet dataSet : dataSets)
                {
                    dumpDataSet(dataSet, tag);
                }
            }
        }
        else if (dataReadResult.getDataSets().size() > 0)
        {
            for (DataSet dataSet : dataReadResult.getDataSets())
            {
                dumpDataSet(dataSet, tag);
            }
        }
    }

    /**
     * Parses the dataset
     * @param dataSet
     * @param tag
     */
    private static void dumpDataSet(DataSet dataSet, String tag)
    {
        /*Log.i(tag, "Data returned for Data type: " + dataSet.getDataType().getName());
        DateFormat dateFormat = getDateInstance();
        DateFormat timeFormat = getTimeInstance();*/

        for (DataPoint dp : dataSet.getDataPoints())
        {
            /*Log.i(tag, "Data point:");
            Log.i(tag, "\tType: " + dp.getDataType().getName());
            Log.i(tag, "\tStart: " + dateFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)) + " " + timeFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)));
            Log.i(tag, "\tEnd: " + dateFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)) + " " + timeFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)));*/
            for(Field field : dp.getDataType().getFields())
            {
               // Log.i(tag, "\tField: " + field.getName() + " Value: " + dp.getValue(field));

                if (tag.equals("BPMHistory"))
                {
                    String info = dp.getValue(field).toString();
                    if(!info.equals("null"))
                    {
                        bpm = info;
                    }
                    else
                    {
                        bpm = "null";
                    }
                    //Log.i(tag, bpm);
                }

                if (tag.equals("StepHistory"))
                {
                    String info = dp.getValue(field).toString();
                    if(!info.equals("null"))
                    {
                        steps = info;
                    }
                    else
                    {
                        steps = "null";
                    }
                }
            }
        }
    }


    @Override
    public void onStart()
    {
        super.onStart();
        //showToast("I'm on onStart func");

        if (!checkPermissions())
        {
            requestPermissions();
            requestOAuthPermission();
        }
        else
        {
            getAddress();
            readGoogleFitData();
        }
        initCounters();
        //textuallyInfo();
        //Log.i("On Start", "started!");
    }

    /**
     * Updates fields based on data stored in the bundle.
     */
    private void updateValuesFromBundle(Bundle savedInstanceState)
    {
        if (savedInstanceState != null)
        {
            // Check savedInstanceState to see if the address was previously requested.
            if (savedInstanceState.keySet().contains(ADDRESS_REQUESTED_KEY))
            {
                mAddressRequested = savedInstanceState.getBoolean(ADDRESS_REQUESTED_KEY);
            }

            // Check savedInstanceState to see if the location address string was previously found
            // and stored in the Bundle. If it was found, display the address string in the UI.
            if (savedInstanceState.keySet().contains(LOCATION_ADDRESS_KEY))
            {
                mAddressOutput = savedInstanceState.getString(LOCATION_ADDRESS_KEY);

                /*
                String[] local = mAddressOutput.split(",");
                String cityName = local[0];

                getNewCityWeather(cityName);
                */

                String[] local = mAddressOutput.split(",");
                String cityName = local[0];

                Log.i(TAG, "updateValuesFromBundle: City name = "+cityName);

                meteoTask.execute(cityName);
            }
        }
    }

    /**
     * Runs when user clicks the Fetch Address button.
     */
    @SuppressWarnings("unused")
    public void fetchAddressButtonHandler(View view)
    {
        if (mLastLocation != null)
        {
            startIntentService();
            return;
        }

        // If we have not yet retrieved the user location, we process the user's request by setting
        // mAddressRequested to true. As far as the user is concerned, pressing the Fetch Address button
        // immediately kicks off the process of getting the address.
        mAddressRequested = true;
    }

    /**
     * Creates an intent, adds location data to it as an extra, and starts the intent service for
     * fetching an address.
     */
    private void startIntentService()
    {
        // Create an intent for passing to the intent service responsible for fetching the address.
        Intent intent = new Intent(getActivity(), FetchAddressIntentService.class);

        // Pass the result receiver as an extra to the service.
        intent.putExtra(Constants.RECEIVER, mResultReceiver);

        // Pass the location data as an extra to the service.
        intent.putExtra(Constants.LOCATION_DATA_EXTRA, mLastLocation);

        getActivity().startService(intent);
    }

    /**
     * Gets the address for the last known location.
     */
    @SuppressWarnings("MissingPermission")
    private void getAddress()
    {
        mFusedLocationClient.getLastLocation()
                .addOnSuccessListener(getActivity(), new OnSuccessListener<Location>()
                {
                    @Override
                    public void onSuccess(Location location)
                    {
                        if (location == null)
                        {
                            Log.i("getLastLocation", "Last Location is null");
                            mAddressOutput = "null";

                            myTemperature = "null";
                            myDescription = "null";
                        }
                        else if(location != null) {
                            Log.i("getLastLocation", "Last location is not null");
                            mLastLocation = location;

                            //Log.i("getLastLocation", ""+mLastLocation);
                        }

                        // Determine whether a Geocoder is available.
                        if (!Geocoder.isPresent())
                        {
                            showSnackbar(getString(R.string.no_geocoder_available));
                        }

                        // If the user pressed the fetch address button before we had the location,
                        // this will be set to true indicating that we should kick off the intent
                        // service after fetching the location.
                        if (mAddressRequested)
                        {
                            startIntentService();
                        }
                    }
                })
                .addOnFailureListener(getActivity(), new OnFailureListener()
                {
                    @Override
                    public void onFailure(@NonNull Exception e)
                    {
                        Log.i("getLastLocation", "Failed to get location - ", e);
                        mAddressOutput = "null";

                        myTemperature = "null";
                        myDescription = "null";
                    }
                });
    }

    /**
     * Updates the address in the UI and sends data to Firebase database
     */
    private void uploadFirebaseData()
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        Calendar calendar = Calendar.getInstance();
        Date date = calendar.getTime();

        textuallyInfo();
        updateCounters();

        String year = (String) android.text.format.DateFormat.format("yyyy", date);
        String month = (String) android.text.format.DateFormat.format("MM", date);
        String day = (String) android.text.format.DateFormat.format("dd", date);
        String hour = (String) android.text.format.DateFormat.format("HH", date);
        String minute = (String) android.text.format.DateFormat.format("mm", date);
        String second = (String) android.text.format.DateFormat.format("ss", date);

        final String timeComplete = year+month+day+hour+minute+second;
        final String readableDate = day + "/"+ month + "/" + year;
        final String readableTime = hour + ":" + minute;

        //showToast(readableDate +", "+readableTime);

        databaseReference = database.getReference("mood_data").child(uid).child(timeComplete);

        if (color == COLOR_GREEN)
        {
            databaseReference.child("mood").setValue(greenInfo);
        }
        else if (color == COLOR_YELLOW)
        {
            databaseReference.child("mood").setValue(yellowInfo);
        }
        else if (color == COLOR_RED)
        {
            databaseReference.child("mood").setValue(redInfo);
        }

        databaseReference.child("date").setValue(readableDate);
        databaseReference.child("time").setValue(readableTime);

        /* user feedback */
        databaseReference.child("feedback").child("feeling").setValue("null");
        databaseReference.child("feedback").child("note").setValue("null");
        // actividades do dia?

        /* contexto */
        if (mAddressOutput.equals("null"))
        {
            databaseReference.child("context").child("location").setValue("null");

            myTemperature = "null";
            myDescription = "null";
        }
        else
        {
            databaseReference.child("context").child("location").setValue(mAddressOutput);

            String[] local = mAddressOutput.split(",");
            String cityName = local[0];

            Log.i(TAG, "uploadFirebaseData: "+ cityName);

            meteoTask.execute(cityName);
        }

        /* actualizar se for possível ler valor do Google Fit */
        /*if(bpm.equals("null"))
        {
            Log.i("HomeFrag", "bpm empty");
            databaseReference.child("context").child("health").child("bpm").setValue("null");
        }
        else
        {
            Log.i("HomeFrag", "bpm not empty");
            databaseReference.child("context").child("health").child("bpm").setValue(bpm);
        }*/

        /*if(steps.equals("null"))
        {
            Log.i("HomeFrag", "steps empty");
            showToast("I'm on uploading and steps are null");
            //databaseReference.child("context").child("health").child("steps").setValue("null");
        }
        else
        {
            Log.i("HomeFrag", "steps not empty");
            showToast("I'm on uploading and steps are NOT null");
            //databaseReference.child("context").child("health").child("steps").setValue(steps);
        }*/

        databaseReference.child("context").child("health").child("bpm").setValue(bpm);
        databaseReference.child("context").child("health").child("steps").setValue(steps);
        databaseReference.child("context").child("health").child("sleep").child("start").setValue(sleep_start);
        databaseReference.child("context").child("health").child("sleep").child("end").setValue(sleep_end);
        databaseReference.child("context").child("health").child("sleep").child("duration").setValue(sleep_duration);

        if(myDescription != "null" && myTemperature != "null")
        {
            databaseReference.child("context").child("weather").child("temperature").setValue(myTemperature);
            databaseReference.child("context").child("weather").child("description").setValue(myDescription);
        }
        else if(myDescription == "null" || myTemperature == "null")
        {
            databaseReference.child("context").child("weather").child("temperature").setValue("null");
            databaseReference.child("context").child("weather").child("description").setValue("null");
        }

        /*
        String[] local = mAddressOutput.split(",");
        String cityName = local[0];

        getNewCityWeather(cityName);
        */

        /*
        if (ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED)
        {

            Awareness.getSnapshotClient(getActivity()).getWeather()
                    .addOnSuccessListener(new OnSuccessListener<WeatherResponse>()
                    {
                        @Override
                        public void onSuccess(WeatherResponse weatherResponse)
                        {
                            Weather weather = weatherResponse.getWeather();

                            String description = "null";
                            String temperature = "null";

                            switch (weather.getConditions()[0])
                            {
                                case Weather.CONDITION_CLEAR: description = "Clear weather";
                                    break;
                                case Weather.CONDITION_CLOUDY: description = "Cloudy weather";
                                    break;
                                case Weather.CONDITION_FOGGY: description = "Foggy weather";
                                    break;
                                case Weather.CONDITION_HAZY: description = "Hazy weather";
                                    break;
                                case Weather.CONDITION_ICY: description = "Icy weather";
                                    break;
                                case Weather.CONDITION_RAINY: description = "Rainy weather";
                                    break;
                                case Weather.CONDITION_SNOWY: description = "Snowy weather";
                                    break;
                                case Weather.CONDITION_STORMY: description = "Stormy weather";
                                    break;
                                case Weather.CONDITION_WINDY: description = "Windy weather";
                                    break;
                                case Weather.CONDITION_UNKNOWN: description = "Unknown weather";
                                    break;
                                default: description = "Unknown weather";
                                    break;
                            }

                            Float temp = weather.getTemperature(Weather.CELSIUS);
                            temperature = String.format("%.0f", temp)+"º";

                            databaseReference.child("context").child("weather").child("temperature").setValue(temperature);
                            databaseReference.child("context").child("weather").child("description").setValue(description);
                            Log.i("Weather", "Weather obtained successfully!");
                        }
                    })
                    .addOnFailureListener(new OnFailureListener()
                    {
                        @Override
                        public void onFailure(@NonNull Exception e)
                        {
                            databaseReference.child("context").child("weather").child("temperature").setValue("null");
                            databaseReference.child("context").child("weather").child("description").setValue("null");
                            Log.i("Weather", "Could not get weather: " + e);
                        }
                    });
        }
        else
        {
            databaseReference.child("context").child("weather").child("temperature").setValue("null");
            databaseReference.child("context").child("weather").child("description").setValue("null");
        }
        */


    }

    /*
    private void getNewCityWeather(String cityName)
    {
        RequestParams requestParams = new RequestParams();

        requestParams.put("q", cityName);
        requestParams.put("appid", API_KEY);

        apiCall(requestParams);
    }

    private void apiCall(RequestParams requestParams)
    {
        if (isConnected()) {

            AsyncHttpClient asyncHttpClient = new AsyncHttpClient();

            asyncHttpClient.get(WEATHER_URL, requestParams, new JsonHttpResponseHandler() {

                @Override
                public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                    super.onSuccess(statusCode, headers, response);

                    OpenWeatherMap weather = OpenWeatherMap.fromJson(response);
                    updateWeatherDetails(weather);
                }

                @Override
                public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                    super.onFailure(statusCode, headers, throwable, errorResponse);

                    //showToastLong("Error occurred while making request!");

                    updateWeatherDetails(null);
                }
            });

        } else {
            //Toast.makeText(this, "No internet connection! Try to connect to a working internet and try again", Toast.LENGTH_LONG).show();
            showToastLong("No internet connection! Try to connect to a working internet and try again");

            updateWeatherDetails(null);
        }
    }

    public boolean isConnected() {

        ConnectivityManager connectivityManager = (ConnectivityManager) getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);

        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();

        if (networkInfo != null && networkInfo.isConnected()) {

            return true;
        }

        return false;
    }

    private void updateWeatherDetails(OpenWeatherMap weather)
    {
        if (weather != null)
        {
            temperature = weather.getTemperature();
            description = weather.getDescript();
            showToast("Temp: "+temperature);
        }
        else
        {
            temperature = "null";
            description = "null";
            showToast("Temp: "+temperature);
        }
    }*/

    private void showToastLong(String text)
    {
        final Context context = getContext();
        final int duration = Toast.LENGTH_LONG;

        Toast.makeText(context, text, duration).show();
    }

    /**
     * Shows a toast with the given text.
     */
    private void showToast(String text)
    {
        final Context context = getContext();
        final int duration = Toast.LENGTH_SHORT;

        Toast.makeText(context, text, duration).show();
    }

    @Override
    public void onSaveInstanceState(Bundle savedInstanceState)
    {
        // Save whether the address has been requested.
        savedInstanceState.putBoolean(ADDRESS_REQUESTED_KEY, mAddressRequested);

        // Save the address string.
        savedInstanceState.putString(LOCATION_ADDRESS_KEY, mAddressOutput);
        super.onSaveInstanceState(savedInstanceState);
    }

    /**
     * Receiver for data sent from FetchAddressIntentService.
     */
    private class AddressResultReceiver extends ResultReceiver
    {
        AddressResultReceiver(Handler handler) {
            super(handler);
        }

        /**
         *  Receives data sent from FetchAddressIntentService and updates the UI in MainActivity.
         */
        @Override
        protected void onReceiveResult(int resultCode, Bundle resultData)
        {
            // Display the address string or an error message sent from the intent service.
            mAddressOutput = resultData.getString(Constants.RESULT_DATA_KEY);

            if(resultCode == Constants.FAILURE_RESULT || resultCode != Constants.SUCCESS_RESULT)
            {
                mAddressOutput = "null";

                myTemperature = "null";
                myDescription = "null";
            }

            /* get weather */
            /*String[] local = mAddressOutput.split(",");
            String cityName = local[0];

            getNewCityWeather(cityName);*/

            uploadFirebaseData();

            mAddressRequested = false;
        }
    }

    /**
     * Shows a {@link Snackbar} using {@code text}.
     *
     * @param text The Snackbar text.
     */
    private void showSnackbar(final String text)
    {
        //View container = findViewById(android.R.id.content);
        if (snackbarContainer != null)
        {
            Snackbar.make(snackbarContainer, text, Snackbar.LENGTH_LONG).show();
        }
    }

    /**
     * Shows a {@link Snackbar}.
     *
     * @param mainTextStringId The id for the string resource for the Snackbar text.
     * @param actionStringId   The text of the action item.
     * @param listener         The listener associated with the Snackbar action.
     */
    private void showSnackbar(final int mainTextStringId, final int actionStringId,
                              View.OnClickListener listener)
    {
        Snackbar.make(snackbarContainer,
                getString(mainTextStringId),
                Snackbar.LENGTH_INDEFINITE)
                .setAction(getString(actionStringId), listener).show();
    }

    /**
     * Return the current state of the permissions needed.
     */
    private boolean checkPermissions()
    {
        int permissionState = ActivityCompat.checkSelfPermission(getContext(),
                Manifest.permission.ACCESS_FINE_LOCATION);
        return permissionState == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissions()
    {
        boolean shouldProvideRationale =
                ActivityCompat.shouldShowRequestPermissionRationale(getActivity(),
                        Manifest.permission.ACCESS_FINE_LOCATION);

        // Provide an additional rationale to the user.
        if (shouldProvideRationale)
        {
            Log.i(TAG, "Displaying permission rationale to provide additional context.");

            showSnackbar(R.string.permission_rationale, android.R.string.ok,
                new View.OnClickListener()
                {
                    @Override
                    public void onClick(View view)
                    {
                        // Request permission
                        ActivityCompat.requestPermissions(getActivity(),
                                new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                                REQUEST_PERMISSIONS_REQUEST_CODE);
                    }
                });
        }
        else
        {
            Log.i(TAG, "Requesting permission");
            // Request permission.
            ActivityCompat.requestPermissions(getActivity(),
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    REQUEST_PERMISSIONS_REQUEST_CODE);
        }
    }

    /**
     * Callback received when a permissions request has been completed.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        Log.i(TAG, "onRequestPermissionResult");
        if (requestCode == REQUEST_PERMISSIONS_REQUEST_CODE)
        {
            if (grantResults.length <= 0)
            {
                // If user interaction was interrupted, the permission request is cancelled
                Log.i(TAG, "User interaction was cancelled.");
            }
            else if (grantResults[0] == PackageManager.PERMISSION_GRANTED)
            {
                // Permission granted.
                getAddress();
                //getWeatherSnapshot();
            }
            else
            {
                // Permission denied.
                // Notify the user via a SnackBar that they have rejected a core permission
                showSnackbar(R.string.permission_denied_explanation, R.string.settings,
                        new View.OnClickListener()
                        {
                            @Override
                            public void onClick(View view)
                            {
                                // Build intent that displays the App settings screen.
                                Intent intent = new Intent();
                                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                                Uri uri = Uri.fromParts("package", BuildConfig.APPLICATION_ID, null);
                                intent.setData(uri);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                startActivity(intent);
                            }
                        });
            }
        }
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

        greenCount = 0;
        yellowCount = 0;
        redCount = 0;
    }

    /*@Override
    public void onStop()
    {
        super.onStop();

        greenCount = 0;
        yellowCount = 0;
        redCount = 0;
    }*/
}
