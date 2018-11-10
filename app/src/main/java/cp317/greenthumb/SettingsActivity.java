package cp317.greenthumb;


import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;

/*
    SettingsActivity controls the buttons and slider on the activity_settings.xml layout
 */

public class SettingsActivity extends AppCompatActivity {


    private Button logInButton, backButton, logOutButton;
    private SeekBar fontScaleSlider;
    private TextView view;
    int min = 10, max = 20, current = 15;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);     // Connects this to the layout page


        // Call logInButton function on click
        logInButton = findViewById(R.id.logInButton);
        logInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                logIn();
            }
        });


        // Call backButton function on click
        backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               backToHomeView();
           }
        });



        // Call logOutButton function on click
        logOutButton = findViewById(R.id.logOutButton);
        logOutButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               logOut();
           }
        });



        // fontScaleSlider
        view = findViewById(R.id.changeFont);

        fontScaleSlider.setMax(max-min);
        fontScaleSlider.setProgress(current-min);

        fontScaleSlider =  findViewById(R.id.fontScaleSlider);
        fontScaleSlider.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

            @Override
            public void onProgressChanged(SeekBar fontScaleSlider, int progress, boolean b) {
                current = progress + min;
                view.setTextSize(Float.valueOf(current));
            }

            @Override
            public void onStartTrackingTouch(SeekBar fontScaleSlider) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar fontScaleSlider) {

            }
        });
    }



    


    // Opens log in activity when called
    public void logIn() {
        System.out.println("Going to LogIn activity...");
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }

    // Opens main menu activity when called
    public void backToHomeView() {
        System.out.println("Going to main activity...");
        Intent intent = new Intent(this, MainMenuActivity.class);
        startActivity(intent);
    }

    // Log out function
    public void logOut() {
        // Here's where the logout function goes
    }

}
