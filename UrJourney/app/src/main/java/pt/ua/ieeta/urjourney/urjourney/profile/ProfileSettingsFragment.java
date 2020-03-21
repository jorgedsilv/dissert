package pt.ua.ieeta.urjourney.urjourney.profile;

import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.preference.EditTextPreference;
import android.preference.ListPreference;
import android.preference.Preference;
import android.preference.PreferenceFragment;
//import android.support.v4.app.Fragment;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.support.v7.app.AlertDialog;
import android.text.InputType;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import pt.ua.ieeta.urjourney.urjourney.R;

public class ProfileSettingsFragment extends PreferenceFragment
{
    /* Firebase references */
    private FirebaseAuth mAuth;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;

    /* Model */
    private User u;

    private final Context context = getContext();
    private final int duration = Toast.LENGTH_SHORT;

    private View snackbarContainer;

    public ProfileSettingsFragment()
    {
        // Required empty public constructor
    }

    public static ProfileSettingsFragment newInstance(String param1, String param2)
    {
        ProfileSettingsFragment fragment = new ProfileSettingsFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        addPreferencesFromResource(R.xml.preferences);

        mAuth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance();

        loadDatabaseData();

        // first name EditText change listener
        Preference firstName = findPreference(getString(R.string.pref_inner_account_title_first_name));
        bindPreferenceSummaryToValue(firstName);

        firstName.setOnPreferenceClickListener(new Preference.OnPreferenceClickListener()
        {
            @Override
            public boolean onPreferenceClick(Preference preference)
            {
                updateNames(getString(R.string.pref_inner_account_title_first_name));
                return true;
            }
        });

        // last name EditText change listener
        Preference lastName = findPreference(getString(R.string.pref_inner_account_title_last_name));
        bindPreferenceSummaryToValue(lastName);

        lastName.setOnPreferenceClickListener(new Preference.OnPreferenceClickListener()
        {
            @Override
            public boolean onPreferenceClick(Preference preference)
            {
                updateNames(getString(R.string.pref_inner_account_title_last_name));
                return true;
            }
        });

        Preference gender = findPreference(getString(R.string.pref_inner_account_title_gender));
        bindPreferenceSummaryToValue(gender);

        gender.setOnPreferenceClickListener(new Preference.OnPreferenceClickListener()
        {
            @Override
            public boolean onPreferenceClick(Preference preference)
            {
                updateGender();
                return true;
            }
        });

        // notification preference change listener
        //bindPreferenceSummaryToValue(findPreference("list_frequency_notifications"));
    }

    /**
     * Updates both Firebase and UI with new first name/last name
     * @param hint
     */
    private void updateNames(final String hint)
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        databaseReference = database.getReference().child("personal_data").child(uid);

        final AlertDialog.Builder dialog = new AlertDialog.Builder(getActivity());
        dialog.setTitle("Insert new "+hint.toLowerCase());

        final EditText txt = new EditText(getActivity());
        txt.setHint(hint);
        txt.setInputType(InputType.TYPE_TEXT_VARIATION_PERSON_NAME);

        dialog.setView(txt);

        dialog.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener()
        {
            @Override
            public void onClick(DialogInterface dialog, int which)
            {
                String newVal = txt.getText().toString().trim();

                if (!TextUtils.isEmpty(newVal))
                {
                    Preference pref = findPreference(hint);
                    pref.setSummary(newVal);

                    //updateFirebase
                    if (hint.equals(getString(R.string.pref_inner_account_title_first_name)))
                    {
                        databaseReference.child("fname").setValue(newVal);
                    }

                    if (hint.equals(getString(R.string.pref_inner_account_title_last_name)))
                    {
                        databaseReference.child("lname").setValue(newVal);
                    }
                }
            }
        });

        dialog.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener()
        {
            @Override
            public void onClick(DialogInterface dialog, int which)
            {
                dialog.dismiss();
            }
        });

        dialog.show();
    }

    private void updateGender()
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        databaseReference = database.getReference().child("personal_data").child(uid);

        final AlertDialog.Builder dialog = new AlertDialog.Builder(getActivity());
        dialog.setTitle("Choose gender");

        /*final EditText txt = new EditText(getActivity());
        txt.setHint("Touch to choose");
        txt.setInputType(InputType.TYPE_NULL);*/

        final Spinner sp = new Spinner(getActivity());

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getActivity(),
                R.array.gender_array, android.R.layout.simple_spinner_item);

        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

        sp.setAdapter(adapter);

        sp.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener()
        {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int pos, long id)
            {
                String item = parent.getItemAtPosition(pos).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView)
            {
                //empty
            }
        });

        dialog.setView(sp);

        /*dialog.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener()
        {
            @Override
            public void onClick(DialogInterface dialog, int which)
            {
                Toast.makeText(getContext(), "here", Toast.LENGTH_SHORT).show();



                Preference pref = findPreference(getString(R.string.pref_inner_account_title_gender));
                pref.setSummary(item);
                databaseReference.child("gender").setValue(item);
                //databaseReference.child("gender").setValue(newVal);
            }
        });*/

        dialog.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener()
        {
            @Override
            public void onClick(DialogInterface dialog, int which)
            {
                dialog.dismiss();
            }
        });

        dialog.show();
    }

    private static void bindPreferenceSummaryToValue(Preference preference)
    {
        preference.setOnPreferenceChangeListener(sBindPreferenceSummaryToValueListener);

        sBindPreferenceSummaryToValueListener.onPreferenceChange(preference,
                PreferenceManager
                        .getDefaultSharedPreferences(preference.getContext())
                        .getString(preference.getKey(), ""));
    }

    /**
     * A preference value change listener that updates the preference's summary
     * to reflect its new value.
     */
    private static Preference.OnPreferenceChangeListener sBindPreferenceSummaryToValueListener = new Preference.OnPreferenceChangeListener() {
        @Override
        public boolean onPreferenceChange(Preference preference, Object newValue) {
            String stringValue = newValue.toString();

            if (preference instanceof ListPreference)
            {
                // For list preferences, look up the correct display value in
                // the preference's 'entries' list.
                ListPreference listPreference = (ListPreference) preference;
                int index = listPreference.findIndexOfValue(stringValue);

                // Set the summary to reflect the new value.
                preference.setSummary(
                        index >= 0
                                ? listPreference.getEntries()[index]
                                : null);
            }
            else if (preference instanceof EditTextPreference)
            {
                if (preference.getKey().equals("First name"))
                {
                    preference.setSummary(stringValue);
                }
                if (preference.getKey().equals("Last name"))
                {
                    preference.setSummary(stringValue);
                }
            }
            else
            {
                preference.setSummary(stringValue);
            }
            return true;
        }
    };

    /**
     * Loads personal data from Firebase database
     */
    private void loadDatabaseData()
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        databaseReference = database.getReference().child("personal_data").child(uid);

        databaseReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot)
            {
                u = new User();
                User entry = dataSnapshot.getValue(User.class);

                u.setFname(entry.fname);
                u.setLname(entry.lname);
                u.setBirthday(entry.birthday);
                u.setEmail(entry.email);
                u.setGender(entry.gender);

                Preference prefFirstName = findPreference((getString(R.string.pref_inner_account_title_first_name)));
                prefFirstName.setSummary(u.getFname());

                Preference prefLastName = findPreference((getString(R.string.pref_inner_account_title_last_name)));
                prefLastName.setSummary(u.getLname());

                /* Update UI summary to reflect the email of user */
                Preference prefEmail = findPreference((getString(R.string.pref_inner_account_title_email)));
                prefEmail.setSummary(u.getEmail());

                /* Update UI summary to reflect the birthday of user */
                Preference prefBirthday = findPreference((getString(R.string.pref_inner_account_title_birthday)));
                prefBirthday.setSummary(u.getBirthday());

                /* Update UI summary to reflect the gender of user */
                Preference prefGender = findPreference((getString(R.string.pref_inner_account_title_gender)));
                prefGender.setSummary(u.getGender());
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                Log.e(ProfileSettingsFragment.this.toString(), "onCancelled", databaseError.toException());
            }
        });
    }

    /*@Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_profile_settings, container, false);
    }*/

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
