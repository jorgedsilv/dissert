package pt.example.barcodeexample;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.vision.barcode.Barcode;

public class MainActivity extends AppCompatActivity implements View.OnClickListener
{
    private TextView statusMessage;
    private Button btnBarcode;
    private Button btnText;
    private Button btnProceed;
    private static final int RC_BARCODE_CAPTURE = 001;
    private static final int RC_MAGICWORD_CAPTURE = 002;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        statusMessage = (TextView)findViewById(R.id.status_message);

        btnBarcode = findViewById(R.id.read_barcode);
        btnBarcode.setOnClickListener(this);
        btnBarcode.setVisibility(View.VISIBLE);

        btnText = findViewById(R.id.read_text);
        btnText.setOnClickListener(this);
        btnText.setVisibility(View.VISIBLE);

        btnProceed = findViewById(R.id.ready);
        btnProceed.setOnClickListener(this);
        btnProceed.setVisibility(View.INVISIBLE);
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
            showToast("Move to UrJourney main");
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
                    statusMessage.setText(R.string.barcode_success);

                    showToast(barcode.displayValue);

                    //barcodeValue.setText(barcode.displayValue);
                    //Log.d(TAG, "Barcode read: " + barcode.displayValue);

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
            Log.d("MainAct","RC_MAGICWORD_CAPTURE");
            if (resultCode == CommonStatusCodes.SUCCESS)
            {
                Log.d("MainAct","SUCCESS");
                if (data != null)
                {
                    //int result = data.getParcelableExtra(MagicalTextActivity.WordObject);
                    statusMessage.setText(R.string.magical_word_success);

                    Log.d("MainAct","toast..");
                    //showToast("Result: "+result);

                    btnBarcode.setVisibility(View.INVISIBLE);
                    btnText.setVisibility(View.INVISIBLE);
                    btnProceed.setVisibility(View.VISIBLE);
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
}
