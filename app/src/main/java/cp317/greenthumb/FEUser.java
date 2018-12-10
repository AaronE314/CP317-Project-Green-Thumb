package cp317.greenthumb;

public class FEUser {
    private int _id;
    private int _bans;

    FEUser(int id, int bans) {
        this._id = id;
        this._bans = bans;
    }

    public int get_id() {
        return _id;
    }

    public int get_bans() {
        return _bans;
    }
}
