package pt.example.chartsapp;

import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.github.mikephil.charting.charts.PieChart;
import com.github.mikephil.charting.components.Description;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.data.PieData;
import com.github.mikephil.charting.data.PieDataSet;
import com.github.mikephil.charting.data.PieEntry;
import com.github.mikephil.charting.utils.ColorTemplate;

import java.util.ArrayList;
import java.util.List;

/**
 * Source: https://github.com/PhilJay/MPAndroidChart
 */
public class MainActivity extends AppCompatActivity
{
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PieChart chart = findViewById(R.id.chart);
        PieChart pieChart = findViewById(R.id.pie_chart);

        List<PieEntry> entries = new ArrayList<>();
        List<PieEntry> pieEntries = new ArrayList<>();

        entries.add(new PieEntry(18.5f, "Good"));
        entries.add(new PieEntry(26.7f, "Neutral"));
        entries.add(new PieEntry(24.0f, "Bad"));

        pieEntries.add(new PieEntry(12.3f, "Green"));
        pieEntries.add(new PieEntry(23.4f, "Yellow"));
        pieEntries.add(new PieEntry(34.5f, "Red"));

        PieDataSet set = new PieDataSet(entries, "Mood type");
        set.setColors(Color.GREEN, Color.YELLOW, Color.RED);
        set.setValueTextSize(12);

        PieDataSet pieDataSet = new PieDataSet(pieEntries, "Color type");
        pieDataSet.setColors(ColorTemplate.COLORFUL_COLORS);
        pieDataSet.setValueTextSize(12);

        PieData data = new PieData(set);
        chart.setData(data);

        PieData pieData = new PieData(pieDataSet);
        pieChart.setData(pieData);

        chart.setCenterText("Mood");
        chart.setCenterTextSize(16);
        chart.setUsePercentValues(true);
        chart.setDrawEntryLabels(false);

        pieChart.setCenterText("Color");
        pieChart.setCenterTextSize(16);
        pieChart.setUsePercentValues(true);
        pieChart.setDrawEntryLabels(false);

        chart.invalidate(); // refresh
        chart.animateXY(1000, 1000);

        pieChart.invalidate(); // refresh
        pieChart.animateXY(1000, 1000);

        Legend legend = chart.getLegend();
        legend.setEnabled(true);

        Legend l = pieChart.getLegend();
        l.setEnabled(true);

        Description description = chart.getDescription();
        description.setEnabled(false);

        Description d = pieChart.getDescription();
        d.setEnabled(false);

        //description.setText("Moods");

        //setNoDataText(String text): Sets the text that should appear if the chart is empty.

    }
}
