package cp317.greenthumb;

import java.util.Date;

public class FEPhoto {
    private int id;
    private int plantid;
    private int userid;
    private char[] image;
    private Date uploadData;
    private int[] upvoteids;
    private int[] downvoteids;

    public int getId() {
        return id;
    }

    public int getPlantid() {
        return plantid;
    }

    public int getUserid() {
        return userid;
    }

    public char[] getImage() {
        return image;
    }

    public Date getUploadData() {
        return uploadData;
    }

    public int[] getUpvoteids() {
        return upvoteids;
    }

    public int[] getDownvoteids() {
        return downvoteids;
    }
}
