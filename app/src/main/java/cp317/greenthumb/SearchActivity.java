package cp317.greenthumb;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TextInputEditText;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

import cp317.greenthumb.Request.AsyncResponse;

import static cp317.greenthumb.R.layout.activity_search;

public class SearchActivity extends AppCompatActivity implements AsyncResponse {
    private ImageButton backButton;
    private Button searchButton;
    private TextInputEditText searchTextBox;
    private ListView plantsList;
    private ArrayList<FEPlant> plants = new ArrayList<>();
    private String searchText;
    private ProgressBar progressBar;

    private HashMap<String, Integer> idNamePair;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        //Back to home page
        backButton = findViewById(R.id.backHome_btn);
        backButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                backHome();
            }
        });

        //click to display the plants list of search result;
        searchButton = findViewById(R.id.search_btn);
        searchButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                searchPlant();
            }
        });


        //Get search text from text box.
        searchTextBox = findViewById(R.id.search_txtBox);
        searchText = searchTextBox.getText().toString();

        idNamePair = new HashMap<>();

        //Plants list for search result.
        plantsList = findViewById(R.id.plantsList_box);
        //Go to plant page.
        plantsList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                TextView tv = (TextView) view;

                String name = tv.getText().toString();

                int plantId = idNamePair.get(name);

                gotoPlant(plantId);
            }
        });

        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.GONE);

    }

    public void backHome(){
        Intent i = new Intent(this, MainMenuActivity.class);
        startActivity(i);
    }

    public void searchPlant(){
        // Need a function to filter the plants to the Array List
        searchText = searchTextBox.getText().toString();
        Requester.getPlantByQuery(searchText, this);
        progressBar.setVisibility(View.VISIBLE);
    }

    public void gotoPlant(int plantId){

        Intent i = new Intent(this, PlantBioActivity.class);
        i.putExtra("plantId", plantId);
        startActivity(i);
    }

    @Override
    public void processFinish(String result) {
        progressBar.setVisibility(View.GONE);

        Log.d("RESULT:", result);
        JSONObject reader;
        JSONArray reader2;

        FEPlant plants[];

        try {
            reader = new JSONObject(result);
            reader2 = reader.getJSONArray("results");
            plants = new FEPlant[reader2.length()];
            for (int i = 0; i < reader2.length(); i++) {
                JSONObject plantI = reader2.getJSONObject(i);
                JSONObject plant = plantI.getJSONObject("plant");
                int id = plant.getInt("id");
                String name = plant.getString("name");
                String bio = plant.getString("bio");
                plants[i] = new FEPlant(id, name, bio);
                idNamePair.put(plants[i].get_name(), plants[i].get_id());
            }

            //Put the search results into the list box;
            ArrayAdapter<FEPlant> adapter = new ArrayAdapter<>(this,R.layout.searchrow,plants);
            plantsList.setAdapter(adapter);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
