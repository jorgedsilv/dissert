package pt.ua.ieeta.urjourney.urjourney.checkin;

import java.util.List;

public class Study
{
    public String id;

    public String title;
    public String location;
    public String startdate;
    public String state;
    public String enddate;
    public String magicword;

    public List<String> participants;
    public List<String> approved;

    public Study()
    {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStartdate() {
        return startdate;
    }

    public void setStartdate(String startdate) {
        this.startdate = startdate;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getEnddate() {
        return enddate;
    }

    public void setEnddate(String enddate) {
        this.enddate = enddate;
    }

    public String getMagicword() {
        return magicword;
    }

    public void setMagicword(String magicword) {
        this.magicword = magicword;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }

    public List<String> getApproved() {
        return approved;
    }

    public void setApproved(List<String> approved) {
        this.approved = approved;
    }
}
