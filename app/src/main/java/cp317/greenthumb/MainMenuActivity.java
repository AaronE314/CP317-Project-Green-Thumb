package cp317.greenthumb;

import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
/*test

 */

public class MainMenuActivity extends AppCompatActivity {
    private ImageButton settingsButton,scanButton,scanAlbumButton,searchButton;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_menu);

        //Initialize Buttons

        //Scan Page
        scanButton = findViewById(R.id.scanButton);
        scanButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                openScan();
            }
        });

        //Scan Page
        scanAlbumButton = findViewById(R.id.scanAlbumButton);
        scanAlbumButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                openAlbumScan();
            }
        });

        //Settings Page
        settingsButton = findViewById(R.id.settingsButton);
        settingsButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                openSettings();
            }
        });
        //Search Page
        searchButton = findViewById(R.id.searchButton);
        searchButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                openSearch();
            }
        });
        //Get background image from backend to display
    }

    public void openScan() {
        Intent i = new Intent(this, ScanActivity.class);
        startActivity(i);
    }

    public void openAlbumScan() {
        Intent i = new Intent(this, ScanActivity.class);
        startActivity(i);
    }

    public void openSettings() {
        Intent i = new Intent(this, SettingsActivity.class);
        startActivity(i);
    }

    public void openSearch() {
        Intent i = new Intent(this, SearchActivity.class);
        startActivity(i);
    }
}
