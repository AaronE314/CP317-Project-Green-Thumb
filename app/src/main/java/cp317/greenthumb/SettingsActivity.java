package cp317.greenthumb;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.TextView;
import android.content.SharedPreferences;
//import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import android.widget.Toast;

public class SettingsActivity extends AppCompatActivity {


    // private Button logInButton, backButton, logOutButton;
    private SeekBar fontScaleSlider;
    private TextView previewLabel;
    private SharedPreferences prefs;
    private Button logOutButton;
   // private GoogleSignInClient mGoogleSignInClient;

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
        prefs = getSharedPreferences("fontsize", MODE_PRIVATE);
        System.out.println("prefs.getAll() = " + prefs.getAll());

        // Log out button listener
        logOutButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                try {
                  //  mGoogleSignInClient.signOut();
                    // Display successful sign-out on screen
                    Toast.makeText(getApplicationContext(), "Signed Out", Toast.LENGTH_LONG).show();
                }
                catch (NullPointerException e){
                    // Display unsuccessful sign-out on screen
                    Toast.makeText(getApplicationContext(), "Sign Out Unsuccessful", Toast.LENGTH_LONG).show();
                }
            }
        });


        // Set the max for the slider
        // Prefs are SharedPreferences
        prefs = getSharedPreferences("fontsize", MODE_PRIVATE);

        // Set the max and min for the slider
        fontScaleSlider.setMax(max);

        // Set the slider to the current text size
        float textSize = prefs.getFloat("fontsize", MODE_PRIVATE);
        textSize = (textSize-(textSize/7))/3;   // I don't know why, but this works
        System.out.println("textSize = " + textSize);
        fontScaleSlider.setProgress((int)(textSize-10));

        // Set the text size of preview label
        previewLabel.setTextSize(textSize);

        // Slider override functions
        fontScaleSlider.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

            @Override
            public void onStartTrackingTouch(SeekBar fontScaleSlider) { }

            @Override
            public void onProgressChanged(SeekBar fontScaleSlider, int progress,
                                          boolean fromUser){
                // Set previewLabel to the current size based on the slider
                previewLabel.setTextSize(progress+10);
            }

            @Override
            public void onStopTrackingTouch(SeekBar fontScaleSlider){
                // When user releases slider, set the font size to that value
                prefs = getSharedPreferences("fontsize", MODE_PRIVATE);
                SharedPreferences.Editor ed = prefs.edit();
                ed.putFloat("fontsize", previewLabel.getTextSize());
                ed.commit();

                // Sets global variable 'text_size' to wherever the slider is put
                //globalVars.text_size = prefs.getFloat("fontsize", MODE_PRIVATE);
                System.out.println("prefs at end of scaling = " + prefs.getFloat("fontsize", MODE_PRIVATE));
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
