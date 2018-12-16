
package cp317.greenthumb;
/**
 @Name: FEPlant.java
 @Type: object class
 @Deception: this is object class that holds plant data.
 */


public class FEPlant {
    private int _id;
    private String _name;
    private String _bio;

    FEPlant(int id, String name, String bio) {
        this._id = id;
        this._name = name;
        this._bio = bio;
    }

    public int get_id() {
        return _id;
    }

    public String get_name() {
        return _name;
    }

    public String get_bio() {
        return _bio;
    }

    @Override
    public String toString() {
        return this._name;
    }
}