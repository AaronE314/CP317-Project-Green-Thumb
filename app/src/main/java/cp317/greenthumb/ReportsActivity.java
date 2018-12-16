package cp317.greenthumb;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Button;
import android.app.AlertDialog.Builder;
import android.widget.EditText;

import android.widget.ImageButton;
import android.widget.Toast;
import android.app.DialogFragment;
import cp317.greenthumb.Request.AsyncResponse;
/**
 @Name: reportsActivity.java
 @Type: Activity class
 @Deception: this is Activity class that is used to generate Reports and send them .
 */




public class ReportsActivity extends AppCompatActivity {
    private ImageButton backButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reports);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });


        Button mStartReport = (Button) findViewById(R.id.startReportButton);
        mStartReport.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                AlertDialog.Builder mBuilder = new AlertDialog.Builder(ReportsActivity.this);
                View mView = getLayoutInflater().inflate(R.layout.activity_reports,null);
                final EditText mPhotoId = (EditText) mView.findViewById(R.id.photoId);
                final EditText mDate = (EditText) mView.findViewById(R.id.reportDate);
                final EditText mDetails = (EditText) mView.findViewById(R.id.reportDetails);
                Button mSendReport = (Button) mView.findViewById(R.id.sendReportButton);

                mSendReport.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view)   {
                        if (!mPhotoId.getText().toString().isEmpty() && !mDate.getText().toString().isEmpty() && !mDetails.getText().toString().isEmpty()){

                            //Toast.makeText(ReportsActivity.this,getString(R.string.success_report_msg),Toast.LENGTH_SHORT).show();

                            //default report, only need to update USER ID
                            //FEPhotoReport reportInfo = new FEPhotoReport(null,mPhotoId,null,mDetails,mDate);


                        }
                        else {
                            //Toast.makeText(ReportsActivity.this,getString(R.string.error_report_msg),Toast.LENGTH_SHORT).show();
                        }
                    }
                });
                mBuilder.setView(mView);
                AlertDialog dialog = mBuilder.create();
                dialog.show();


            }
        } );


    }
    public void backToGalleryView(View view){
        Intent intent = new Intent(this, GalleryActivity.class);
        startActivity(intent);
    }



}
