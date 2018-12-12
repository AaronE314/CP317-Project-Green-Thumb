package cp317.greenthumb;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.widget.GridView;

public class GalleryActivity extends AppCompatActivity {

    // when the gallery page is opened the gallery loads all the Bitmap images from b64strings from the database
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gallery);

        //GridView gridview = findViewById(R.id.gridView);

        // int userid = Requester.getUser().get_id();
        String[] b64Photos = new String[1]; // Requester.getPhotosByUser(userid);
        b64Photos[0] = "";
        Bitmap[] photos = new Bitmap[b64Photos.length];
        for (int i = 0; i < b64Photos.length; i++) {
            byte[] bytePhoto = Base64.decode(b64Photos[i], Base64.DEFAULT);
            photos[i] = BitmapFactory.decodeByteArray(bytePhoto, 0, bytePhoto.length);
        }
        //gridview.setAdapter(new GalleryPhotoAdapter(this, photos));
    }
}