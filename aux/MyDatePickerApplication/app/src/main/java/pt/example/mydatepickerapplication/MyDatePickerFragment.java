package pt.example.mydatepickerapplication;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.widget.DatePicker;
import android.widget.Toast;

import java.util.Calendar;


public class MyDatePickerFragment extends DialogFragment
{
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState)
    {
        final Calendar c = Calendar.getInstance();
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);

        //https://www.dev2qa.com/android-datepickerdialog-timepickerdialog-spinner-example/
        // Create the new DatePickerDialog instance.
        DatePickerDialog datePickerDialog = new DatePickerDialog(getActivity(), android.R.style.Theme_Holo_Light_Dialog, dateSetListener, year, month, day);

        //return new DatePickerDialog(getActivity(), dateSetListener, year, month, day);
        return datePickerDialog;

        //return new DatePickerDialog(getActivity(),android.R.style.Theme_Holo_Dialog,this, year,month, day);
    }

    private DatePickerDialog.OnDateSetListener dateSetListener =
            new DatePickerDialog.OnDateSetListener() {
                public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth)
                {

                    /*Toast.makeText(getActivity(), "selected date is " + view.getYear() +
                            " / " + (view.getMonth()+1) +
                            " / " + view.getDayOfMonth(), Toast.LENGTH_SHORT).show();*/

                    //Toast.makeText(getActivity(), "selected date is " + y + " / " + m + " / " + d, Toast.LENGTH_SHORT).show();

                    int month = monthOfYear + 1;
                    String formattedMonth = "" + month;
                    String formattedDayOfMonth = "" + dayOfMonth;

                    if(month < 10)
                    {

                        formattedMonth = "0" + month;
                    }
                    if(dayOfMonth < 10)
                    {

                        formattedDayOfMonth = "0" + dayOfMonth;
                    }
                    String output = formattedDayOfMonth + "/" + formattedMonth + "/" + year;
                    Toast.makeText(getActivity(), output, Toast.LENGTH_SHORT).show();
                }
            };
}