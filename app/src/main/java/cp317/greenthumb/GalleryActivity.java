package cp317.greenthumb;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.widget.Button;
import android.widget.GridView;

import java.util.List;

public class GalleryActivity extends AppCompatActivity implements Request.AsyncResponse {

    GridView gridview;
    Button backButton;

    List<Bitmap> photos;

    // when the gallery page is opened the gallery loads all the Bitmap images from b64strings from the database
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gallery);

        //make 3 image requests
        Requester.getBGPhoto(this);
        Requester.getBGPhoto(this);
        Requester.getBGPhoto(this);

        gridview = findViewById(R.id.galleryGridView);
        backButton = findViewById(R.id.galleryBackButton);

        //set back button click listener to load ? (home page or what ever page it came from)
        backButton.setOnClickListener();
    }

    @Override
    public void processFinish(String result) {
        byte[] bytePhoto = Base64.decode(result, Base64.DEFAULT);
        photos.add(BitmapFactory.decodeByteArray(bytePhoto, 0, bytePhoto.length));

        gridview.setAdapter(new GalleryPhotoAdapter(this, (Bitmap[]) photos.toArray()));
    }
}