package pt.ua.ieeta.urjourney.urjourney.checkin;

import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.vision.barcode.Barcode;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

import pt.ua.ieeta.urjourney.urjourney.MainActivity;
import pt.ua.ieeta.urjourney.urjourney.R;

public class CheckinActivity extends AppCompatActivity implements View.OnClickListener
{
    private TextView statusMessage;
    private Button btnBarcode;
    private Button btnText;
    private Button btnProceed;

    /*  constants used to pass and get extra data in the intent */
    private static final int RC_BARCODE_CAPTURE = 20191;
    private static final int RC_MAGICWORD_CAPTURE = 20192;

    /* Firebase references */
    private FirebaseAuth mFirebaseAuth;
    private FirebaseUser mFirebaseUser;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;

    /* Study model and list of studies */
    private Study s;
    private List<Study> studyList;

    private static boolean check = false;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_checkin);

        mFirebaseAuth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance();
        mFirebaseUser = mFirebaseAuth.getCurrentUser();

        studyList = new ArrayList<>();
        loadDatabaseData();

        statusMessage = findViewById(R.id.status_message);

        btnBarcode = findViewById(R.id.read_barcode);
        btnBarcode.setOnClickListener(this);

        btnText = findViewById(R.id.read_text);
        btnText.setOnClickListener(this);

        btnProceed = findViewById(R.id.ready);
        btnProceed.setOnClickListener(this);

        //se estiver em estudo, mostrar botão prosseguir
        if(check == true)
        {
            btnBarcode.setVisibility(View.INVISIBLE);
            btnText.setVisibility(View.INVISIBLE);
            btnProceed.setVisibility(View.VISIBLE);
        }
        else
        {
            btnBarcode.setVisibility(View.VISIBLE);
            btnText.setVisibility(View.VISIBLE);
            btnProceed.setVisibility(View.INVISIBLE);
        }
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

    /**
     * Called when a view has been clicked.
     *
     * @param v The view that was clicked.
     */
    @Override
    public void onClick(View v)
    {
        if (v.getId() == R.id.read_barcode)
        {
            Log.d("onClick", "--> read_barcode");
            // launch barcode activity.
            Intent intent = new Intent(this, BarcodeCaptureActivity.class);
            intent.putExtra(BarcodeCaptureActivity.AutoFocus, true);
            intent.putExtra(BarcodeCaptureActivity.UseFlash, false);

            startActivityForResult(intent, RC_BARCODE_CAPTURE);
        }
        else if (v.getId() == R.id.read_text)
        {
            //launch textInput activity
            //showToast("Text input act");
            Intent intent = new Intent(this, MagicalTextActivity.class);
            startActivityForResult(intent, RC_MAGICWORD_CAPTURE);
        }
        else if (v.getId() == R.id.ready)
        {
            //move to main app activity
            //showToast("Move to UrJourney main");

            Toast.makeText(this, getString(R.string.info_checkin_sucess), Toast.LENGTH_SHORT).show();

            startActivity(new Intent(this, MainActivity.class));
            finish();
        }
    }

    /**
     * Called when an activity you launched exits, giving you the requestCode
     * you started it with, the resultCode it returned, and any additional
     * data from it.  The <var>resultCode</var> will be
     * {@link #RESULT_CANCELED} if the activity explicitly returned that,
     * didn't return any result, or crashed during its operation.
     * <p/>
     * <p>You will receive this call immediately before onResume() when your
     * activity is re-starting.
     * <p/>
     *
     * @param requestCode The integer request code originally supplied to
     *                    startActivityForResult(), allowing you to identify who this
     *                    result came from.
     * @param resultCode  The integer result code returned by the child activity
     *                    through its setResult().
     * @param data        An Intent, which can return result data to the caller
     *                    (various data can be attached to Intent "extras").
     * @see #startActivityForResult
     * @see #createPendingResult
     * @see #setResult(int)
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data){

        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_BARCODE_CAPTURE)
        {
            if (resultCode == CommonStatusCodes.SUCCESS)
            {
                if (data != null)
                {
                    Barcode barcode = data.getParcelableExtra(BarcodeCaptureActivity.BarcodeObject);

                    //showToast(barcode.displayValue);
                    boolean validMagicWord = validWithFirebase(barcode.displayValue);
                    //showToast("Valid QR?: "+validMagicWord);

                    if (validMagicWord == true)
                    {
                        statusMessage.setText(R.string.barcode_success);

                        btnBarcode.setVisibility(View.INVISIBLE);
                        btnText.setVisibility(View.INVISIBLE);
                        btnProceed.setVisibility(View.VISIBLE);
                    }
                    else
                    {
                        statusMessage.setText(R.string.barcode_failure);
                        //Log.d(TAG, "No barcode captured, intent data is null");
                        btnBarcode.setVisibility(View.VISIBLE);
                        btnText.setVisibility(View.VISIBLE);
                        btnProceed.setVisibility(View.INVISIBLE);
                    }

                    /*btnBarcode.setVisibility(View.INVISIBLE);
                    btnText.setVisibility(View.INVISIBLE);
                    btnProceed.setVisibility(View.VISIBLE);*/
                }
                else
                {
                    statusMessage.setText(R.string.barcode_failure);
                    //Log.d(TAG, "No barcode captured, intent data is null");
                    btnBarcode.setVisibility(View.VISIBLE);
                    btnText.setVisibility(View.VISIBLE);
                    btnProceed.setVisibility(View.INVISIBLE);
                }
            }
            else
            {
                statusMessage.setText(String.format(getString(R.string.barcode_error),
                        CommonStatusCodes.getStatusCodeString(resultCode)));
                btnBarcode.setVisibility(View.VISIBLE);
                btnText.setVisibility(View.VISIBLE);
                btnProceed.setVisibility(View.INVISIBLE);
            }
        }
        else if(requestCode == RC_MAGICWORD_CAPTURE)
        {
            //Log.d("MainAct","RC_MAGICWORD_CAPTURE");
            if (resultCode == CommonStatusCodes.SUCCESS)
            {
                //Log.d("MainAct","SUCCESS");
                if (data != null)
                {
                    //int result = data.getParcelableExtra(MagicalTextActivity.WordObject);
                    String inputMagicWord = data.getStringExtra(MagicalTextActivity.WordObject);
                    //statusMessage.setText(inputMagicWord);

                    boolean validMagicWord = validWithFirebase(inputMagicWord);
                    //showToast("Valid word?: "+validMagicWord);

                    if (validMagicWord == true)
                    {
                        statusMessage.setText(R.string.magical_word_success);

                        btnBarcode.setVisibility(View.INVISIBLE);
                        btnText.setVisibility(View.INVISIBLE);
                        btnProceed.setVisibility(View.VISIBLE);
                    }
                    else
                    {
                        statusMessage.setText(R.string.magical_word_failure);
                        //Log.d(TAG, "No barcode captured, intent data is null");
                        btnBarcode.setVisibility(View.VISIBLE);
                        btnText.setVisibility(View.VISIBLE);
                        btnProceed.setVisibility(View.INVISIBLE);
                    }

                    /*btnBarcode.setVisibility(View.INVISIBLE);
                    btnText.setVisibility(View.INVISIBLE);
                    btnProceed.setVisibility(View.VISIBLE);*/
                }
                else
                {
                    statusMessage.setText(R.string.magical_word_failure);

                    btnBarcode.setVisibility(View.VISIBLE);
                    btnText.setVisibility(View.VISIBLE);
                    btnProceed.setVisibility(View.INVISIBLE);
                }
            }
            else
            {
                statusMessage.setText(String.format(getString(R.string.magical_word_error),
                        CommonStatusCodes.getStatusCodeString(resultCode)));
                btnBarcode.setVisibility(View.VISIBLE);
                btnText.setVisibility(View.VISIBLE);
                btnProceed.setVisibility(View.INVISIBLE);
            }
        }
    }

    private void loadDatabaseData()
    {
        studyList.clear();

        databaseReference = database.getReference().child("study_data");

        databaseReference.addValueEventListener(new ValueEventListener()
        {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot)
            {
                for(DataSnapshot singleSnap : dataSnapshot.getChildren()) //a fazer loop pelos study
                {
                    String key = singleSnap.getKey(); // "id" do estudo

                    s = new Study();
                    Study entry = singleSnap.getValue(Study.class);

                    s.setId(key);
                    s.setTitle(entry.title);
                    s.setLocation(entry.location);
                    s.setStartdate(entry.startdate);
                    s.setState(entry.state);
                    s.setEnddate(entry.enddate);
                    s.setParticipants(entry.participants);
                    s.setMagicword(entry.magicword);

                    s.setApproved(entry.approved);

                    studyList.add(s);
                }

                String uid = mFirebaseUser.getUid();
                check = inStudy(uid);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                Log.e(this.toString(), "onCancelled", databaseError.toException());
            }
        });
    }

    private boolean validWithFirebase(String word)
    {
        //Log.d("MagicalTextAct","validWithFirebase");

        //final long magicWord = Long.parseLong(word);
        String magicWord;
        String studyKey = "null";
        boolean exists = false;
        List<String> participants = new ArrayList<>();

        List<String> approved = new ArrayList<>();

        /* verificar se word (lida pelo utilizador) corresponde à magic word do estudo */
        for(int i = 0; i < studyList.size(); i++)
        {
            magicWord = studyList.get(i).getMagicword();
            //studyKey = studyList.get(i).getId();

            participants = studyList.get(i).getParticipants();
            //showToast("Participants size: "+p.size());

            approved = studyList.get(i).getApproved();

            if (word.equals(magicWord))
            {
                studyKey = studyList.get(i).getId();
                exists = true;
                break;
            }
        }

        if (exists == true)
        {
            //se sim, adicionar a key do participante actual ao estudo
            String uid = mFirebaseUser.getUid();

            if (!participants.contains(uid))
            {
                if(participants.size() != 0 && participants.contains(""))
                {
                    Log.i(this.toString(), "validWithFirebase: "+ participants);
                    participants.clear();
                }
                participants.add(uid);
            }

            if(!approved.contains(uid))
            {
                if(approved.size() != 0 && approved.contains(""))
                {
                    Log.i(this.toString(), "validWithFirebase: "+ approved);
                    approved.clear();
                }
                approved.add(uid);
            }

            databaseReference = database.getReference("study_data");
            databaseReference.child(studyKey).child("participants").setValue(participants);

            databaseReference.child(studyKey).child("approved").setValue(approved);

            return true;
        }
        else //se não, não corresponder, abortar
        {
            return false;
        }
    }

    private boolean inStudy(String uid)
    {
        List<String> participants = new ArrayList<>();

        for(int i = 0; i < studyList.size(); i++)
        {
            participants = studyList.get(i).getParticipants();

            if (participants.contains(uid))
            {
                return true;
            }
        }

        return false;
    }
}
