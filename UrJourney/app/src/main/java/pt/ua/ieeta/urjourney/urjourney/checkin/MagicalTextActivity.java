package pt.ua.ieeta.urjourney.urjourney.checkin;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

import pt.ua.ieeta.urjourney.urjourney.R;

public class MagicalTextActivity extends AppCompatActivity
{
    private TextView input;
    private Button validate;
    private Button cancel;

    /* Firebase references */
    private FirebaseAuth mFirebaseAuth;
    private FirebaseUser mFirebaseUser;
    private FirebaseDatabase database;
    private DatabaseReference databaseReference;

    // constants used to pass extra data in the intent
    private static final int VALID = 1;
    private static final int INVALID = 0;
    public static final String WordObject = "MagicWord";

    private Study s;
    private List<Study> studyList;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_magical_text);

        mFirebaseAuth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance();

        studyList = new ArrayList<>();
        //loadDatabaseData();

        input = findViewById(R.id.magic_word);
        validate = findViewById(R.id.validateMagicWord);
        cancel = findViewById(R.id.cancelMagicWord);

        validate.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                String word = input.getText().toString().trim();

                // Check for a valid magical word
                if (TextUtils.isEmpty(word))
                {
                    showToast(getString(R.string.error_field_required));
                    return;
                }
                //verificar com Firebase o ID do estudo!
                //boolean valid = validWithFirebase(word);

                //se for válido, regressar ao home
                //validMagicWord(valid);

                Intent data = new Intent();

                data.putExtra(WordObject, word);
                setResult(CommonStatusCodes.SUCCESS, data);

                finish();
            }
        });

        cancel.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                Intent data = new Intent();

                data.putExtra(WordObject, "");
                setResult(CommonStatusCodes.CANCELED, data);

                finish();
            }
        });
    }

    private void loadDatabaseData()
    {
        studyList.clear();

        databaseReference = database.getReference().child("study_data");

        Log.d("MagicalTextAct","loadDatabaseData");

        databaseReference.addValueEventListener(new ValueEventListener()
        {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot)
            {
                for(DataSnapshot singleSnap : dataSnapshot.getChildren()) //a fazer loop pelos study
                {
                    String key = singleSnap.getKey(); // "id" do estudo
                    //showToast("Key: "+key);
                    s = new Study();
                    Study entry = singleSnap.getValue(Study.class);

                    //long id = Long.parseLong(key);
                    //s.setId(id);

                    s.setId(key);
                    s.setTitle(entry.title);
                    s.setLocation(entry.location);
                    s.setStartdate(entry.startdate);
                    s.setState(entry.state);
                    s.setEnddate(entry.enddate);
                    s.setParticipants(entry.participants);
                    s.setMagicword(entry.magicword);

                    studyList.add(s);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError)
            {
                //Log.e(TimelineFragment.this.toString(), "onCancelled", databaseError.toException());
                Log.e(this.toString(), "onCancelled", databaseError.toException());
            }
        });
    }

    private boolean validWithFirebase(String word)
    {
        Log.d("MagicalTextAct","validWithFirebase");

        //final long magicWord = Long.parseLong(word);
        String magicWord;
        String studyKey = "null";
        boolean exists = false;
        List<String> p = new ArrayList<>();

        /* verificar se word (lida pelo utilizador) corresponde à magic word do estudo */
        for(int i = 0; i < studyList.size(); i++)
        {
            magicWord = studyList.get(i).getMagicword();
            //studyKey = studyList.get(i).getId();

            p = studyList.get(i).getParticipants();
            //showToast("Participants size: "+p.size());

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
            mFirebaseUser = mFirebaseAuth.getCurrentUser();
            String uid = mFirebaseUser.getUid();

            p.add(uid);

            databaseReference = database.getReference("study_data");
            databaseReference.child(studyKey).child("participants").setValue(p);

            return true;
        }
        else //se não, não corresponder, abortar
        {
            return false;
        }
    }

    private void validMagicWord(boolean result)
    {
        Intent data = new Intent();

        //Log.d("MagicalTextAct","validMagicWord");

        if(result == false)
        {
            data.putExtra(WordObject, INVALID);
            setResult(CommonStatusCodes.CANCELED, data);
        }
        else if (result == true)
        {
            data.putExtra(WordObject, VALID);
            setResult(CommonStatusCodes.SUCCESS, data);
        }

        finish();
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
}
