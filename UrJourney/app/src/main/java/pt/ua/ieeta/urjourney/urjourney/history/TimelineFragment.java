package pt.ua.ieeta.urjourney.urjourney.history;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
//import android.support.v4.app.Fragment;
import android.app.Fragment;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import pt.ua.ieeta.urjourney.urjourney.R;


public class TimelineFragment extends Fragment
{
    OnTimelineItemSelectedListener mCallback;

    public void setOnTimelineItemSelectedListener(Activity activity) {
        mCallback = (OnTimelineItemSelectedListener) activity;
    }

    // Container Activity must implement this interface
    public interface OnTimelineItemSelectedListener
    {
        public void onItemSelected(long position);
    }

    private List<Timeline> timelineList;
    private List<Timeline> filteredTimelineList;

    private RecyclerView recyclerView;
    private TimelineAdapter mAdapter;
    private Timeline t;

    /* Firebase references */
    private FirebaseAuth mAuth;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;

    private Spinner mSpinner;

    public TimelineFragment()
    {
        // Required empty public constructor
    }

    public static TimelineFragment newInstance(String param1, String param2)
    {
        TimelineFragment fragment = new TimelineFragment();
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
        mAuth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance();

        View view = inflater.inflate(R.layout.fragment_timeline, container, false);

        recyclerView = view.findViewById(R.id.recycler_view);

        timelineList = new ArrayList<>();
        mAdapter = new TimelineAdapter(timelineList);

        //--
        filteredTimelineList = new ArrayList<>();
        //--

        recyclerView.setHasFixedSize(true);

        RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(getActivity());

        recyclerView.setLayoutManager(mLayoutManager);

        // adding inbuilt divider line
        recyclerView.addItemDecoration(new DividerItemDecoration(getActivity(), LinearLayoutManager.VERTICAL));

        recyclerView.setItemAnimator(new DefaultItemAnimator());

        /*
        recyclerView.setAdapter(mAdapter);
        */

        // row click listener
        recyclerView.addOnItemTouchListener(new RecyclerTouchListener(getActivity(), recyclerView, new RecyclerTouchListener.ClickListener()
        {
            @Override
            public void onClick(View view, int position)
            {
                Timeline tl = timelineList.get(position);

                mCallback.onItemSelected(tl.getId());
            }

            @Override
            public void onLongClick(View view, int position)
            {

            }
        }));

        loadDatabaseData();

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
                filteredTimelineList.clear();

                if(pos > 0)
                {
                    // get spinner value

                    if(pos == 1) //Today
                    {
                        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                        Date today = new Date(System.currentTimeMillis());
                        String strToday = sdf.format(today);

                        //Toast.makeText(getContext(), "Today = "+strToday, Toast.LENGTH_SHORT).show();

                        for(int i = 0; i < timelineList.size(); i++)
                        {
                            Timeline timeline = timelineList.get(i);

                            String timelineDate = timeline.getDate();

                            if (timelineDate.equals(strToday))
                            {
                                filteredTimelineList.add(timeline);
                            }
                        }

                        mAdapter = new TimelineAdapter(filteredTimelineList);
                        recyclerView.setAdapter(mAdapter);
                        mAdapter.notifyDataSetChanged();
                    }

                    if(pos == 2) //Week
                    {
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
                            Log.d(" --> Last 7 days", "ParseException (today)");
                        }

                        lastWeekDay = null;
                        try
                        {
                            lastWeekDay = sdf.parse(strLastWeek);
                        }
                        catch (ParseException ex)
                        {
                            Log.d(" --> Last 7 days", "ParseException (lastWeek)");
                        }

                        //showToast(lastWeekDay.toString());

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
                                Log.d(" --> Last 7 days", "ParseException (timelineDate)");
                            }

                            if(tlDate != null && today != null && lastWeekDay != null)
                            {
                                //showToast("Timeline date: "+tlDate.toString()+"\nToday date: "+today.toString()+"\nLast week date: "+lastWeekDay);

                                //dd/mm/yyyy
                                //var parts = date.split('/');

                                //construct date
                                //var convertedDate = new Date(parts[2], parts[1] - 1, parts[0]);

                                if (tlDate < today && tlDate > lastWeekDay)

                                //if ( (tlDate.before(today) ) && tlDate.after(lastWeekDay))
                                {

                                    filteredTimelineList.add(timeline);
                                }
                            }

                        }*/

                        /*
                        mAdapter = new TimelineAdapter(filteredTimelineList);
                        recyclerView.setAdapter(mAdapter);
                        mAdapter.notifyDataSetChanged();
                        */

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
                                    Log.d(" --> Filtered date", ""+tlDate);
                                    filteredTimelineList.add(timeline);
                                }
                            }
                        }

                        mAdapter = new TimelineAdapter(filteredTimelineList);
                        recyclerView.setAdapter(mAdapter);
                        mAdapter.notifyDataSetChanged();

                    }

                    if(pos == 3)//Month
                    {
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
                                filteredTimelineList.add(timeline);
                            }
                        }

                        mAdapter = new TimelineAdapter(filteredTimelineList);
                        recyclerView.setAdapter(mAdapter);
                        mAdapter.notifyDataSetChanged();
                    }
                }
                else
                {
                    // show all
                    mAdapter = new TimelineAdapter(timelineList);
                    recyclerView.setAdapter(mAdapter);
                    mAdapter.notifyDataSetChanged();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView)
            {
                //empty.. required by the method
            }
        });

        //--

        return view;
    }

    /**
     * Loads timeline data from Firebase database
     */
    private void loadDatabaseData()
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
                        //DataSnapshot contextSnapshot = singleSnap.child("context");
                        //entry = contextSnapshot.getValue(Timeline.class);
                        //t.setLocation(entry.location);

                        /* array contexto: array health */
                        //DataSnapshot healthSnapshot = contextSnapshot.child("health");
                        //entry = healthSnapshot.getValue(Timeline.class);
                        // bpm
                        // steps

                        /* array contexto: array weather */
                        //DataSnapshot weatherSnapshot = contextSnapshot.child("weather");
                        //entry = weatherSnapshot.getValue(Timeline.class);
                        //Toast.makeText(context, entry.description, duration).show();
                        // description
                        // temperature

                        /* array feedback*/
                        //DataSnapshot feedbackSnapshot = singleSnap.child("feedback");
                        //entry = feedbackSnapshot.getValue(Timeline.class);
                        //note
                        //feeling

                        /* adicionar à lista e notificar recycler */
                        timelineList.add(t);
                        mAdapter.notifyDataSetChanged();
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                Log.e(TimelineFragment.this.toString(), "onCancelled", databaseError.toException());
            }
        });
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
    public void onDetach() {
        super.onDetach();
    }
}
