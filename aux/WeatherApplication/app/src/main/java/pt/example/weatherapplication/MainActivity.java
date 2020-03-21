package pt.example.weatherapplication;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

/**
 * Source: https://www.faultinmycode.com/2018/05/open-weather-map-api-example.html
 */
public class MainActivity extends AppCompatActivity
{
    private TextView city;
    private TextView updated;
    private TextView current_temperature;
    private TextView details;
    private TextView humidity;
    private TextView pressure;

    private ImageView img;

    private Button btn;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btn = findViewById(R.id.retrieveInfo);

        img = findViewById(R.id.weatherIcon);

        city = findViewById(R.id.city_field);
        updated = findViewById(R.id.updated_field);
        current_temperature = findViewById(R.id.current_temperature_field);
        details = findViewById(R.id.details_field);
        humidity = findViewById(R.id.humidity_field);
        pressure = findViewById(R.id.pressure_field);
    }

    public void getInfo(View view)
    {
        Weather.placeIdTask asyncTask = new Weather.placeIdTask(new Weather.AsyncResponse()
        {
            public void processFinish(String weather_city, String weather_description, String weather_temperature,
                                      String weather_humidity, String weather_pressure, String weather_updatedOn, String iconUrl) {

                city.setText(weather_city);
                updated.setText(weather_updatedOn);
                details.setText(weather_description);
                current_temperature.setText(weather_temperature);
                humidity.setText("Humidity: "+weather_humidity);
                pressure.setText("Pressure: "+weather_pressure);

                Picasso.with(getApplicationContext()).load(iconUrl).into(img);
            }
        });
        //asyncTask.execute("-8.65", "40.64"); //  asyncTask.execute("Latitude", "Longitude")
        asyncTask.execute("Aveiro"); //  asyncTask.execute("Latitude", "Longitude")
    }
}
