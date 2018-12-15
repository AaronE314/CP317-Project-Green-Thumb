package cp317.greenthumb;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.util.Random;

public class Requester {

    public static void createUser(int userId) {

        String postBody = "{\"userId\": \"" + userId + "\"}";
        String endpoint = "/users/add";
        new Request().execute(endpoint, postBody);
    }

    public static void getBGPhoto() {

        Random rand = new Random();
        int photoId = rand.nextInt(5) + 1;

        String postBody = "{ \"photoId\":" + photoId + "}";
        String endpoint = "/photos/byId";

        new Request().execute(endpoint, postBody);
    }

    public static void getPhotoReports(int adminId) {
        String postBody = "{\"adminId\": \"" + adminId + "\", \"startIndex\": 0}";
        String endpoint = "/photoReports/list/byDate";
        new Request().execute(endpoint, postBody);
    }

    public static void getPlantByImage(String image, int width, int height) {

        Bitmap bm = BitmapFactory.decodeFile(image);
        bm.getHeight();
        bm.getWidth();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        String encodedImage = Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);

        String postBody = "{ \"image\": \"" + encodedImage + "\", \"width\": " + width + "\", \"height\": " +
                height + " }";
        String endpoint = "/plants/byImage";

        new Request().execute(endpoint, postBody);

    }

    public static void getPlantByQuery(String query, Context context) {

        String postBody = "{ \"query\": \"" + query + "\"}";
        String endPoint = "/plants/byQuery";

        new Request().execute(endPoint, postBody, context);
    }

    public static void getUser(int userId) {

        String postBody = "{ \"userId\": \"" + userId + "\"}";
        String endpoint = "/users/byId";

        new Request().execute(endpoint, postBody);

    }

    public static void handlePhotoReport(int adminId, int photoReportId, int adminAction) {

        String postBody = "{ \"adminAction\": " + adminAction + ", \"adminId\": \"" +
                adminId + "\", \"photoReportId\": " + photoReportId + "}";
        String endPoint = "/photoReports/handle";

        new Request().execute(endPoint, postBody);
    }

    public static void reportPhoto(int userId, int photId, String reportText) {

        String postBody = "{ \"photoId\":" + photId + ", \"reportText\": \"" + reportText +
                "\" + \"userId\": \"" + userId +"\"}";

        String endPoint = "/photoReports/add";

        new Request().execute(endPoint, postBody);
    }

    public static void uploadPhoto(String image, int userId, int plantId) {

        Bitmap bm = BitmapFactory.decodeFile(image);
        bm.getHeight();
        bm.getWidth();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        String encodedImage = Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);

        String postBody = "{ \"image\":\"" + encodedImage + ", \"plantId\":" +
                plantId +", \"userId\": \"" + userId + "\"}";

        String endPoint = "/photos/add";

        new Request().execute(endPoint, postBody);
    }

    public static void votePhoto(int userId, int photoId, Boolean up) {

        String postBody = "{ \"photoId\": " + photoId + ", \"up\": " + up +
                ", \"userId\":\"" + userId + "\"}";

        String endPoint = "/photos/vote";

        new Request().execute(endPoint, postBody);
    }

}
