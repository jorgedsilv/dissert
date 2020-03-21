package pt.ua.ieeta.urjourney.urjourney.profile;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Paint;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
//import android.support.v4.app.Fragment;
import android.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v4.graphics.drawable.RoundedBitmapDrawable;
import android.support.v4.graphics.drawable.RoundedBitmapDrawableFactory;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.charts.CandleStickChart;
import com.github.mikephil.charting.charts.PieChart;
import com.github.mikephil.charting.charts.ScatterChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.Description;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.data.CandleData;
import com.github.mikephil.charting.data.CandleDataSet;
import com.github.mikephil.charting.data.CandleEntry;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.PieData;
import com.github.mikephil.charting.data.PieDataSet;
import com.github.mikephil.charting.data.PieEntry;
import com.github.mikephil.charting.data.ScatterData;
import com.github.mikephil.charting.data.ScatterDataSet;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.listener.OnChartValueSelectedListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FileDownloadTask;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import pt.ua.ieeta.urjourney.urjourney.R;
import pt.ua.ieeta.urjourney.urjourney.history.Timeline;
import pt.ua.ieeta.urjourney.urjourney.loggin.LoginActivity;

import static android.app.Activity.RESULT_OK;

import com.github.mikephil.charting.utils.ColorTemplate;

public class ProfileFragment extends Fragment
{
    //private OnFragmentInteractionListener mListener;

    /* UI references */
    private TextView txtName;
    private ImageView pictureProfile;
    private FloatingActionButton pictureFAB;
    private Button btnLogout;
    private Button btnQuit;

    /* Model */
    private User u;

    /* Firebase references */
    private FirebaseAuth mAuth;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;
    private FirebaseStorage storage;
    private StorageReference storageReference;

    /* Picture references */
    private Uri picPath;
    private final int PICK_IMAGE_REQUEST = 71;

    /* Chart references */
    /* --mood */
    private PieChart pieChart;
    private List<PieEntry> entries;

    /* --bpm */
    private ScatterChart bpm_chart;
    private ArrayList<Entry> scatterEntries;
    private ArrayList<String> scatterEntriesLabels;
    private ScatterDataSet scatterDataSet;
    private ScatterData scatterData;
    private ArrayList<Integer> bpmEntries;
    private ArrayList<String> bpmEntriesInfo;

    /* --steps */
    private BarChart steps_chart;
    private ArrayList<BarEntry> barEntries;
    private ArrayList<String> barEntriesLabels;
    private BarDataSet barDataSet;
    private BarData barData;
    private ArrayList<Integer> stepsEntries;
    private ArrayList<String> stepsEntriesInfo;

    /* --sleep */
    private CandleStickChart sleep_chart;
    private ArrayList<CandleEntry> candleEntries;
    private ArrayList<String> candleEntriesLabels;
    private CandleDataSet candleDataSet;
    private CandleData candleData;
    private ArrayList<Float> sleepEntriesStart;
    private ArrayList<Float> sleepEntriesEnd;
    private ArrayList<String> sleepEntriesInfo;

    /* Green info init */
    private String greenInfo = "green";
    private int greenCount = 0;

    /* Yellow info init */
    private String yellowInfo = "yellow";
    private int yellowCount = 0;

    /* Red info init */
    private String redInfo = "red";
    private int redCount = 0;

    private Timeline t;
    private List<Timeline> timelineList;
    private List<Timeline> filteredTimelineList;
    private Spinner mSpinner;

    //private final Color color_red = ContextCompat.getColor(getContext(), R.color.home_button_red);


    public ProfileFragment() {
        // Required empty public constructor
    }

    public static ProfileFragment newInstance(String param1, String param2)
    {
        ProfileFragment fragment = new ProfileFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    /*@Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
    }*/

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
    {
        // Inflate the layout for this fragment

        mAuth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance();
        storage = FirebaseStorage.getInstance();

        View view = inflater.inflate(R.layout.fragment_profile, container, false);

        //--
        timelineList = new ArrayList<>();
        //--

        txtName = view.findViewById(R.id.user_name);
        pictureProfile = view.findViewById(R.id.profile_image);

        //change profile pic
        pictureFAB = view.findViewById(R.id.personal_info_picture_fab);

        pictureFAB.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                chooseImage();
            }
        });

        loadDatabaseData();
        loadStorageData();
        //loadMoodData();
        loadTimedData();

        bpmEntries = new ArrayList<>();
        bpmEntriesInfo = new ArrayList<>();

        stepsEntries = new ArrayList<>();
        stepsEntriesInfo = new ArrayList<>();

        sleepEntriesStart = new ArrayList<>();
        sleepEntriesEnd = new ArrayList<>();
        sleepEntriesInfo = new ArrayList<>();

        //--
        mSpinner = view.findViewById(R.id.spinner);

        List<String> spinnerArray = new ArrayList<>();
        spinnerArray.add("All");
        spinnerArray.add("Today");  //or day
        spinnerArray.add("Last 7 days");   //today -7 days
        spinnerArray.add("Month");  //present month

        ArrayAdapter<String> mSpinnerAdapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_dropdown_item, spinnerArray);
        mSpinner.setAdapter(mSpinnerAdapter);

        mSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener()
        {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int pos, long id)
            {
                if(pos > 0)
                {
                    // get spinner value
                    if(pos == 1) //Today
                    {
                        reset();

                        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                        Date today = new Date(System.currentTimeMillis());
                        String strToday = sdf.format(today);

                        //Toast.makeText(getContext(), "Today = "+strToday, Toast.LENGTH_SHORT).show();

                        for(int i = 0; i < timelineList.size(); i++)
                        {
                            Timeline timeline = timelineList.get(i);

                            String timelineDate = timeline.getDate();

                            String timelineTime = timeline.getTime();

                            if (timelineDate.equals(strToday))
                            {
                                //filteredTimelineList.add(timeline);

                                String timelineMood = timeline.getMood();

                                if (timelineMood.equals(greenInfo))
                                {
                                    greenCount += 1;
                                }
                                if (timelineMood.equals(yellowInfo))
                                {
                                    yellowCount += 1;
                                }
                                if (timelineMood.equals(redInfo))
                                {
                                    redCount += 1;
                                }

                                String timelineBpm = timeline.getBpm();
                                String timelineSteps = timeline.getSteps();
                                String timelineSleepStart = timeline.getStart();
                                String timelineSleepEnd = timeline.getEnd();
                                String timelineSleepDuration = timeline.getDuration();

                                if(!timelineBpm.equals("null"))
                                {
                                    //int bpm = Integer.parseInt(timelineBpm);
                                    float fBpm = Float.parseFloat(timelineBpm);
                                    int bpm = (int) fBpm;

                                    //substring(int beginIndex, int endIndex)
                                    //dd/mm/aaaa
                                    String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                    Log.i("Today BPM", ": minimalDate : "+minimalDate);

                                    String info = minimalDate + " " + timelineTime;
                                    bpmEntriesInfo.add(info);
                                    bpmEntries.add(bpm);
                                    Log.i("Today BPM", ": bpmEntries"+stepsEntries);
                                }

                                if(!timelineSteps.equals("null"))
                                {
                                    int steps = Integer.parseInt(timelineSteps);

                                    //substring(int beginIndex, int endIndex)
                                    //dd/mm/aaaa
                                    String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                    Log.i("Today Steps", ": minimalDate : "+minimalDate);

                                    String info = minimalDate + " " + timelineTime;
                                    stepsEntriesInfo.add(info);

                                    stepsEntries.add(steps);
                                    Log.i("Today Steps", ": stepsEntries"+stepsEntries);
                                }

                                if(!timelineSleepStart.equals("null") && !timelineSleepEnd.equals("null") && !timelineSleepDuration.equals("null"))
                                {
                                    /*Log.i("All Sleep", "SleepData: "+"Full date: "+timelineDate+", "+timelineTime+
                                            ":\n\tSleep Start: " +timelineSleepStart+
                                            "\n\tSleep End: "+timelineSleepEnd+
                                            "\n\tSleep Duration: "+timelineSleepDuration);*/

                                    float start = Float.parseFloat(timelineSleepStart.replace(":","."));
                                    sleepEntriesStart.add(start);
                                    Log.i("Today Sleep Start", ": sleepEntriesStart"+sleepEntriesStart);

                                    float end = Float.parseFloat(timelineSleepEnd.replace(":","."));
                                    sleepEntriesEnd.add(end);
                                    Log.i("Today Sleep End", ": sleepEntriesEnd"+sleepEntriesEnd);

                                    //substring(int beginIndex, int endIndex)
                                    //dd/mm/aaaa
                                    String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                    Log.i("Today Sleep", ": minimalDate : "+minimalDate);

                                    String info = minimalDate + " " + timelineTime;
                                    sleepEntriesInfo.add(info);
                                }

                            }
                        }

                        drawMoodChart();
                        drawStepsChart();
                        drawBpmChart();
                        drawSleepChart();
                    }

                    if(pos == 2) //Week
                    {
                        reset();

                        /*
                        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                        Date today = new Date(System.currentTimeMillis());
                        String strToday = sdf.format(today);

                        Calendar cal = Calendar.getInstance();
                        cal.add(Calendar.DATE, -7);

                        Date lastWeekDay = cal.getTime();
                        String strLastWeek = sdf.format(lastWeekDay);

                        today = null;
                        try
                        {
                            today = sdf.parse(strToday);
                        }
                        catch (ParseException ex)
                        {
                            Log.d("ProfileFrag:Last 7 days", "ParseException (today)");
                        }

                        lastWeekDay = null;
                        try
                        {
                            lastWeekDay = sdf.parse(strLastWeek);
                        }
                        catch (ParseException ex)
                        {
                            Log.d("ProfileFrag:Last 7 days", "ParseException (lastWeek)");
                        }

                        for(int i = 0; i < timelineList.size(); i++)
                        {
                            Timeline timeline = timelineList.get(i);

                            String timelineDate = timeline.getDate();

                            Date tlDate = null;

                            try
                            {
                                tlDate = sdf.parse(timelineDate);
                            }
                            catch (ParseException ex)
                            {
                                Log.d("ProfileFrag:Last 7 days", "ParseException (timelineDate)");
                            }

                            if(tlDate != null && today != null && lastWeekDay != null)
                            {
                                if ( (tlDate.before(today) ) && tlDate.after(lastWeekDay))
                                {
                                    //filteredTimelineList.add(timeline);

                                    String timelineMood = timeline.getMood();

                                    if (timelineMood.equals(greenInfo))
                                    {
                                        greenCount += 1;
                                    }
                                    if (timelineMood.equals(yellowInfo))
                                    {
                                        yellowCount += 1;
                                    }
                                    if (timelineMood.equals(redInfo))
                                    {
                                        redCount += 1;
                                    }
                                }
                            }
                        }*/

                        Calendar c = Calendar.getInstance();
                        Date today = c.getTime();
                        Log.d(" --> Today", ""+today);

                        c.add(Calendar.DATE, -7);
                        Date lastWeekDay = c.getTime();
                        Log.d(" --> Last 7 days", ""+lastWeekDay);

                        for(int i = 0; i < timelineList.size(); i++)
                        {
                            Timeline timeline = timelineList.get(i);

                            String timelineDate = timeline.getDate();
                            Log.d(" --> Timeline date", ""+timelineDate);

                            //dd/mm/yyyy
                            String[] parts = timelineDate.split("/");

                            //Date convertedDate = new Date(parts[2], parts[1], parts[0]);
                            c.set(Calendar.DATE, Integer.parseInt(parts[0]));
                            c.set(Calendar.MONTH, Integer.parseInt(parts[1])-1);
                            c.set(Calendar.YEAR, Integer.parseInt(parts[2]));

                            Date tlDate = c.getTime();

                            if(tlDate != null && today != null && lastWeekDay != null)
                            {
                                if ( ( (tlDate.before(today)) || (tlDate.equals(today)) ) && (tlDate.after(lastWeekDay)) )
                                {
                                    String timelineMood = timeline.getMood();

                                    if (timelineMood.equals(greenInfo))
                                    {
                                        greenCount += 1;
                                    }
                                    if (timelineMood.equals(yellowInfo))
                                    {
                                        yellowCount += 1;
                                    }
                                    if (timelineMood.equals(redInfo))
                                    {
                                        redCount += 1;
                                    }

                                    String timelineTime = timeline.getTime();

                                    String timelineBpm = timeline.getBpm();
                                    String timelineSteps = timeline.getSteps();
                                    String timelineSleepStart = timeline.getStart();
                                    String timelineSleepEnd = timeline.getEnd();
                                    String timelineSleepDuration = timeline.getDuration();

                                    if(!timelineBpm.equals("null"))
                                    {
                                        float fBpm = Float.parseFloat(timelineBpm);
                                        int bpm = (int) fBpm;
                                        //int bpm = Integer.parseInt(timelineBpm);

                                        //substring(int beginIndex, int endIndex)
                                        //dd/mm/aaaa
                                        String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                        Log.i("Last 7days BPM ", ": minimalDate : "+minimalDate);

                                        String info = minimalDate + " " + timelineTime;
                                        bpmEntriesInfo.add(info);
                                        bpmEntries.add(bpm);
                                        Log.i("Last 7days BPM ", ": bpmEntries"+stepsEntries);
                                    }

                                    if(!timelineSteps.equals("null"))
                                    {
                                        int steps = Integer.parseInt(timelineSteps);

                                        //substring(int beginIndex, int endIndex)
                                        //dd/mm/aaaa
                                        String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                        Log.i("Last 7days Steps", ": minimalDate : "+minimalDate);

                                        String info = minimalDate + " " + timelineTime;
                                        stepsEntriesInfo.add(info);

                                        stepsEntries.add(steps);
                                        Log.i("Last 7days Steps", ": stepsEntries"+stepsEntries);
                                    }

                                    if(!timelineSleepStart.equals("null") && !timelineSleepEnd.equals("null") && !timelineSleepDuration.equals("null"))
                                    {
                                        /*Log.i("All Sleep", "SleepData: "+"Full date: "+timelineDate+", "+timelineTime+
                                                ":\n\tSleep Start: " +timelineSleepStart+
                                                "\n\tSleep End: "+timelineSleepEnd+
                                                "\n\tSleep Duration: "+timelineSleepDuration);*/

                                        float start = Float.parseFloat(timelineSleepStart.replace(":","."));
                                        sleepEntriesStart.add(start);
                                        Log.i("All Sleep Start", ": sleepEntriesStart"+sleepEntriesStart);

                                        float end = Float.parseFloat(timelineSleepEnd.replace(":","."));
                                        sleepEntriesEnd.add(end);
                                        Log.i("Last 7days Sleep End", ": sleepEntriesEnd"+sleepEntriesEnd);

                                        //substring(int beginIndex, int endIndex)
                                        //dd/mm/aaaa
                                        String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                        Log.i("Last 7days Sleep", ": minimalDate : "+minimalDate);

                                        String info = minimalDate + " " + timelineTime;
                                        sleepEntriesInfo.add(info);
                                    }
                                }
                            }
                        }

                        drawMoodChart();
                        drawStepsChart();
                        drawBpmChart();
                        drawSleepChart();
                    }

                    if(pos == 3)//Month
                    {
                        reset();

                        SimpleDateFormat sdf = new SimpleDateFormat("MM/yyyy");
                        Date today = new Date(System.currentTimeMillis());
                        String strToday = sdf.format(today);

                        //Toast.makeText(getContext(), "Today = "+strToday, Toast.LENGTH_SHORT).show();

                        for(int i = 0; i < timelineList.size(); i++)
                        {
                            Timeline timeline = timelineList.get(i);

                            String timelineDate = timeline.getDate();
                            String timelineDateMonth = timelineDate.substring(3);

                            if (timelineDateMonth.equals(strToday))
                            {
                                //filteredTimelineList.add(timeline);

                                String timelineMood = timeline.getMood();

                                if (timelineMood.equals(greenInfo))
                                {
                                    greenCount += 1;
                                }
                                if (timelineMood.equals(yellowInfo))
                                {
                                    yellowCount += 1;
                                }
                                if (timelineMood.equals(redInfo))
                                {
                                    redCount += 1;
                                }

                                String timelineTime = timeline.getTime();

                                String timelineBpm = timeline.getBpm();
                                String timelineSteps = timeline.getSteps();
                                String timelineSleepStart = timeline.getStart();
                                String timelineSleepEnd = timeline.getEnd();
                                String timelineSleepDuration = timeline.getDuration();

                                if(!timelineBpm.equals("null"))
                                {
                                    float fBpm = Float.parseFloat(timelineBpm);
                                    int bpm = (int) fBpm;
                                    //int bpm = Integer.parseInt(timelineBpm);

                                    //substring(int beginIndex, int endIndex)
                                    //dd/mm/aaaa
                                    String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                    Log.i("Month BPM", ": minimalDate : "+minimalDate);

                                    String info = minimalDate + " " + timelineTime;
                                    bpmEntriesInfo.add(info);
                                    bpmEntries.add(bpm);
                                    Log.i("Month BPM ", ": bpmEntries"+stepsEntries);
                                }

                                if(!timelineSteps.equals("null"))
                                {
                                    int steps = Integer.parseInt(timelineSteps);

                                    //substring(int beginIndex, int endIndex)
                                    //dd/mm/aaaa
                                    String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                    Log.i("Month Steps", ": minimalDate : "+minimalDate);

                                    String info = minimalDate + " " + timelineTime;
                                    stepsEntriesInfo.add(info);

                                    stepsEntries.add(steps);
                                    Log.i("Month Steps", ": stepsEntries"+stepsEntries);
                                }

                                if(!timelineSleepStart.equals("null") && !timelineSleepEnd.equals("null") && !timelineSleepDuration.equals("null"))
                                {
                                    /*Log.i("All Sleep", "SleepData: "+"Full date: "+timelineDate+", "+timelineTime+
                                            ":\n\tSleep Start: " +timelineSleepStart+
                                            "\n\tSleep End: "+timelineSleepEnd+
                                            "\n\tSleep Duration: "+timelineSleepDuration);*/

                                    float start = Float.parseFloat(timelineSleepStart.replace(":","."));
                                    sleepEntriesStart.add(start);
                                    Log.i("Month Sleep Start", ": sleepEntriesStart"+sleepEntriesStart);

                                    float end = Float.parseFloat(timelineSleepEnd.replace(":","."));
                                    sleepEntriesEnd.add(end);
                                    Log.i("Month Sleep End", ": sleepEntriesEnd"+sleepEntriesEnd);

                                    //substring(int beginIndex, int endIndex)
                                    //dd/mm/aaaa
                                    String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                                    Log.i("Month Sleep", ": minimalDate : "+minimalDate);

                                    String info = minimalDate + " " + timelineTime;
                                    sleepEntriesInfo.add(info);
                                }

                            }
                        }

                        drawMoodChart();
                        drawStepsChart();
                        drawBpmChart();
                        drawSleepChart();
                    }
                }
                else
                {
                    reset();

                    // show all
                    for(int i = 0; i < timelineList.size(); i++)
                    {
                        Timeline timeline = timelineList.get(i);

                        String timelineMood = timeline.getMood();

                        if (timelineMood.equals(greenInfo))
                        {
                            greenCount += 1;
                        }
                        if (timelineMood.equals(yellowInfo))
                        {
                            yellowCount += 1;
                        }
                        if (timelineMood.equals(redInfo))
                        {
                            redCount += 1;
                        }

                        String timelineDate = timeline.getDate();
                        String timelineTime = timeline.getTime();

                        String timelineBpm = timeline.getBpm();
                        String timelineSteps = timeline.getSteps();
                        String timelineSleepStart = timeline.getStart();
                        String timelineSleepEnd = timeline.getEnd();
                        String timelineSleepDuration = timeline.getDuration();

                        if(!timelineBpm.equals("null"))
                        {
                            float fBpm = Float.parseFloat(timelineBpm);
                            int bpm = (int) fBpm;
                            //int bpm = Integer.parseInt(timelineBpm);

                            //substring(int beginIndex, int endIndex)
                            //dd/mm/aaaa
                            String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                            Log.i("All BPM", ": minimalDate : "+minimalDate);

                            String info = minimalDate + " " + timelineTime;
                            bpmEntriesInfo.add(info);
                            bpmEntries.add(bpm);
                            Log.i("All BPM ", ": bpmEntries"+stepsEntries);
                        }

                        if(!timelineSteps.equals("null"))
                        {
                            int steps = Integer.parseInt(timelineSteps);

                            //substring(int beginIndex, int endIndex)
                            //dd/mm/aaaa
                            String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                            Log.i("All Steps", ": minimalDate : "+minimalDate);

                            String info = minimalDate + " " + timelineTime;
                            stepsEntriesInfo.add(info);

                            stepsEntries.add(steps);
                            Log.i("All Steps", ": stepsEntries"+stepsEntries);
                        }

                        if(!timelineSleepStart.equals("null") && !timelineSleepEnd.equals("null") && !timelineSleepDuration.equals("null"))
                        {
                            /*Log.i("All Sleep", "SleepData: "+"Full date: "+timelineDate+", "+timelineTime+
                                    ":\n\tSleep Start: " +timelineSleepStart+
                                    "\n\tSleep End: "+timelineSleepEnd+
                                    "\n\tSleep Duration: "+timelineSleepDuration);*/

                            float start = Float.parseFloat(timelineSleepStart.replace(":","."));
                            sleepEntriesStart.add(start);
                            Log.i("All Sleep Start", ": sleepEntriesStart"+sleepEntriesStart);

                            float end = Float.parseFloat(timelineSleepEnd.replace(":","."));
                            sleepEntriesEnd.add(end);
                            Log.i("All Sleep End", ": sleepEntriesEnd"+sleepEntriesEnd);

                            //substring(int beginIndex, int endIndex)
                            //dd/mm/aaaa
                            String minimalDate = timelineDate.substring(0, timelineDate.length() - 5);
                            Log.i("All Sleep", ": minimalDate : "+minimalDate);

                            String info = minimalDate + " " + timelineTime;
                            sleepEntriesInfo.add(info);
                        }

                    }

                    drawMoodChart();
                    drawStepsChart();
                    drawBpmChart();
                    drawSleepChart();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView)
            {
                //empty.. required by the method
            }
        });
        //--

        /* chart */
        pieChart = view.findViewById(R.id.chart);
        steps_chart = view.findViewById(R.id.steps_chart);
        bpm_chart =  view.findViewById(R.id.bpm_chart);
        sleep_chart = view.findViewById(R.id.sleep_chart);

        /* end chart */

        btnLogout = view.findViewById(R.id.logout_button);

        btnLogout.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                /*mAuth.signOut();

                startActivity(new Intent(getActivity(), LoginActivity.class)); //Go back to home page
                getActivity().finish();*/
                //logout();
                alertLogout();
            }
        });

        return view;
    }

    private void reset()
    {
        greenCount = 0;
        yellowCount = 0;
        redCount = 0;

        bpmEntriesInfo.clear();
        bpmEntries.clear();

        stepsEntries.clear();
        stepsEntriesInfo.clear();

        sleepEntriesStart.clear();
        sleepEntriesEnd.clear();
        sleepEntriesInfo.clear();
    }

    private void logout()
    {
        mAuth.signOut();

        Intent intent = new Intent(getActivity(), LoginActivity.class);

        startActivity(intent); //Go back to home page

        //getActivity().finish();
    }

    public void alertLogout()
    {
        AlertDialog.Builder logoutDialog = new AlertDialog.Builder(getActivity());

        // Setting Dialog Title
        logoutDialog.setTitle(getResources().getString(R.string.title_fragment_logout));

        // Setting Dialog Message
        logoutDialog.setMessage(getResources().getString(R.string.subtitle_fragment_logout));

        // Setting Positive "Yes" Btn
        logoutDialog.setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener()
        {
            public void onClick(DialogInterface dialog, int which)
            {
                // Write your code here to execute after dialog
                mAuth.signOut();

                Intent intent = new Intent(getActivity(), LoginActivity.class);

                startActivity(intent); //Go back to home page
            }
        });

        // Setting Negative "NO" Btn
        logoutDialog.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener()
        {
            public void onClick(DialogInterface dialog, int which)
            {
                // Write your code here to execute after dialog

                dialog.cancel();
            }
        });

        // Showing Alert Dialog
        logoutDialog.show();
    }

    /*
    @Override
    public void onViewCreated(View view, Bundle savedInstanceState)
    {

        getChildFragmentManager().beginTransaction()
                .replace(R.id.child_fragment_container, new ProfileSettingsFragment()).commit();

    }
    */

    /**
     * Selects a user profile image
     */
    private void chooseImage()
    {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_REQUEST);
    }

    /**
     * Updates the image view and makes it round
     */
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);

        if(requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK
                && data != null && data.getData() != null )
        {
            picPath = data.getData();
            try
            {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), picPath);

                //makeItRound
                RoundedBitmapDrawable mDrawable = RoundedBitmapDrawableFactory.create(getResources(), bitmap);
                mDrawable.setCircular(true);

                pictureProfile.setImageDrawable(mDrawable);
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }

            uploadStorageData();
        }
    }

    private void drawBpmChart()
    {
        bpm_chart.clear();

        if(bpmEntries.size() == 0)
        {
            bpm_chart.setNoDataText("No bpm data found. Chart can't be drawn");
        }
        else
        {
            scatterEntries = new ArrayList<>();
            scatterEntriesLabels = new ArrayList<>();

            for (int i = 0; i < bpmEntries.size(); i++) {
                int bpm = bpmEntries.get(i);

                Log.i("BPM Chart", "drawBpmChart : " + bpm);

                scatterEntries.add(new Entry(i, bpm));

                String info = bpmEntriesInfo.get(i);
                bpmEntriesInfo.add(info);
            }

            scatterDataSet = new ScatterDataSet(scatterEntries, "BPM");
            scatterDataSet.setColors(getResources().getColor(R.color.home_button_red));

            scatterData = new ScatterData(scatterDataSet);

            IAxisValueFormatter formatter = new IAxisValueFormatter() {

                @Override
                public String getFormattedValue(float value, AxisBase axis) {

                    String info = "";
                    try
                    {
                        int index = (int) value;

                        info = bpmEntriesInfo.get(index);
                        Log.i("BPM Chart", "bpmGetFormattedValue: "+"Index: "+index+", Label: "+info);

                        return info;
                    }
                    catch (Exception e)
                    {
                        Log.i("BPM Chart", "bpmGetFormattedValue: "+e.getMessage());
                        return info;
                    }
                }

            };

            XAxis xAxis = bpm_chart.getXAxis();
            xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
            xAxis.setGranularity(1f);
            xAxis.setValueFormatter(formatter);
            xAxis.setLabelRotationAngle(90);

            bpm_chart.setData(scatterData);

            bpm_chart.animateXY(1000, 1000);
            bpm_chart.invalidate();

            Legend legend = bpm_chart.getLegend();
            legend.setEnabled(true);

            Description description = bpm_chart.getDescription();
            description.setEnabled(false);
        }
    }

    private void drawStepsChart()
    {
        steps_chart.clear();

        if(stepsEntries.size() == 0)
        {
            steps_chart.setNoDataText("No steps data found. Chart can't be drawn");
        }
        else
        {
            barEntries = new ArrayList<>();
            barEntriesLabels = new ArrayList<String>();

            for (int i = 0; i < stepsEntries.size(); i++) {
                int steps = stepsEntries.get(i);

                barEntries.add(new BarEntry(i, steps));

                String info = stepsEntriesInfo.get(i);
                barEntriesLabels.add(info);

                Log.i("Steps Chart", "drawStepsChart : "+info+": "+ steps);
            }

            //showToast("Size: "+barEntriesLabels.size());

            IAxisValueFormatter formatter = new IAxisValueFormatter() {

                @Override
                public String getFormattedValue(float value, AxisBase axis) {

                    String info = "";
                    try
                    {
                        int index = (int) value;

                        info = barEntriesLabels.get(index);
                        Log.i("Steps Chart", "stepsGetFormattedValue: "+"Index: "+index+", Label: "+info);

                        return info;
                    }
                    catch (Exception e)
                    {
                        Log.i("Steps Chart", "stepsGetFormattedValue: "+e.getMessage());
                        return info;
                    }
                }

            };

            XAxis xAxis = steps_chart.getXAxis();
            xAxis.setGranularity(1f); // minimum axis-step (interval) is 1
            xAxis.setValueFormatter(formatter);
            xAxis.setLabelRotationAngle(90);
            xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);

            barDataSet = new BarDataSet(barEntries, "Steps");

            barDataSet.setColors(getResources().getColor(R.color.steps_chart_color));

            barData = new BarData(barDataSet);
            barData.setBarWidth(0.9f); // set custom bar width

            steps_chart.setData(barData);
            steps_chart.setFitBars(true); // make the x-axis fit exactly all bars
            steps_chart.invalidate(); // refresh

            steps_chart.animateXY(1000, 1000);

            Legend legend = steps_chart.getLegend();
            legend.setEnabled(true);

            Description description = steps_chart.getDescription();
            description.setEnabled(false);
        }
    }

    private void drawSleepChart()
    {
        sleep_chart.clear();

        if(sleepEntriesStart.size() == 0)
        {
            sleep_chart.setNoDataText("No sleep data found. Chart can't be drawn");
        }
        else
        {
            candleEntries = new ArrayList<>();
            candleEntriesLabels = new ArrayList<>();

            for (int i = 0; i < sleepEntriesStart.size(); i++)
            {
                float start = sleepEntriesStart.get(i);
                float end = sleepEntriesEnd.get(i);

                //candleEntries.add(new CandleEntry(i, start, end, start, end));
                candleEntries.add(new CandleEntry(i, end, start, start, end));

                String info = sleepEntriesInfo.get(i);
                candleEntriesLabels.add(info);

                Log.i("Sleep Chart", "drawSleepChart : " + info + ": " + start + ", " + end);
            }

            candleDataSet = new CandleDataSet(candleEntries, "Sleep");

            candleDataSet.setColor(Color.rgb(80, 80, 80));

            candleDataSet.setDecreasingColor(getResources().getColor(R.color.blue));
            candleDataSet.setDecreasingPaintStyle(Paint.Style.FILL);
            candleDataSet.setIncreasingColor(getResources().getColor(R.color.blue));
            candleDataSet.setIncreasingPaintStyle(Paint.Style.FILL);
            candleDataSet.setNeutralColor(getResources().getColor(R.color.blue));

            IAxisValueFormatter formatter = new IAxisValueFormatter() {

                @Override
                public String getFormattedValue(float value, AxisBase axis) {
                    try {
                        int index = (int) value;
                        return candleEntriesLabels.get(index);
                    } catch (Exception e) {
                        return "";
                    }
                }

            };

            XAxis xAxis = sleep_chart.getXAxis();
            xAxis.setGranularity(1f); // minimum axis-step (interval) is 1
            xAxis.setValueFormatter(formatter);
            xAxis.setLabelRotationAngle(90);
            xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);

            candleDataSet.setDrawValues(false);

            candleData = new CandleData(candleDataSet);

            sleep_chart.setData(candleData);
            sleep_chart.invalidate();
            sleep_chart.animateXY(1000, 1000);

            Legend legend = sleep_chart.getLegend();
            legend.setEnabled(true);

            Description description = sleep_chart.getDescription();
            description.setEnabled(false);

            /*sleep_chart.setOnChartValueSelectedListener(new OnChartValueSelectedListener() {
                @Override
                public void onValueSelected(Entry e, Highlight h)
                {
                    float x = e.getX();
                    float y = e.getY();

                    //Log.i("Sleep Chart", "onValueSelected: "+"X: "+x+"Y: "+y);
                    //Log.i("Sleep Chart", "onValueSelected: "+"Highlight: "+h);
                    Log.i("Sleep Chart", "onValueSelected: "+"Entry: "+e);
                }

                @Override
                public void onNothingSelected() {

                }
            });*/
        }

        //candleDataSet.setShadowColor(getResources().getColor(R.color.blue));
        //candleDataSet.setShadowWidth(0.8f);
        //candleDataSet.setDecreasingColor(getResources().getColor(R.color.home_button_red));
        //candleDataSet.setDecreasingPaintStyle(Paint.Style.FILL);
        //candleDataSet.setIncreasingColor(getResources().getColor(R.color.colorAccent));
        //candleDataSet.setIncreasingPaintStyle(Paint.Style.FILL);
        //candleDataSet.setNeutralColor(Color.LTGRAY);
    }

    private void drawMoodChart()
    {
        pieChart.clear();

        if (greenCount == 0 && yellowCount == 0 && redCount == 0)
        {
            pieChart.setNoDataText("No mood data found. Chart can't be drawn");
        }
        else
        {
            entries = new ArrayList<>();

            entries.add(new PieEntry(greenCount, "Good"));
            entries.add(new PieEntry(yellowCount, "Neutral"));
            entries.add(new PieEntry(redCount, "Bad"));

            PieDataSet set = new PieDataSet(entries, "Mood type");
            set.setColors(getResources().getColor(R.color.home_button_green),
                    getResources().getColor(R.color.home_button_yellow),
                    getResources().getColor(R.color.home_button_red));

            /*set.setColors(ContextCompat.getColor(getContext(), R.color.home_button_green),
                    ContextCompat.getColor(getContext(), R.color.home_button_yellow),
                    ContextCompat.getColor(getContext(), R.color.home_button_red));*/

            set.setValueTextSize(12);

            PieData data = new PieData(set);
            pieChart.setData(data);

            pieChart.setCenterText("Mood");
            pieChart.setCenterTextSize(16);
            pieChart.setUsePercentValues(true);
            pieChart.setDrawEntryLabels(false);

            pieChart.invalidate(); // refresh
            pieChart.animateXY(1000, 1000);

            Legend legend = pieChart.getLegend();
            legend.setEnabled(true);

            Description description = pieChart.getDescription();
            description.setEnabled(false);
            //description.setText("Moods");
        }
    }

    private void loadTimedData()
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        final Context context = getContext();
        final int duration = Toast.LENGTH_SHORT;

        timelineList.clear();

        databaseReference = database.getReference().child("mood_data").child(uid);

        databaseReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot)
            {
                for(DataSnapshot singleSnap : dataSnapshot.getChildren()) //a fazer loop pelos "AAAAMMMDDhhmmss"
                {
                    String key = singleSnap.getKey(); // "id"

                    if(!key.equals("green") && !key.equals("red") && !key.equals("yellow"))
                    {
                        t = new Timeline();
                        Timeline entry = singleSnap.getValue(Timeline.class);

                        long id = Long.parseLong(key);
                        //Toast.makeText(context, id+"", duration).show();
                        t.setId(id);

                        /* valores sem array*/
                        t.setMood(entry.mood);
                        t.setTime(entry.time);
                        t.setDate(entry.date);

                        /* array contexto */
                        DataSnapshot contextSnapshot = singleSnap.child("context");
                        //entry = contextSnapshot.getValue(Timeline.class);
                        //t.setLocation(entry.location);

                        /* array contexto: array health */
                        DataSnapshot healthSnapshot = contextSnapshot.child("health");
                        entry = healthSnapshot.getValue(Timeline.class);
                        t.setBpm(entry.bpm);

                        //Log.i("loadTimedData", "onDataChange: "+"Date: "+t.getDate()+", "+entry.bpm);

                        t.setSteps(entry.steps);

                        DataSnapshot sleepSnapshot = healthSnapshot.child("sleep");
                        entry = sleepSnapshot.getValue(Timeline.class);
                        //Toast.makeText(context, entry.duration, duration).show();
                        t.setDuration(entry.duration);
                        t.setStart(entry.start);
                        t.setEnd(entry.end);

                        Log.i("loadTimedData", "onDataChange: "+"Date: "+t.getDate()+":\n\tSleep Start: "+entry.start+"\n\tSleep End: "+entry.end+"\n\tSleep Duration: "+entry.duration);

                        /* adicionar à lista */
                        timelineList.add(t);
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                Log.e(ProfileFragment.this.toString(), "onCancelled", databaseError.toException());
            }
        });
    }

    /**
     * Loads personal data from Firebase database
     */
    private void loadDatabaseData()
    {
        FirebaseUser user = mAuth.getCurrentUser();
        final String uid = user.getUid();

        databaseReference = database.getReference().child("personal_data").child(uid);

        databaseReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot)
            {
                u = new User();
                User entry = dataSnapshot.getValue(User.class);

                txtName.setText(entry.fname);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                Log.e(ProfileFragment.this.toString(), "onCancelled", databaseError.toException());
            }
        });
    }

    /**
     * Uploads user profile image to Firebase storage
     */
    private void uploadStorageData()
    {
        final Context context = getContext();
        final int duration = Toast.LENGTH_SHORT;

        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        storageReference = storage.getReference();

        if(picPath != null)
        {
            StorageReference imgProf = storageReference.child("profile_images/"+uid);

            imgProf.putFile(picPath)
                    .addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>()
                    {
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                            //progressDialog.dismiss();
                            //Toast.makeText(context, "Uploaded", duration).show();
                        }
                    })
                    .addOnFailureListener(new OnFailureListener()
                    {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            //progressDialog.dismiss();
                            Toast.makeText(context, "Failed "+e.getMessage(), duration).show();
                        }
                    });
        }
    }

    /**
     * Loads profile image from Firebase storage
     */
    private void loadStorageData()
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        storageReference = storage.getReference();

        StorageReference imgProf = storageReference.child("profile_images/"+uid);

        try
        {
            final File localFile = File.createTempFile("images", "jpg");

            imgProf.getFile(localFile).addOnSuccessListener(new OnSuccessListener<FileDownloadTask.TaskSnapshot>()
            {
                @Override
                public void onSuccess(FileDownloadTask.TaskSnapshot taskSnapshot)
                {
                    Bitmap bitmap = BitmapFactory.decodeFile(localFile.getAbsolutePath());

                    //makeItRound
                    RoundedBitmapDrawable mDrawable = RoundedBitmapDrawableFactory.create(getResources(), bitmap);
                    mDrawable.setCircular(true);

                    pictureProfile.setImageDrawable(mDrawable);

                }
            }).addOnFailureListener(new OnFailureListener()
            {
                @Override
                public void onFailure(@NonNull Exception e)
                {
                    //Toast.makeText(context, "Failed "+e.getMessage(), duration).show();
                }
            });
        }
        catch (IOException e )
        {
            e.printStackTrace();
        }
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
