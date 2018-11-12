package cp317.greenthumb;


import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.SeekBar;
import android.widget.TextView;
import android.content.SharedPreferences;


/*
    SettingsActivity controls the buttons and slider on the activity_settings.xml layout
 */




/*///////////////

To do:
    - font slider starts at max every time page reloads
    - get font to change on all pages
    - log out function

*////////////////



public class SettingsActivity extends AppCompatActivity {


   // private Button logInButton, backButton, logOutButton;
    private SeekBar fontScaleSlider;
    private TextView view;
    private SharedPreferences prefs;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);     // Connects this to the layout page


        // Fonts Scale Slider
        fontScaleSlider = findViewById(R.id.fontScaleSlider);
        view = findViewById(R.id.changeFont);

        prefs = getPreferences(MODE_PRIVATE);

        float fs = prefs.getFloat("fontsize", 10);
        fontScaleSlider.setProgress((int)fs);
        view.setTextSize(fontScaleSlider.getProgress());


        fontScaleSlider.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

            @Override
            public void onStopTrackingTouch(SeekBar fontScaleSlider){
                prefs = getPreferences(MODE_PRIVATE);
                SharedPreferences.Editor ed = prefs.edit();
                ed.putFloat("fontsize", view.getTextSize());
                ed.commit();
            }
            @Override
            public void onStartTrackingTouch(SeekBar fontScaleSlider) {

            }
            @Override
            public void onProgressChanged(SeekBar fontScaleSlider, int progress,
                                          boolean fromUser){
                view.setTextSize(progress);
                // Set text size of the whole app here
            }

        });


    }




    // Opens log in activity when called
    public void logIn(View v) {
        System.out.println("Going to LogIn activity...");
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }

    // Opens main menu activity when called
    public void backToHomeView(View v) {
        System.out.println("Going to main activity...");
        Intent intent = new Intent(this, MainMenuActivity.class);
        startActivity(intent);
    }

    // Log out function
//    public void logOut() {
        // Here's where the logout function goes
//    }





}
