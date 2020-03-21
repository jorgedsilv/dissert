package pt.example.locationweatherapplication;

import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

public class Weather
{
    private static final String OPEN_WEATHER_MAP_URL = "http://api.openweathermap.org/data/2.5/weather?q=%s&units=metric";
    private static final String OPEN_WEATHER_MAP_API = "adc4db327e2aca6d7a1a4b17680ea4c2";

    public interface AsyncResponse
    {
        void processFinish(String weather_description, String weather_temperature, String weather_iconUrl);
    }

    public static class placeIdTask extends AsyncTask<String, Void, JSONObject>
    {
        public AsyncResponse delegate = null;
        //Call back interface

        public placeIdTask(AsyncResponse asyncResponse)
        {
            delegate = asyncResponse;
            //Assigning call back interface through constructor
        }

        @Override
        protected JSONObject doInBackground(String... arg)
        {

            JSONObject jsonWeather = null;
            try
            {
                jsonWeather = getWeatherJSON(arg[0]);
            }
            catch (Exception e)
            {
                Log.d("Error", "Cannot process JSON results", e);
            }

            return jsonWeather;
        }

        @Override
        protected void onPostExecute(JSONObject json)
        {
            try
            {
                if (json != null)
                {
                    JSONObject details = json.getJSONArray("weather").getJSONObject(0);
                    JSONObject main = json.getJSONObject("main");
                    //DateFormat df = DateFormat.getDateTimeInstance();

                    //String city = json.getString("name").toUpperCase(Locale.US) + ", " + json.getJSONObject("sys").getString("country");

                    String description = details.getString("description").toUpperCase(Locale.US);
                    String temperature = String.format("%.0f", main.getDouble("temp")) + "°";

                    //String updatedOn = df.format(new Date(json.getLong("dt") * 1000));

                    String icon = details.getString("icon");
                    String iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

                    //delegate.processFinish(city, description, temperature, updatedOn, iconUrl);

                    delegate.processFinish(description, temperature, iconUrl);

                }
            }
            catch (JSONException e)
            {

            }
        }
    }

    public static JSONObject getWeatherJSON(String city)
    {
        try
        {
            //URL url = new URL(String.format(OPEN_WEATHER_MAP_URL, lat, lon));
            URL url = new URL(String.format(OPEN_WEATHER_MAP_URL, city));
            HttpURLConnection connection =
                    (HttpURLConnection)url.openConnection();

            connection.addRequestProperty("x-api-key", OPEN_WEATHER_MAP_API);

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream()));

            StringBuffer json = new StringBuffer(1024);

            String tmp="";

            while((tmp = reader.readLine()) != null)
            {
                json.append(tmp).append("\n");
            }

            reader.close();

            JSONObject data = new JSONObject(json.toString());

            // This value will be 404 if the request was not successful
            if(data.getInt("cod") != 200)
            {
                return null;
            }

            return data;
        }
        catch(Exception e)
        {
            return null;
        }
    }
}
