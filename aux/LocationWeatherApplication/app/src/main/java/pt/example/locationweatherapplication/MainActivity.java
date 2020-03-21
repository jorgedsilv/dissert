package pt.example.locationweatherapplication;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Geocoder;
import android.location.Location;
import android.net.Uri;
import android.os.Handler;
import android.os.ResultReceiver;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

import com.squareup.picasso.Picasso;

public class MainActivity extends AppCompatActivity
{
    private static final String TAG = MainActivity.class.getSimpleName();

    private static final int REQUEST_PERMISSIONS_REQUEST_CODE = 34;

    private static final String ADDRESS_REQUESTED_KEY = "address-request-pending";
    private static final String LOCATION_ADDRESS_KEY = "location-address";

    private FusedLocationProviderClient mFusedLocationClient;

    private Location mLastLocation;

    private boolean mAddressRequested;

    private String mAddressOutput;

    private AddressResultReceiver mResultReceiver;

    private TextView mLocationAddressTextView;

    private ProgressBar mProgressBar;

    private Button mFetchAddressButton;

    /* Weather */
    private TextView weatherTemperature;
    private TextView weatherDescription;
    private ImageView weatherIcon;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        /* Weather */
        weatherTemperature = findViewById(R.id.current_temperature_field);
        weatherDescription = findViewById(R.id.details_field);
        weatherIcon = findViewById(R.id.weatherIcon);

        /* --- */

        mResultReceiver = new AddressResultReceiver(new Handler());

        mLocationAddressTextView = findViewById(R.id.location_address_view);
        mProgressBar = findViewById(R.id.progress_bar);
        mFetchAddressButton = findViewById(R.id.fetch_address_button);

        // Set defaults, then update using values stored in the Bundle.
        mAddressRequested = false;
        mAddressOutput = "";
        updateValuesFromBundle(savedInstanceState);

        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        updateUIWidgets();
    }

    @Override
    public void onStart()
    {
        super.onStart();

        if (!checkPermissions())
        {
            requestPermissions();
        }
        else
        {
            getAddress();
        }
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
            if (savedInstanceState.keySet().contains(LOCATION_ADDRESS_KEY)) {
                mAddressOutput = savedInstanceState.getString(LOCATION_ADDRESS_KEY);
                displayAddressOutput();
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
        updateUIWidgets();
    }

    /**
     * Creates an intent, adds location data to it as an extra, and starts the intent service for
     * fetching an address.
     */
    private void startIntentService()
    {
        // Create an intent for passing to the intent service responsible for fetching the address.
        Intent intent = new Intent(this, FetchAddressIntentService.class);

        // Pass the result receiver as an extra to the service.
        intent.putExtra(Constants.RECEIVER, mResultReceiver);

        // Pass the location data as an extra to the service.
        intent.putExtra(Constants.LOCATION_DATA_EXTRA, mLastLocation);

        startService(intent);
    }

    /**
     * Gets the address for the last known location.
     */
    @SuppressWarnings("MissingPermission")
    private void getAddress()
    {
        mFusedLocationClient.getLastLocation()
                .addOnSuccessListener(this, new OnSuccessListener<Location>()
                {
                    @Override
                    public void onSuccess(Location location)
                    {
                        if (location == null)
                        {
                            Log.w(TAG, "onSuccess:null");
                            return;
                        }

                        mLastLocation = location;

                        // Determine whether a Geocoder is available.
                        if (!Geocoder.isPresent())
                        {
                            showSnackbar(getString(R.string.no_geocoder_available));
                            return;
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
                .addOnFailureListener(this, new OnFailureListener()
                {
                    @Override
                    public void onFailure(@NonNull Exception e)
                    {
                        Log.w(TAG, "getLastLocation:onFailure", e);
                    }
                });
    }

    /**
     * Updates the address in the UI.
     */
    private void displayAddressOutput()
    {
        mLocationAddressTextView.setText(mAddressOutput);

        Weather.placeIdTask asyncTask = new Weather.placeIdTask(new Weather.AsyncResponse()
        {
            public void processFinish(String wDescription, String wTemperature, String wIcon)
            {
                weatherDescription.setText(wDescription);
                weatherTemperature.setText(wTemperature);
                Picasso.with(getApplicationContext()).load(wIcon).into(weatherIcon);
            }
        });
        asyncTask.execute(mAddressOutput);
    }

    /**
     * Toggles the visibility of the progress bar. Enables or disables the Fetch Address button.
     */
    private void updateUIWidgets()
    {
        if (mAddressRequested)
        {
            mProgressBar.setVisibility(ProgressBar.VISIBLE);
            mFetchAddressButton.setEnabled(false);
        }
        else
        {
            mProgressBar.setVisibility(ProgressBar.GONE);
            mFetchAddressButton.setEnabled(true);
        }
    }

    /**
     * Shows a toast with the given text.
     */
    private void showToast(String text)
    {
        Toast.makeText(this, text, Toast.LENGTH_SHORT).show();
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
            displayAddressOutput();

            // Show a toast message if an address was found.
            /*if (resultCode == Constants.SUCCESS_RESULT)
            {
                showToast(getString(R.string.address_found));
            }*/

            // Reset. Enable the Fetch Address button and stop showing the progress bar.
            mAddressRequested = false;
            updateUIWidgets();
        }
    }

    /**
     * Shows a {@link Snackbar} using {@code text}.
     *
     * @param text The Snackbar text.
     */
    private void showSnackbar(final String text)
    {
        View container = findViewById(android.R.id.content);
        if (container != null)
        {
            Snackbar.make(container, text, Snackbar.LENGTH_LONG).show();
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
        Snackbar.make(findViewById(android.R.id.content),
                getString(mainTextStringId),
                Snackbar.LENGTH_INDEFINITE)
                .setAction(getString(actionStringId), listener).show();
    }

    /**
     * Return the current state of the permissions needed.
     */
    private boolean checkPermissions()
    {
        int permissionState = ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION);
        return permissionState == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissions()
    {
        boolean shouldProvideRationale =
                ActivityCompat.shouldShowRequestPermissionRationale(this,
                        Manifest.permission.ACCESS_FINE_LOCATION);

        // Provide an additional rationale to the user.
        if (shouldProvideRationale)
        {
            Log.i(TAG, "Displaying permission rationale to provide additional context.");

            showSnackbar(R.string.permission_rationale, android.R.string.ok,
                    new View.OnClickListener()
                    {
                        @Override
                        public void onClick(View view) {
                            // Request permission
                            ActivityCompat.requestPermissions(MainActivity.this,
                                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                                    REQUEST_PERMISSIONS_REQUEST_CODE);
                        }
                    });
        }
        else
        {
            Log.i(TAG, "Requesting permission");
            // Request permission.
            ActivityCompat.requestPermissions(MainActivity.this,
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
}
