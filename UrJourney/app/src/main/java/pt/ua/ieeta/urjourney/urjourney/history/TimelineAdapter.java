package pt.ua.ieeta.urjourney.urjourney.history;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

import pt.ua.ieeta.urjourney.urjourney.R;

public class TimelineAdapter extends RecyclerView.Adapter<TimelineAdapter.MyViewHolder>
{
    private List<Timeline> timelineList;

    public class MyViewHolder extends RecyclerView.ViewHolder
    {
        //public TextView mood;
        public ImageView mood;
        public TextView time;

        public MyViewHolder(View view)
        {
            super(view);
            //mood = (TextView) view.findViewById(R.id.mood);
            mood = (ImageView) view.findViewById(R.id.mood);
            time = (TextView) view.findViewById(R.id.timestamp);
        }
    }

    public TimelineAdapter(List<Timeline> timelineList)
    {
        this.timelineList = timelineList;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType)
    {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.timeline_list, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position)
    {
        Timeline timeline = timelineList.get(position);
        //holder.mood.setText(timeline.getMood());

        if(timeline.getMood().equals("green"))
        {
            holder.mood.setImageResource(R.drawable.ic_sentiment_satisfied);
        }
        if(timeline.getMood().equals("yellow"))
        {
            holder.mood.setImageResource(R.drawable.ic_sentiment_neutral);
        }
        if(timeline.getMood().equals("red"))
        {
            holder.mood.setImageResource(R.drawable.ic_sentiment_dissatisfied);
        }

        String timestamp = timeline.getDate() + ", " + timeline.getTime();

        //holder.time.setText(timeline.getTime());
        holder.time.setText(timestamp);
    }

    @Override
    public int getItemCount()
    {
        return timelineList.size();
    }
}
