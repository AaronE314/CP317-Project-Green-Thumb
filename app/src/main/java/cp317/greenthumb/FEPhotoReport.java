package cp317.greenthumb;

import java.util.Date;

public class FEPhotoReport {
    private int _id;
    private int _photoid;
    private int _userid;
    private String reportText;
    private Date date;

    public FEPhotoReport(int _id, int _photoid, int _userid, String reportText, Date date) {
        this._id = _id;
        this._photoid = _photoid;
        this._userid = _userid;
        this.reportText = reportText;
        this.date = date;
    }

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
