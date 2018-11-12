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


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    public void openSettings(View v) {
        System.out.println("Going to settings activity...");
        Intent intent = new Intent(this, SettingsActivity.class);
        startActivity(intent);
    }

}
