package pt.ua.myloginapplication;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class LoginActivity extends AppCompatActivity
{
    /* UI references */
    private EditText inputEmail;
    private EditText inputPassword;
    private Button btnLogin;
    private Button btnRegister;
    private Button btnReset;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        inputEmail = findViewById(R.id.mail);
        inputPassword = findViewById(R.id.password);

        btnLogin = findViewById(R.id.login_button);
        btnLogin.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view)
            {
                String email = inputEmail.getText().toString().trim();
                String password = inputPassword.getText().toString().trim();

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

                // Check for a valid password, if the user entered one.
                if (TextUtils.isEmpty(password))
                {
                    Toast.makeText(context, getString(R.string.error_field_required), duration).show();
                    return;
                }
                if (!isPasswordValid(password))
                {
                    Toast.makeText(context, getString(R.string.error_invalid_password), duration).show();
                    return;
                }

                login(email,password);
            }
        });

        btnRegister = findViewById(R.id.register_button);
        btnRegister.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                changeToRegisterScreen();
            }
        });

        btnReset = findViewById(R.id.reset_pass_button);
        btnReset.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                changeToResetPassScreen();
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
     * Changes to reset password screen when the Reset Password button is pressed
     */
    private void changeToResetPassScreen()
    {
        startActivity(new Intent(this, ResetPassActivity.class));
        finish();
    }

    /**
     * Login with the user account in Firebase
     */
    private void login(String email, String password)
    {
        mAuth.signInWithEmailAndPassword(email, password).addOnCompleteListener(this, new OnCompleteListener<AuthResult>()
        {
            @Override
            public void onComplete(@NonNull Task<AuthResult> task)
            {
                if (task.isSuccessful())
                {
                    // Sign in success, update UI with the signed-in user's information
                    //Log.d(TAG, "signInWithEmail:success");
                    FirebaseUser user = mAuth.getCurrentUser();
                    //updateUI(user);
                }
                else
                {
                    // If sign in fails, display a message to the user.
                    Log.w(TAG, "signInWithEmail:failure", task.getException());
                    Toast.makeText(EmailPasswordActivity.this, "Authentication failed.", Toast.LENGTH_SHORT).show();
                    updateUI(null);
                }

                // [START_EXCLUDE]
                if (!task.isSuccessful()) {
                    mStatusTextView.setText(R.string.auth_failed);
                }
                hideProgressDialog();
                // [END_EXCLUDE]
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

    /**
     * Checks if a password is valid
     */
    private boolean isPasswordValid(String password)
    {
        return password.length() > 6;
    }
}

