package cp317.greenthumb;


import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;

/*
    SettingsActivity controls the buttons and slider on the activity_settings.xml layout
 */

public abstract class SettingsActivity extends AppCompatPreferenceActivity {


    private Button logInButton, backButton, logOutButton;
    private SeekBar fontScaleSlider;
    int min = 10, max = 20, current = 15;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);     // Connects this to the layout page


        //logInButton

        logInButton = findViewById(R.id.logInButton);
        logInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                logIn();
            }
        });


        //backButton

        backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               backToHomeView();
           }
        });

        //logOutButton

        logOutButton = findViewById(R.id.logOutButton);
        logOutButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               logOut();
           }
        });



        // fontScaleSlider

        fontScaleSlider.setMax(max-min);
        fontScaleSlider.setProgress(current-min);


        fontScaleSlider = findViewById(R.id.fontScaleSlider);
        fontScaleSlider.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

            @Override
            public void onProgressChanged(Seekbar fontScaleSlider, int progress, boolean b) {
                current = progress + min;
            }

            @Override
            public void onStartTrackingTouch(Seekbar fontScaleSlider) {

            }


            @Override
            public void onStopTrackingTouch(Seekbar fontScaleSlider) {

            }
        });
    }




    // Functions called when settings are clicked
    public void logIn() {
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }

    public void backToHomeView() {
        Intent intent = new Intent(this, MainMenuActivity.class);
        startActivity(intent);
    }

    public void logOut() {
        // Here's where the logout function goes
    }

}
