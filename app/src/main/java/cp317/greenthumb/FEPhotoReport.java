package cp317.greenthumb;

import java.util.Date;

public class FEPhotoReport {
    private int _id;
    private int _photoid;
    private int _userid;
    private String reportText;
    private Date date;

    public int get_id() {
        return _id;
    }

    public int get_photoid() {
        return _photoid;
    }

    public int get_userid() {
        return _userid;
    }

    public String getReportText() {
        return reportText;
    }

    public Date getDate() {
        return date;
    }
}
