package com.example.myfabapplication;

import android.app.Application;

/**
 * Created by Jorge Silva on 28/09/18.
 *
 * The data model
 */

public class Model extends Application
{
    private String title;
    private String subtitle;

    public Model(){

    }

    public Model(String title, String subtitle)
    {
        this.title = title;
        this.subtitle = subtitle;
    }

    /* Handling title */
    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    /* Handling subtitle */
    public String getSubtitle()
    {
        return subtitle;
    }

    public void setSubtitle(String subtitle)
    {
        this.subtitle = subtitle;
    }
}
