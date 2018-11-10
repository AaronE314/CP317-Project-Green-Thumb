package cp317.greenthumb;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import java.util.Set;
import android.content.Intent;

/*test

 */

public class MainMenuActivity extends AppCompatActivity {

    private Button settingsButton;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        settingsButton = findViewById(R.id.settingsButton);
        settingsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openSettings();
            }
        });
    }


    public void openSettings() {
        System.out.println("Going to settings activity...");
        Intent intent = new Intent(this, SettingsActivity.class);
        startActivity(intent);
    }

}
