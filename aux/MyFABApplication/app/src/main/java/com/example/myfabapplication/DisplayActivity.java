package com.example.myfabapplication;

import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

public class DisplayActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener
{
    private final String doneAction = "Info successfully added";
    private TextView textSpinner;
    private EditText editText;
    private Model m;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_display);

        // my_child_toolbar is defined in the layout file
        Toolbar myChildToolbar = findViewById(R.id.my_child_toolbar);
        setSupportActionBar(myChildToolbar);

        // Get a support ActionBar corresponding to this toolbar
        ActionBar ab = getSupportActionBar();

        // Enable the Up button
        if(ab != null)
        {
            ab.setDisplayHomeAsUpEnabled(true);
        }

        m = new Model();

        textSpinner = findViewById(R.id.textSpinner);

        editText = findViewById(R.id.editText);

        //SPINNER
        Spinner spinner = (Spinner) findViewById(R.id.spinner);

        // Spinner click listener
        spinner.setOnItemSelectedListener(this);

        // Create an ArrayAdapter using the string array and a default spinner layout
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.spinner_options, android.R.layout.simple_spinner_item);

        // Specify the layout to use when the list of choices appears
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

        // Apply the adapter to the spinner
        spinner.setAdapter(adapter);

    }

    /* Removes overflow items */
    @Override
    public boolean onPrepareOptionsMenu(Menu menu)
    {
        MenuItem item[] = { menu.findItem(R.id.action_settings),
                            menu.findItem(R.id.action_stuff)};

        item[0].setVisible(false);
        item[1].setVisible(false);

        super.onPrepareOptionsMenu(menu);
        return true;
    }

    // Inflate the menu; this adds items to the action bar if it is present.
    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    // Handle action bar item clicks here.
    @Override
    public boolean onOptionsItemSelected(MenuItem item)
    {
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if(id ==  R.id.action_done)
        {
            // Add data and move back

            Toast.makeText(this, doneAction, Toast.LENGTH_SHORT).show();
            finish();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    // O AdapterView.OnItemSelectedListener exige os métodos de retorno de chamada onItemSelected() e onNothingSelected().
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        // On selecting a spinner item
        String item = parent.getItemAtPosition(position).toString();

        // Showing selected spinner item
        //Toast.makeText(parent.getContext(), "Selected: " + item, Toast.LENGTH_LONG).show();
        textSpinner.setText(item);
        //m.setTitle(editText.toString());
        //m.setSubtitle(item);

        String title = "0";;
        if(editText.getText().toString().length()>0)
        {
            title = editText.getText().toString();
        }

        ((Model) this.getApplication()).setTitle(title);
        ((Model) this.getApplication()).setSubtitle(item);
    }

    public void onNothingSelected(AdapterView<?> arg0)
    {
        // TODO Auto-generated method stub
    }
}
