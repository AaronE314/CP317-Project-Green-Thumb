package cp317.greenthumb;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Request extends AsyncTask<String, Void, String> {

    private String API_BASE_URL="http://baf0b389.ngrok.io";

    public interface AsyncResponse {
        void processFinish(String result);
    }

    private AsyncResponse delegate = null;

    public Request(AsyncResponse delegate) {
        this.delegate = delegate;
    }

    @Override
    protected void onPostExecute(String s) {
//        if (s != null) {
//            Log.d("RESULT: ", s);
//        }

        if (this.delegate != null) {
            this.delegate.processFinish(s);
        }
    }

    @Override
    protected String doInBackground(String... body) {

        String val[] = new String[1];
        try {
            //open http connection
            HttpURLConnection httpcon = (HttpURLConnection) ((new URL(API_BASE_URL + body[0])).openConnection());
            httpcon.setDoOutput(true);
            httpcon.setRequestProperty("Content-Type", "application/json");
            //httpcon.setRequestProperty("Accept", "application/json");
            httpcon.setRequestMethod("POST");
            httpcon.connect();
            /*
             * Output user credentials over HTTP Output Stream
             */
            //need to fix format of this
            String output = body[1];
            byte[] outputBytes = output.getBytes("UTF-8");
            OutputStream os = httpcon.getOutputStream();

            os.write(outputBytes);
            os.close();
            //get response
            InputStream is = httpcon.getInputStream();
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(is));
            StringBuilder response = new StringBuilder();
            String currentLine;

            while ((currentLine = in.readLine()) != null)
                response.append(currentLine);
            in.close();
            httpcon.disconnect();
            val[0] = response.toString();

            //Log.d("DEBUG", val[0]);
        } catch (android.os.NetworkOnMainThreadException e) {
            Log.e("HTTP ERROR: ", "NetworkOnMainThreadException");
        } catch (Exception e) {
            Log.e("HTTP ERROR", e.toString());
        }

        return val[0];
    }
}