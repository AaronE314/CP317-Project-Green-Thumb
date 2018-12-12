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

    public FEPhoto(int id, int plantid, int userid, char[] image, Date uploadData, int[] upvoteids, int[] downvoteids) {
        this.id = id;
        this.plantid = plantid;
        this.userid = userid;
        this.image = image;
        this.uploadData = uploadData;
        this.upvoteids = upvoteids;
        this.downvoteids = downvoteids;
    }

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