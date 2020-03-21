package pt.ua.ieeta.urjourney.urjourney.loggin;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.DialogFragment;
import android.support.v4.graphics.drawable.RoundedBitmapDrawable;
import android.support.v4.graphics.drawable.RoundedBitmapDrawableFactory;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.InputType;
import android.text.TextUtils;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import pt.ua.ieeta.urjourney.urjourney.MainActivity;
import pt.ua.ieeta.urjourney.urjourney.R;
import pt.ua.ieeta.urjourney.urjourney.checkin.CheckinActivity;

public class PersonalInfoActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener
{
    /* UI references */
    private EditText inputFname;
    private EditText inputLname;
    private static EditText inputBirthday;
    private EditText inputGender;
    private Spinner genderSpinner;
    private FloatingActionButton completeFAB;
    private ImageView pictureProfile;
    private FloatingActionButton pictureFAB;

    /* Picture references */
    private Uri picPath;
    private final int PICK_IMAGE_REQUEST = 71;

    /* Firebase references */
    private FirebaseAuth mAuth;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;
    private FirebaseStorage storage;
    private StorageReference storageReference;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_personal_info);

        mAuth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance();
        storage = FirebaseStorage.getInstance();

        inputFname = findViewById(R.id.fname);
        inputLname = findViewById(R.id.lname);
        inputBirthday = findViewById(R.id.birthday);
        inputGender = findViewById(R.id.gender);

        inputBirthday.setInputType(InputType.TYPE_NULL);
        inputBirthday.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v) {
                showDatePicker(v);
            }
        });
        inputBirthday.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    showDatePicker(v);
                }
            }
        });

        genderSpinner = findViewById(R.id.gender_spinner);

        genderSpinner.setOnItemSelectedListener(this);

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.gender_array, android.R.layout.simple_spinner_item);

        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

        genderSpinner.setAdapter(adapter);

        pictureProfile = findViewById(R.id.profile_image);
        pictureFAB = findViewById(R.id.personal_info_picture_fab);
        pictureFAB.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                chooseImage();
            }
        });

        completeFAB = findViewById(R.id.complete_fab);
        //completeFAB.setImageResource(R.drawable.ic_check_white);
        completeFAB.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                String fname = inputFname.getText().toString().trim();
                String lname = inputLname.getText().toString().trim();
                String birth = inputBirthday.getText().toString().trim();
                String gender = inputGender.getText().toString().trim();

                Context context = getApplicationContext();
                int duration = Toast.LENGTH_SHORT;

                // Check for empty fields
                if (TextUtils.isEmpty(fname))
                {
                    Toast.makeText(context, getString(R.string.error_field_required), duration).show();
                    return;
                }
                if (TextUtils.isEmpty(lname))
                {
                    Toast.makeText(context, getString(R.string.error_field_required), duration).show();
                    return;
                }
                if (TextUtils.isEmpty(birth))
                {
                    Toast.makeText(context, getString(R.string.error_field_required), duration).show();
                    return;
                }

                // Check for valid gender
                if (TextUtils.isEmpty(gender))
                {
                    Toast.makeText(context, getString(R.string.error_field_required), duration).show();
                    return;
                }
                /*if (!gender.equals(R.string.personal_info_gender_female) || !gender.equals(R.string.personal_info_gender_male) || !gender.equals(R.string.personal_info_gender_other) )
                {
                    Toast.makeText(context, getString(R.string.error_invalid_personal_info_gender), duration).show();
                    return;
                }*/

                Toast.makeText(context, getString(R.string.personal_info_success), duration).show();

                /* Firebase */
                addInfo(fname, lname, birth, gender);
                uploadProfilePic();

                /* move to main */
                //startActivity(new Intent(PersonalInfoActivity.this, MainActivity.class));

                /* move to check-in */
                startActivity(new Intent(PersonalInfoActivity.this, CheckinActivity.class));
                finish();
            }
        });
    }

    /**
     * Selects a user profile image
     */
    private void chooseImage() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_REQUEST);
    }

    /**
     * Updates the image view and makes it round
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK
                && data != null && data.getData() != null )
        {
            picPath = data.getData();
            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), picPath);

                //makeItRound
                RoundedBitmapDrawable mDrawable = RoundedBitmapDrawableFactory.create(getResources(), bitmap);
                mDrawable.setCircular(true);

                pictureProfile.setImageDrawable(mDrawable);
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }
    }

    /**
     * Adds personal data to Firebase database
     */
    private void addInfo(String fname, String lname, String birthday, String gender)
    {
        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        /* register date */
        Calendar calendar = Calendar.getInstance();
        Date date = calendar.getTime();

        String year = (String) android.text.format.DateFormat.format("yyyy", date);
        String month = (String) android.text.format.DateFormat.format("MM", date);
        String day = (String) android.text.format.DateFormat.format("dd", date);

        final String readableDate = day + "/"+ month + "/" + year;

        databaseReference = database.getReference("personal_data");
        databaseReference.child(uid).child("fname").setValue(fname);
        databaseReference.child(uid).child("lname").setValue(lname);
        databaseReference.child(uid).child("birthday").setValue(birthday);
        databaseReference.child(uid).child("gender").setValue(gender);
        databaseReference.child(uid).child("register").setValue(readableDate);

        //databaseReference = database.getReference("mood_data");
        //databaseReference.child(uid).child("green").setValue(0);
        //databaseReference.child(uid).child("yellow").setValue(0);
        //databaseReference.child(uid).child("red").setValue(0);
    }

    /**
     * Uploads user profile image to Firebase storage
     */
    private void uploadProfilePic()
    {
        final Context context = getApplicationContext();
        final int duration = Toast.LENGTH_SHORT;

        FirebaseUser user = mAuth.getCurrentUser();
        String uid = user.getUid();

        storageReference = storage.getReference();

        if(picPath != null)
        {
            StorageReference imgProf = storageReference.child("profile_images/"+uid);

            imgProf.putFile(picPath)
                    .addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                            //progressDialog.dismiss();
                            //Toast.makeText(context, "Uploaded", duration).show();
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            //progressDialog.dismiss();
                            Toast.makeText(context, "Failed "+e.getMessage(), duration).show();
                        }
                    });
        }
    }

    /**
     * Gets the item selected and fills in the edit text
     */
    public void onItemSelected(AdapterView<?> parent, View view, int pos, long id)
    {
        // On selecting a spinner item
        String item = parent.getItemAtPosition(pos).toString();
        inputGender.setText(item);
    }

    /**
     * Required by the interface
     */
    public void onNothingSelected(AdapterView<?> parent)
    {
        // Another interface callback
    }

    /**
     * Displays the date picker
     */
    public void showDatePicker(View v)
    {
        DialogFragment newFragment = new DatePickerFragment();
        newFragment.show(getSupportFragmentManager(), "date picker");
    }

    /**
     * Shows a date picker to set the day of birth
     */
    public static class DatePickerFragment extends DialogFragment implements DatePickerDialog.OnDateSetListener
    {
        @Override
        public Dialog onCreateDialog(Bundle savedInstanceState)
        {
            final Calendar c = Calendar.getInstance();
            int year = c.get(Calendar.YEAR);
            int month = c.get(Calendar.MONTH);
            int day = c.get(Calendar.DAY_OF_MONTH);

            //https://www.dev2qa.com/android-datepickerdialog-timepickerdialog-spinner-example/
            DatePickerDialog datePickerDialog = new DatePickerDialog(getActivity(), android.R.style.Theme_Holo_Light_Dialog, this, year, month, day);
            //datePickerDialog.setTitle(getString(R.string.personal_info_birthday));

            return datePickerDialog;
        }

        public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth)
        {
            int month = monthOfYear + 1;
            String formattedMonth = "" + month;
            String formattedDayOfMonth = "" + dayOfMonth;

            if(month < 10)
            {
                formattedMonth = "0" + month;
            }
            if(dayOfMonth < 10)
            {
                formattedDayOfMonth = "0" + dayOfMonth;
            }
            String dateOutput = formattedDayOfMonth + "/" + formattedMonth + "/" + year;
            inputBirthday.setText(dateOutput);
            //Toast.makeText(getActivity(), output, Toast.LENGTH_SHORT).show();
        }
    }
}