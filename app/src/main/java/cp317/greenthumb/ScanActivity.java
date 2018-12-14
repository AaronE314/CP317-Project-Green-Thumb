package cp317.greenthumb;

import android.hardware.Camera;
import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.provider.MediaStore;

public class ScanActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_scan);
        /** A safe way to get an instance of the Camera object. */
        //getCameraInstance();
        dispatchTakePictureIntent();

        //Intent intent = new Intent(this, MainMenuActivity.class);
        //startActivity(intent);
      //  finish();
    }
    static final int REQUEST_IMAGE_CAPTURE = 1;

    private void dispatchTakePictureIntent() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
        }
    }


    public static Camera getCameraInstance(){
        Camera c = null;
        try {
            System.out.println("try to open camera");
            c = Camera.open(1); // attempt to get a Camera instance
        }
        catch (Exception e){
            // Camera is not available (in use or does not exist)
        }
        return c; // returns null if camera is unavailable
    }

}
