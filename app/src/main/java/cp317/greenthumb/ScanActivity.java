package cp317.greenthumb;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.drawable.BitmapDrawable;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.content.FileProvider;
import android.util.Log;
import android.view.Display;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.ImageView;
import android.widget.ProgressBar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import cp317.greenthumb.Request.AsyncResponse;
/**
 @Name: ScanActivity.java
 @Type: Activity class
 @Deception: this is Activity class that is used to scan a plant and identify them .
 */

public class ScanActivity extends Activity implements AsyncResponse {

    private ImageView mImageView;
    private String mCurrentPhotoPath;

    private ProgressBar progressBar;

    private Bitmap bitmap;

    private ArrayList<RectF> boxes;

    private static final int REQUEST_TAKE_PHOTO = 1;

    private ViewTreeObserver vto;

    private int finalImageWidth;
    private int finalImageHeight;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //imageView=findViewById(R.id.ScanImageView);

        setContentView(R.layout.activity_scan);
        mImageView = findViewById(R.id.ScanImageView);

        boxes = new ArrayList<>();

        vto = mImageView.getViewTreeObserver();
//        vto.addOnPreDrawListener(() -> {
//            mImageView.getViewTreeObserver().removeOnDrawListener(this);
//            finalImageHeight = mImageView.getMeasuredHeight();
//            finalImageWidth = mImageView.getMaxWidth();
//            return true;
//        });


        progressBar = findViewById(R.id.progressBar2);
        progressBar.setVisibility(View.GONE);

        /** A safe way to get an instance of the Camera object. */
        dispatchTakePictureIntent();

    }

    private void dispatchTakePictureIntent() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

        // Ensure that there's a camera activity to handle the intent
        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
            // Create the File where the photo should go
            File photoFile = null;
            try {
                photoFile = createImageFile();
            } catch (IOException ex) {
                // Error occurred while creating the File
                Log.println(Log.ASSERT, "error", "Failed to create image");
            }
            // Continue only if the File was successfully created
            if (photoFile != null) {
                Uri photoURI = FileProvider.getUriForFile(this,
                        "cp317.greenthumb.fileprovider",
                        photoFile);
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);

                startActivityForResult(takePictureIntent, REQUEST_TAKE_PHOTO);

            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != RESULT_CANCELED) {
            if (requestCode == REQUEST_TAKE_PHOTO && resultCode == RESULT_OK) {
                galleryAddPic();
                //Bitmap photo = (Bitmap) data.getExtras().get("data");
                setPic();
            }
        }

    }


    private File createImageFile() throws IOException {
        // Create an image file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        File image = File.createTempFile(imageFileName, ".jpg", storageDir);

        // Save a file: path for use with ACTION_VIEW intents
        mCurrentPhotoPath = image.getAbsolutePath();
        return image;
    }

    private void galleryAddPic() {
        Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        File f = new File(mCurrentPhotoPath);
        Uri contentUri = Uri.fromFile(f);
        mediaScanIntent.setData(contentUri);
        this.sendBroadcast(mediaScanIntent);
    }

    private void setPic(){ //Bitmap photo) {
        // Get the dimensions of the View

        int targetW = mImageView.getLayoutParams().width;
        int targetH = mImageView.getLayoutParams().height;

        // Get the dimensions of the bitmap
        BitmapFactory.Options bmOptions = new BitmapFactory.Options();
        bmOptions.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(mCurrentPhotoPath, bmOptions);
        int photoW = bmOptions.outWidth;
        int photoH = bmOptions.outHeight;

        // Determine how much to scale down the image
        int scaleFactor = Math.min(photoW / targetW, photoH / targetH);

        // Decode the image file into a Bitmap sized to fill the View
        bmOptions.inJustDecodeBounds = false;
        bmOptions.inSampleSize = scaleFactor;

        bitmap = BitmapFactory.decodeFile(mCurrentPhotoPath, bmOptions);

        File imageFile = new File(mCurrentPhotoPath);
        FileInputStream fis = null;
        try {
            fis = new FileInputStream(imageFile);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        Bitmap actualImage = BitmapFactory.decodeStream(fis);

        try {
            bitmap = rotateImageIfRequired(bitmap, mCurrentPhotoPath);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Canvas canvas = new Canvas(bitmap);
        canvas.drawBitmap(bitmap, 0, 0, null);

        mImageView.setImageDrawable(new BitmapDrawable(getResources(), bitmap));

        //Log.d("DEBUG", canvas.getWidth() + " " + canvas.getHeight());
        //mImageView.setImageBitmap(bitmap);
        Requester.getPlantByImage(actualImage, canvas.getWidth(), canvas.getHeight(), this);
        progressBar.setVisibility(View.VISIBLE);

    }

    private static Bitmap rotateImageIfRequired(Bitmap img, String path) throws IOException {

        ExifInterface ei = new ExifInterface(path);
        int orientation = ei.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);

        switch (orientation) {
            case ExifInterface.ORIENTATION_ROTATE_90:
                return rotateImage(img, 90);
            case ExifInterface.ORIENTATION_ROTATE_180:
                return rotateImage(img, 180);
            case ExifInterface.ORIENTATION_ROTATE_270:
                return rotateImage(img, 270);
            default:
                return img;
        }
    }

    private static Bitmap rotateImage(Bitmap img, int degree) {
        Matrix matrix = new Matrix();
        matrix.postRotate(degree);
        Bitmap rotatedImg = Bitmap.createBitmap(img, 0, 0, img.getWidth(), img.getHeight(), matrix, true);
        img.recycle();
        return rotatedImg;
    }

    @Override
    public void processFinish(String result) {
        progressBar.setVisibility(View.GONE);

        //Log.d("RESULT:", result);
        // Decode JSON

        JSONObject reader;
        JSONArray reader2;
        FEPlant plants[];
        float boxesPoints[][][];

        try {
            reader = new JSONObject(result);
            reader2 = reader.getJSONArray("results");
            plants = new FEPlant[reader2.length()];
            boxesPoints = new float[reader2.length()][][];
            for (int i = 0; i < reader2.length(); i++) {
                JSONObject plantI = reader2.getJSONObject(i);
                JSONObject plant = plantI.getJSONObject("plant");
                int id = plant.getInt("id");
                String name = plant.getString("name");
                String bio = plant.getString("bio");
                plants[i] = new FEPlant(id, name, bio);
                JSONArray boxes = plantI.getJSONArray("boxes");
                boxesPoints[i] = new float[boxes.length()][4];
                for (int j = 0; j < boxes.length(); j++) {
                    JSONObject boxesJ = boxes.getJSONObject(j);
                    JSONObject top = boxesJ.getJSONObject("topLeft");
                    float topX = (float) top.getDouble("x");
                    float topY = (float) top.getDouble("y");
                    JSONObject bottom = boxesJ.getJSONObject("bottomRight");
                    float bottomX = (float) bottom.getDouble("x");
                    float bottomY = (float) bottom.getDouble("y");
                    boxesPoints[i][j][0] = topX;
                    boxesPoints[i][j][1] = topY;
                    boxesPoints[i][j][2] = bottomX;
                    boxesPoints[i][j][3] = bottomY;
                }

            }


            Paint paint = new Paint();
            paint.setStyle(Paint.Style.STROKE);
            paint.setColor(Color.WHITE);
            paint.setStrokeWidth(50);
            paint.setTextSize(20);
            Canvas canvas = new Canvas(bitmap);
            canvas.drawBitmap(bitmap, 0, 0, null);

            for (int i = 0; i < boxesPoints.length; i++) {

                for (int j = 0; j < boxesPoints[i].length; j ++) {
                    paint.setStyle(Paint.Style.STROKE);
                    paint.setColor(Color.WHITE);
                    paint.setStrokeWidth(50);
                    paint.setTextSize(200);
                    Rect bounds = new Rect();
                    paint.getTextBounds(plants[i].get_name(), 0, 1, bounds);
                    RectF rectF = new RectF(boxesPoints[i][j][0],boxesPoints[i][j][1],boxesPoints[i][j][2],boxesPoints[i][j][3]);
                    boxes.add(rectF);
                    canvas.drawRect(rectF, paint);
                    paint.setStyle(Paint.Style.FILL);
                    canvas.drawRect(new RectF(boxesPoints[i][j][0],boxesPoints[i][j][1]-200,boxesPoints[i][j][3],boxesPoints[i][j][1]), paint);
                    paint.setColor(Color.BLACK);
                    canvas.drawText(plants[i].get_name(), boxesPoints[i][j][0], boxesPoints[i][j][1] - 20, paint);
                }


            }
            mImageView.setImageDrawable(new BitmapDrawable(getResources(), bitmap));

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        int action = event.getAction();
        float x = event.getX();
        float y = event.getY();
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int height = size.y;


        switch(action) {
            case MotionEvent.ACTION_DOWN:
                for(int k=0;k<boxes.size();k++) {
                    if (boxes.get(k).contains(x / width, y / height)) {
                        Intent i = new Intent(this, PlantBioActivity.class);
                        //i.putExtra("plantID", plantID);
                        startActivity(i);
                    }
                }

        }

        return true ;

    }

}
