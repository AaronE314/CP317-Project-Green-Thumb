package cp317.greenthumb;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TextInputEditText;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ListView;

import java.util.ArrayList;

import static cp317.greenthumb.R.layout.activity_search;

public class SearchActivity extends AppCompatActivity {
    private ImageButton backButton;
    private Button searchButton;
    private TextInputEditText searchTextBox;
    private ListView plantsList;
    private ArrayList<FEPlant> plants = new ArrayList<>();
    private String searchText;

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


        //Plants list for search result.
        plantsList = findViewById(R.id.plantsList_box);
        //Go to plant page.
        plantsList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                gotoPlant(id);
            }
        });
    }

    public void backHome(){
        Intent i = new Intent(this, MainMenuActivity.class);
        startActivity(i);
    }

    public void searchPlant(){
        // Need a function to filter the plants to the Array List

        //Put the search results into the list box;
        ArrayAdapter<FEPlant> adapter = new ArrayAdapter<>(this,R.layout.activity_search,plants);
        plantsList.setAdapter(adapter);
    }

    public void gotoPlant(long plantID){

        Intent i = new Intent(this, PlantDescriptionActivity.class);
        startActivity(i);
    }
}

