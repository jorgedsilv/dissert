package pt.example.mygooglefitapp;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.os.AsyncTask;
import android.service.autofill.Dataset;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.FitnessActivities;
import com.google.android.gms.fitness.FitnessOptions;
import com.google.android.gms.fitness.SessionsApi;
import com.google.android.gms.fitness.data.Bucket;
import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataSet;
import com.google.android.gms.fitness.data.DataSource;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;
import com.google.android.gms.fitness.data.Session;
import com.google.android.gms.fitness.data.Value;
import com.google.android.gms.fitness.request.DataReadRequest;
import com.google.android.gms.fitness.request.DataSourcesRequest;
import com.google.android.gms.fitness.request.OnDataPointListener;
import com.google.android.gms.fitness.request.SensorRequest;
import com.google.android.gms.fitness.request.SessionReadRequest;
import com.google.android.gms.fitness.result.DailyTotalResult;
import com.google.android.gms.fitness.result.DataReadResponse;
import com.google.android.gms.fitness.result.DataReadResult;
import com.google.android.gms.fitness.result.DataSourcesResult;
import com.google.android.gms.fitness.result.SessionReadResponse;
import com.google.android.gms.fitness.result.SessionReadResult;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static java.text.DateFormat.getDateInstance;
import static java.text.DateFormat.getTimeInstance;


public class MainActivity extends AppCompatActivity
{
    private static TextView heart;
    private static TextView step;
    private static TextView sleep1;
    private static TextView sleep2;
    private static TextView sleep3;

    private static final int REQUEST_OAUTH_REQUEST_CODE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        heart = findViewById(R.id.heart);
        step = findViewById(R.id.step);
        sleep1 = findViewById(R.id.sleep1);
        sleep2 = findViewById(R.id.sleep2);
        sleep3 = findViewById(R.id.sleep3);

        FitnessOptions fitnessOptions =
                FitnessOptions.builder()
                        .addDataType(DataType.TYPE_HEART_RATE_BPM, FitnessOptions.ACCESS_READ)
                        .addDataType(DataType.TYPE_STEP_COUNT_DELTA, FitnessOptions.ACCESS_READ)
                        .addDataType(DataType.TYPE_ACTIVITY_SEGMENT, FitnessOptions.ACCESS_READ)
                        .build();

        if (!GoogleSignIn.hasPermissions(GoogleSignIn.getLastSignedInAccount(this), fitnessOptions))
        {
            GoogleSignIn.requestPermissions(
                    this,
                    REQUEST_OAUTH_REQUEST_CODE,
                    GoogleSignIn.getLastSignedInAccount(this),
                    fitnessOptions);
        }
        else
        {
            readData();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        if (resultCode == Activity.RESULT_OK)
        {
            if (requestCode == REQUEST_OAUTH_REQUEST_CODE)
            {
                readData();
            }
        }
    }

    private void readData()
    {
        readBPMHistoryData();
        readStepHistoryData();
        readSleepHistoryData();
    }

    /**
     * Parses the dataset
     * @param dataSet
     * @param tag
     */
    private static void dumpDataSet(DataSet dataSet, String tag)
    {
        Log.i(tag, "Data returned for Data type: " + dataSet.getDataType().getName());
        DateFormat dateFormat = getDateInstance();
        DateFormat timeFormat = getTimeInstance();

        for (DataPoint dp : dataSet.getDataPoints())
        {
            Log.i(tag, "Data point:");
            Log.i(tag, "\tType: " + dp.getDataType().getName());
            Log.i(tag, "\tStart: " + dateFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)) + " " + timeFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)));
            Log.i(tag, "\tEnd: " + dateFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)) + " " + timeFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)));
            for(Field field : dp.getDataType().getFields())
            {
                Log.i(tag, "\tField: " + field.getName() + " Value: " + dp.getValue(field));

                if (tag.equals("BPMHistory"))
                {
                    String info = "BPM: " + dp.getValue(field).toString();
                    heart.setText(info);
                }

                if (tag.equals("StepHistory"))
                {
                    String info = "Steps: " + dp.getValue(field).toString();
                    step.setText(info);
                }
            }
        }
    }

    /**
     * Parses the session
     * @param session
     * @param tag
     */
    private void dumpSession(Session session, String tag)
    {
        DateFormat dateFormat = getTimeInstance();
        Log.i(tag, "Data returned for Session: " + session.getName()
                + "\n\tDescription: " + session.getDescription()
                + "\n\tStart: " + dateFormat.format(session.getStartTime(TimeUnit.MILLISECONDS))
                + "\n\tEnd: " + dateFormat.format(session.getEndTime(TimeUnit.MILLISECONDS)));
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
            Log.i(tag, "Number of returned buckets of DataSets is: " + dataReadResult.getBuckets().size());
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
            Log.i(tag, "Number of returned DataSets is: " + dataReadResult.getDataSets().size());
            for (DataSet dataSet : dataReadResult.getDataSets())
            {
                dumpDataSet(dataSet, tag);
            }
        }
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

        // Invoke the History API to fetch the data with the query
        return Fitness.getHistoryClient(this, GoogleSignIn.getLastSignedInAccount(this))
                .readData(readRequest)
                .addOnSuccessListener(new OnSuccessListener<DataReadResponse>()
                {
                    @Override
                    public void onSuccess(DataReadResponse dataReadResponse)
                    {
                        //DataSet dataSet = dataReadResponse.getDataSet(DataType.TYPE_STEP_COUNT_DELTA);
                        printData(dataReadResponse, tag);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e)
                    {
                        Log.i(tag, "There was a problem reading the data.", e);
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
        return Fitness.getHistoryClient(this, GoogleSignIn.getLastSignedInAccount(this))
                .readData(readRequest)
                .addOnSuccessListener(new OnSuccessListener<DataReadResponse>()
                {
                    @Override
                    public void onSuccess(DataReadResponse dataReadResponse)
                    {
                        //DataSet dataSet = dataReadResponse.getDataSet(DataType.TYPE_HEART_RATE_BPM);
                        printData(dataReadResponse, tag);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e)
                    {
                        Log.i(tag, "There was a problem reading the data.", e);
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

        //Log.i(tag, "--> Here <--");

        // Invoke the Sessions API to fetch the session with the query and wait for the result of the read request.
        return Fitness.getSessionsClient(this, GoogleSignIn.getLastSignedInAccount(this))
                .readSession(readRequest)
                .addOnSuccessListener(new OnSuccessListener<SessionReadResponse>()
                {
                    @Override
                    public void onSuccess(SessionReadResponse sessionReadResponse)
                    {
                        // Get a list of the sessions that match the criteria to check the result.
                        List<Session> sessions = sessionReadResponse.getSessions();
                        Log.i(tag, "Session read was successful. Number of returned sessions is: "
                                + sessions.size());

                        for (Session session : sessions)
                        {
                            if(session.getActivity() == FitnessActivities.SLEEP)
                            {
                                Date start = new Date(session.getStartTime(TimeUnit.MILLISECONDS));
                                Date end = new Date(session.getEndTime(TimeUnit.MILLISECONDS));
                                Log.d(tag, "Description: " + session.getDescription());
                                Log.d(tag, "Activity" + session.getActivity());
                                Log.d(tag, "\tstart: " + start);
                                Log.d(tag, "\tend: " + end);

                                String strStart = String.format("Start: %tR", start );
                                sleep1.setText(strStart);

                                String strEnd = String.format("End: %tR", end);
                                sleep2.setText(strEnd);

                                long diff = end.getTime() - start.getTime();

                                final long secondsInMilli = 1000;
                                final long minutesInMilli = secondsInMilli * 60;
                                final long hoursInMilli = minutesInMilli * 60;

                                long elapsedHours = diff / hoursInMilli;
                                diff = diff % hoursInMilli;

                                long elapsedMinutes = diff / minutesInMilli;
                                diff = diff % minutesInMilli;
                                Log.d(tag, "\tduration:" + elapsedHours+":"+elapsedMinutes);

                                sleep3.setText("Duration: "+elapsedHours+"h. "+elapsedMinutes+"m.");
                            }

                            /*List<DataSet> dataSets = sessionReadResponse.getDataSet(session);
                            for(DataSet dataSet : dataSets)
                            {
                                for(DataPoint dp : dataSet.getDataPoints())
                                {
                                    if(session.getActivity() == FitnessActivities.SLEEP) {
                                        Date beginSleepSession  = new Date(dp.getStartTime(TimeUnit.MILLISECONDS));
                                        Date endSleepSession  = new Date(dp.getEndTime(TimeUnit.MILLISECONDS));
                                        Log.d(tag, "--> SLEEP = "+beginSleepSession+". end = "+endSleepSession);
                                    }
                                    if(session.getActivity() == FitnessActivities.SLEEP_AWAKE) {
                                        Date lastSleepSession  = new Date(dp.getStartTime(TimeUnit.MILLISECONDS));
                                        Log.d(tag, "--> SLEEP_AWAKE = "+lastSleepSession);
                                    }
                                    if(session.getActivity() == FitnessActivities.SLEEP_DEEP) {
                                        Date lastSleepSession  = new Date(dp.getStartTime(TimeUnit.MILLISECONDS));
                                        Log.d(tag, "--> SLEEP_DEEP = "+lastSleepSession);
                                    }
                                    if(session.getActivity() == FitnessActivities.SLEEP_LIGHT) {
                                        Date lastSleepSession  = new Date(dp.getStartTime(TimeUnit.MILLISECONDS));
                                        Log.d(tag, "--> SLEEP_LIGHT = "+lastSleepSession);
                                    }
                                    if(session.getActivity() == FitnessActivities.SLEEP_REM) {
                                        Date lastSleepSession  = new Date(dp.getStartTime(TimeUnit.MILLISECONDS));
                                        Log.d(tag, "--> SLEEP_REM = "+lastSleepSession);
                                    }
                                }
                            }*/


                            // Process the session
                            //dumpSession(session, tag);



                            // Process the data sets for this session
                            //List<DataSet> dataSets = sessionReadResponse.getDataSet(session);
                            //for (DataSet dataSet : dataSets)
                            //{
                            //    dumpDataSet(dataSet, tag);
                                /*for (DataPoint dp : dataSet.getDataPoints())
                                {
                                    for(Field field : dp.getDataType().getFields())
                                    {
                                        String val = dp.getValue(field).toString();
                                        if (val.equals("72") ||
                                                val.equals("109") ||
                                                val.equals("110") ||
                                                val.equals("111") ||
                                                val.equals("112"))
                                        {
                                            Log.i(tag, "\tStart: " + dateFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)) + " " + timeFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)));
                                            Log.i(tag, "\tEnd: " + dateFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)) + " " + timeFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)));
                                            Log.i(tag, "\tField: "+ session. + " \t(Value = " + dp.getValue(field) +")\n");
                                        }
                                    }
                                }*/
                            //}
                        }
                    }
                })
                .addOnFailureListener(new OnFailureListener()
                {
                    @Override
                    public void onFailure(@NonNull Exception e)
                    {
                        Log.i(tag, "Failed to read session");
                    }
                });
    }

    /*private void sleepDataHistory()
    {
        Calendar cal = Calendar.getInstance();
        Date now = new Date();

        cal.setTime(now);
        long endTime = cal.getTimeInMillis();

        cal.add(Calendar.WEEK_OF_YEAR, -5);
        long startTime = cal.getTimeInMillis();

        java.text.DateFormat dateFormat = getDateInstance();
        Log.d("readSleepData", "Range Start: " + dateFormat.format(startTime));
        Log.d("readSleepData", "Range End: " + dateFormat.format(endTime));

        SessionReadRequest readRequest = new SessionReadRequest.Builder()
                .read(DataType.TYPE_ACTIVITY_SEGMENT)
                .readSessionsFromAllApps()
                .enableServerQueries()
                .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
                .build();

        // Invoke the Sessions API to fetch the session with the query and wait for the result
        // of the read request.
        SessionReadResult sessionReadResult =
                Fitness.SessionsApi.readSession(mGoogleApiClient, readRequest).await(120, TimeUnit.SECONDS);

        List<Session> sessions = sessionReadResult.getSessions();

        Log.i("Session", "Session read was successful. Number of returned sessions is: "
                + sessions.size());

        for (Session session : sessions)
        {
            // Process the session
            dumpSession(session, "SleepData");

            // Process the data sets for this session
            List<DataSet> dataSets = sessionReadResult.getDataSet(session);
            for (DataSet dataSet : dataSets)
            {
                showDataSet(dataSet, "SleepData");
            }
        }

        //Status status = sessionReadResult.getStatus();
    }*/
}
