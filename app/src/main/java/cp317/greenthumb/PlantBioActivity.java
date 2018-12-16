package cp317.greenthumb;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.Image;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.ProgressBar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import static cp317.greenthumb.Request.*;

public class PlantBioActivity extends AppCompatActivity implements AsyncResponse {

    //int plantID = getIntent().getIntExtra("plantID", 0);

    private TextView plantName, plantDescription;
    private ProgressBar progressBar;
    private ImageView imageView;
    private Image plantPhoto;
    private ArrayList<FEPlant> plants = new ArrayList<>();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_plant_bio);

        Requester.getPlantById(2, this);

        plantName = findViewById(R.id.plantTitle);
        plantDescription = findViewById(R.id.description);
        //plantName.setTextSize((int)globalVars.text_size);
        //plantDescription.setTextSize((int)globalVars.text_size);

        // set loading to visible
        progressBar = findViewById(R.id.progressBar);
        //progressBar.setVisibility(View.VISIBLE);

        imageView = findViewById(R.id.plantImage);
    }

    @Override
    public void processFinish(String result) {
        // set loading to gone
        //progressBar.setVisibility(View.GONE);

        // decode JSON
        String name = "";
        String bio = "";
        String image = "";

        Log.d("RESULT:", result);
        JSONObject reader;
        JSONArray reader2;


        try {
            reader = new JSONObject(result);
            reader2 = reader.getJSONArray("results");
            for (int i = 0; i < reader2.length(); i++) {
                JSONObject plantI = reader2.getJSONObject(i);
                JSONObject plant = plantI.getJSONObject("plant");
                int id = plant.getInt("id");
                name = plant.getString("name");
                bio = plant.getString("bio");
                JSONObject photo = plantI.getJSONObject("photo");
                image = photo.getString("image");
            }

            plantName.setText(name);
            plantName.setText(bio);
            byte[] decodedString = Base64.decode(image, Base64.DEFAULT);
            Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

            imageView.setImageBitmap(decodedByte);

        } catch (JSONException e) {
            e.printStackTrace();
        }


        // set UI stuffs

    }
}
