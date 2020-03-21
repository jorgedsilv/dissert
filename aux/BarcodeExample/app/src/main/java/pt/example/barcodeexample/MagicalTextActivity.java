package pt.example.barcodeexample;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.api.CommonStatusCodes;

public class MagicalTextActivity extends AppCompatActivity
{
    private TextView input;
    private Button validate;
    private Button cancel;

    // constants used to pass extra data in the intent
    private static final int VALID = 1;
    private static final int INVALID = 0;
    public static final String WordObject = "MagicWord";

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_magical_text);

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
                //se for válido, regressar ao home
                validMagicWord(VALID);
            }
        });

        cancel.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                validMagicWord(INVALID);
            }
        });
    }

    private void validMagicWord(int result)
    {
        Intent data = new Intent();
        data.putExtra(WordObject, result);

        Log.d("MagicalTextAct","validMagicWord");

        if(result == INVALID)
        {
            setResult(CommonStatusCodes.CANCELED, data);
        }
        else if (result == VALID)
        {
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
