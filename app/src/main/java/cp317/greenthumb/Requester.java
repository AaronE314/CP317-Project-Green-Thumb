package cp317.greenthumb;
import android.graphics.Bitmap;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.util.Random;

import cp317.greenthumb.Request.AsyncResponse;

public class Requester {

    public static void createUser(int userId) {

        String postBody = "{\"userId\": \"" + userId + "\"}";
        String endpoint = "/users/add";
        new Request(null).execute(endpoint, postBody);
    }

    public static void getBGPhoto(AsyncResponse response) {

        Random rand = new Random();
        int photoId = rand.nextInt(5) + 1;

        String postBody = "{ \"photoId\":" + photoId + "}";
        String endpoint = "/photos/byId";

        new Request(response).execute(endpoint, postBody);
    }

    public static void getPhotoReports(int adminId, AsyncResponse response) {
        String postBody = "{\"adminId\": \"" + adminId + "\", \"startIndex\": 0}";
        String endpoint = "/photoReports/list/byDate";
        new Request(response).execute(endpoint, postBody);
    }

    public static void getPlantByImage(Bitmap image, int width, int height, AsyncResponse response) {

//        Bitmap bm = BitmapFactory.decodeFile(image);
//        bm.getHeight();
//        bm.getWidth();
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);
//        String encodedImage = Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 70, byteArrayOutputStream);
        byte[] bytes = byteArrayOutputStream.toByteArray();

        String encodedImage = Base64.encodeToString(bytes, Base64.DEFAULT);

        encodedImage = encodedImage.replace("\n", "");

        String postBody = "{ \"image\": \"" + encodedImage + "\", \"width\": " + width + ", \"height\": " +
                height + ", \"maxPhotos\": 1 }";
        Log.d("DEBUG", encodedImage);
//        Log.d("DEBUG", postBody);
        String endpoint = "/plants/byImage";

        new Request(response).execute(endpoint, postBody);

    }

    public static void getPlantByQuery(String query, AsyncResponse response) {

        String postBody = "{ \"query\": \"" + query + "\"}";
        String endPoint = "/plants/byQuery";

        new Request(response).execute(endPoint, postBody);
    }

    public static void getUser(int userId, AsyncResponse response) {

        String postBody = "{ \"userId\": \"" + userId + "\"}";
        String endpoint = "/users/byId";

        new Request(response).execute(endpoint, postBody);

    }

    public static void handlePhotoReport(int adminId, int photoReportId, int adminAction, AsyncResponse response) {

        String postBody = "{ \"adminAction\": " + adminAction + ", \"adminId\": \"" +
                adminId + "\", \"photoReportId\": " + photoReportId + "}";
        String endPoint = "/photoReports/handle";

        new Request(response).execute(endPoint, postBody);
    }

    public static void reportPhoto(int userId, int photId, String reportText) {

        String postBody = "{ \"photoId\":" + photId + ", \"reportText\": \"" + reportText +
                "\" + \"userId\": \"" + userId +"\"}";

        String endPoint = "/photoReports/add";

        new Request(null).execute(endPoint, postBody);
    }

    public static void uploadPhoto(Bitmap image, int userId, int plantId) {

//        Bitmap bm = BitmapFactory.decodeFile(image);
//        bm.getHeight();
//        bm.getWidth();
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);
//        String encodedImage = Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        byte[] bytes = byteArrayOutputStream.toByteArray();

        String encodedImage = Base64.encodeToString(bytes, Base64.DEFAULT);

        String postBody = "{ \"image\":\"" + encodedImage + ", \"plantId\":" +
                plantId +", \"userId\": \"" + userId + "\"}";

        String endPoint = "/photos/add";

        new Request(null).execute(endPoint, postBody);
    }

    public static void votePhoto(int userId, int photoId, Boolean up) {

        String postBody = "{ \"photoId\": " + photoId + ", \"up\": " + up +
                ", \"userId\":\"" + userId + "\"}";

        String endPoint = "/photos/vote";

        new Request(null).execute(endPoint, postBody);
    }

}
