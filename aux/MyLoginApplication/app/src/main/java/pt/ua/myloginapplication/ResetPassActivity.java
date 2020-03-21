package pt.ua.myloginapplication;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.app.LoaderManager.LoaderCallbacks;

import android.content.CursorLoader;
import android.content.Loader;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;

import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import static android.Manifest.permission.READ_CONTACTS;

public class ResetPassActivity extends AppCompatActivity
{
    /* UI references */
    private EditText inputEmail;
    private Button btnLogin;
    private Button btnRegister;
    private Button btnReset;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reset_pass);

        btnReset = findViewById(R.id.reset_pass_button);
        btnReset.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view)
            {
                String email = inputEmail.getText().toString().trim();

                Context context = getApplicationContext();
                int duration = Toast.LENGTH_SHORT;

                // Check for a valid email address.
                if (TextUtils.isEmpty(email))
                {
                    Toast.makeText(context, getString(R.string.error_field_required), duration).show();
                    return;
                }
                if (!isEmailValid(email))
                {
                    Toast.makeText(context, getString(R.string.error_invalid_email), duration).show();
                    return;
                }

                reset(email);
            }
        });

        btnRegister = findViewById(R.id.register_button);
        btnRegister.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                changeToRegisterScreen();
            }
        });

        btnLogin = findViewById(R.id.login_button);
        btnLogin.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                changeToLoginScreen();
            }
        });
    }

    /**
     * Changes to register screen when the Register button is pressed
     */
    private void changeToRegisterScreen()
    {
        startActivity(new Intent(this, RegisterActivity.class));
        finish();
    }

    /**
     * Changes to login screen when the Login button is pressed
     */
    private void changeToLoginScreen()
    {
        startActivity(new Intent(this, LoginActivity.class));
        finish();
    }

    private void reset(String email)
    {
        //Do something
    }

    private boolean isEmailValid(String email)
    {
        //TODO: Replace this with your own logic
        return email.contains("@");
    }
}

