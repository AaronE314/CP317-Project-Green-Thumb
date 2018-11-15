package cp317.greenthumb;

import android.hardware.Camera;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import java.io.IOException;



/**
 * Camera / Scanview by Sachintha
 */

public class CameraFragment extends Fragment implements SurfaceHolder.Callback{
    Camera camera;
    SurfaceView mSurfaceView;
    SurfaceHolder mSurfaceHolder;

    public static CameraFragment newInstance(){
        CameraFragment fragment = new CameraFragment();
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState){
        View view = inflater.inflate(R.layout.fragment_camera, container,false);

        mSurfaceView = (SurfaceView) view.findViewById(R.id.surfaceView);   //links java file with the XML front end
        mSurfaceHolder = mSurfaceView.getHolder();                          //bridge between the surface view and the camera
        mSurfaceHolder.addCallback(this);
        mSurfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
        return view;
    }

    @Override
    public void surfaceCreated(SurfaceHolder surfaceHolder) {
        camera = Camera.open();
        Camera.Parameters parameters;
        parameters = camera.getParameters();        //set up parameters such as the frame rate and focus mode
        camera.setDisplayOrientation(90);           //default is horizontal so we adjust the angle to suit a vertical phone
        parameters.setPreviewFrameRate(30);
        parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
        camera.setParameters(parameters);
        try {
            camera.setPreviewDisplay(surfaceHolder);
        }catch (IOException e){
            e.printStackTrace();
        }
        camera.startPreview();
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {

    }
}