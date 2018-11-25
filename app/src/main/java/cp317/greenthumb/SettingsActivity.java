package cp317.greenthumb;


import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;
import android.content.SharedPreferences;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import android.widget.Toast;


public class SettingsActivity extends AppCompatActivity {


    // private Button logInButton, backButton, logOutButton;
    private SeekBar fontScaleSlider;
    private TextView previewLabel;
    private SharedPreferences prefs;
    private Button logOutButton;
    private GoogleSignInClient mGoogleSignInClient;

    // Seekbar specs
    int max = 10;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Connect this page to the layout page activity_settings.xml
        setContentView(R.layout.activity_settings);

        // Variable Assignments
        fontScaleSlider = findViewById(R.id.fontScaleSlider);
        previewLabel = findViewById(R.id.changeFont);
        logOutButton = findViewById(R.id.logOutButton);

        // Log out button listener
        logOutButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                try {
                    System.out.println("Signing out...");
                    mGoogleSignInClient.signOut();
                    Toast.makeText(getApplicationContext(), "Signed Out", Toast.LENGTH_LONG).show();
                    System.out.println("Sign Out Successful");
                }
                catch (NullPointerException e){
                    Toast.makeText(getApplicationContext(), "Cannot Sign Out", Toast.LENGTH_LONG).show();
                    System.out.println("Sign Out Unsuccessful");
                }
            }
        });

        // Prefs are SharedPreferences
        prefs = getSharedPreferences("fontsize", MODE_PRIVATE);
        System.out.println("Prefs = " + prefs);

        // Set the max and min for the slider
        fontScaleSlider.setMax(max);

        // Set the slider to the current text size
        int textSize = prefs.getInt("fontSize", MODE_PRIVATE);
        fontScaleSlider.setProgress(textSize);
        System.out.println("Text size = " + textSize);

        // Set the text size of preview label
        previewLabel.setTextSize(fontScaleSlider.getProgress());

        // Slider override functions
        fontScaleSlider.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

            @Override
            public void onStartTrackingTouch(SeekBar fontScaleSlider) { }

            @Override
            public void onProgressChanged(SeekBar fontScaleSlider, int progress,
                                          boolean fromUser){
                // Set previewLabel to the current size based on the slider
                previewLabel.setTextSize(progress+10);
                System.out.println("Font size = " + (progress+10));   // For testing
            }

            @Override
            public void onStopTrackingTouch(SeekBar fontScaleSlider){
                // When user releases slider, set the font size to that value
                prefs = getSharedPreferences("fontsize", MODE_PRIVATE);
                SharedPreferences.Editor ed = prefs.edit();
                ed.putFloat("fontsize", previewLabel.getTextSize());
                ed.commit();
            }
        });
    }

    // Opens main menu activity when back button clicked
    public void backToHomeView(View v) {
        System.out.println("Going to main activity...");
        Intent intent = new Intent(this, MainMenuActivity.class);
        startActivity(intent);
    }


    // Opens log in activity when log in button clicked
    public void logIn(View v) {
        System.out.println("Going to LogIn activity...");
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }
}
