package pt.ua.ieeta.urjourney.urjourney.loggin;

import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;

import pt.ua.ieeta.urjourney.urjourney.R;

public class ResetPassActivity extends AppCompatActivity
{
    /* UI references */
    private EditText inputEmail;
    private Button btnLogin;
    private Button btnRegister;
    private Button btnReset;

    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reset_pass);

        mAuth = FirebaseAuth.getInstance();

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

    /**
     * Sends an email to reset the password
     * https://grokonez.com/android/firebase-authentication-send-reset-password-email-forgot-password-android#2_Send_a_password_reset_email
     */
    private void reset(final String email)
    {
        mAuth.sendPasswordResetEmail(email).addOnCompleteListener(new OnCompleteListener<Void>()
        {
            @Override
            public void onComplete(@NonNull Task<Void> task)
            {
                if (task.isSuccessful())
                {
                    Toast.makeText(ResetPassActivity.this, getString(R.string.info_reset_email) + " " + email, Toast.LENGTH_SHORT).show();
                }
                else
                {
                    Toast.makeText(ResetPassActivity.this, getString(R.string.error_reset_email), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    /**
     * Checks if an email is valid
     */
    private boolean isEmailValid(String email)
    {
        return email.contains("@");
    }
}

