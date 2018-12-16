package cp317.greenthumb;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
/**
 @Name: SplashScreenActivity.java
 @Type: Activity class
 @Deception: this is Activity class that is used to display the Startup image when the app is launched .
 */
public class SplashScreenActivity extends Activity {

    /**
     *
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash_screen);
        Intent intent = new Intent(this, MainMenuActivity.class);
        startActivity(intent);
        finish();
    }

}