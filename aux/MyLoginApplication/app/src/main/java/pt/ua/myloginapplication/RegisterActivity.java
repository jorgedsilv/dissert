package pt.ua.myloginapplication;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class RegisterActivity extends AppCompatActivity
{
    /* UI references */
    private EditText inputEmail;
    private EditText inputPassword;
    private EditText inputConfirmPassword;
    private Button btnRegister;
    private Button btnLogin;
    private Button btnReset;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        inputEmail = findViewById(R.id.mail);
        inputPassword = findViewById(R.id.password);
        inputConfirmPassword = findViewById(R.id.confirm_password);

        btnRegister = findViewById(R.id.register_button);
        btnRegister.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view)
            {
                String email = inputEmail.getText().toString().trim();
                String password = inputPassword.getText().toString().trim();
                String confirm_password = inputConfirmPassword.getText().toString().trim();

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
                if (!confirm_password.equals(password))
                {
                    Toast.makeText(context, getString(R.string.error_incorrect_password), duration).show();
                    return;
                }

                createAccount(email,password);
            }
        });

        btnLogin = findViewById(R.id.login_button);
        btnLogin.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                changeToLoginScreen();
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
     * Changes to login screen when the Login button is pressed
     */
    private void changeToLoginScreen()
    {
        startActivity(new Intent(this, LoginActivity.class));
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
     * Creates the user account in Firebase
     * https://github.com/firebase/quickstart-android/blob/master/auth/app/src/main/java/com/google/firebase/quickstart/auth/java/EmailPasswordActivity.java
     */
    private void createAccount(final String email, final String password)
    {
        mAuth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(this, new OnCompleteListener<AuthResult>()
        {
            @Override
            public void onComplete(@NonNull Task<AuthResult> task)
            {
                if (task.isSuccessful())
                {
                    // Sign in success, update UI with the signed-in user's information
                    //Log.d(TAG, "createUserWithEmail:success");
                    Toast.makeText(LoginActivity.this, "createUserWithEmail:onComplete:" + task.isSuccessful(), Toast.LENGTH_SHORT).show();
                    FirebaseUser user = mAuth.getCurrentUser();

                    /* move to main */
                    //startActivity(new Intent(this, MainActivity.class));
                    //finish();
                }
                else
                {
                    // If sign in fails, display a message to the user.
                    //Log.w(TAG, "createUserWithEmail:failure", task.getException());
                    Toast.makeText(EmailPasswordActivity.this, "Authentication failed.", Toast.LENGTH_SHORT).show();
                    //updateUI(null);
                }
            }
        });
    }

    private void sendEmailVerification()
    {
        final FirebaseUser user = mAuth.getCurrentUser();
        user.sendEmailVerification().addOnCompleteListener(this, new OnCompleteListener<Void>()
        {
            @Override
            public void onComplete(@NonNull Task<Void> task)
            {
                if (task.isSuccessful())
                {
                    Toast.makeText(EmailPasswordActivity.this, "Verification email sent to " + user.getEmail(), Toast.LENGTH_SHORT).show();
                }
                else
                {
                    Log.e(TAG, "sendEmailVerification", task.getException());
                    Toast.makeText(EmailPasswordActivity.this, "Failed to send verification email.", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private boolean isEmailValid(String email) {
        return email.contains("@");
    }

    private boolean isPasswordValid(String password) {
        return password.length() > 6;
    }
}

