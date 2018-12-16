package cp317.greenthumb;
import android.graphics.Bitmap;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.util.Random;

import cp317.greenthumb.Request.AsyncResponse;
/**
 @Name: Requester.java
 @Type: java class
 @Deception: this is java class that is used by other classes to all the request class to call the api.
 */

public class Requester {

    /**
     * Calls the api to create a user
     * @param userId the userId to create
     */
    public static void createUser(int userId) {

        String postBody = "{\"userId\": \"" + userId + "\"}";
        String endpoint = "/users/add";
        new Request(null).execute(endpoint, postBody);
    }

    /**
     * gets a random image for the background
     * @param response the class the implements AsyncResponse for the return
     */
    public static void getBGPhoto(AsyncResponse response) {

        Random rand = new Random();
        int photoId = rand.nextInt(5) + 1;

        String postBody = "{ \"photoId\":" + photoId + "}";
        String endpoint = "/photos/byId";

        new Request(response).execute(endpoint, postBody);
    }

    /**
     * gets the photoReports from the api
     * @param adminId the admin that is getting the report
     * @param response the class the implements AsyncResponse for the return
     */
    public static void getPhotoReports(int adminId, AsyncResponse response) {
        String postBody = "{\"adminId\": \"" + adminId + "\", \"startIndex\": 0}";
        String endpoint = "/photoReports/list/byDate";
        new Request(response).execute(endpoint, postBody);
    }

    /**
     * Identifies the image using the api based on an image
     * @param image the image to identify as a bitmap
     * @param width the width of the image
     * @param height the height of the image
     * @param response the class the implements AsyncResponse for the return
     */
    public static void getPlantByImage(Bitmap image, int width, int height, AsyncResponse response) {

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 70, byteArrayOutputStream);
        byte[] bytes = byteArrayOutputStream.toByteArray();

        String encodedImage = Base64.encodeToString(bytes, Base64.DEFAULT);

        encodedImage = encodedImage.replace("\n", "");

        String postBody = "{ \"image\": \"" + encodedImage + "\", \"width\": " + width + ", \"height\": " +
                height + ", \"maxPhotos\": 1 }";

        String endpoint = "/plants/byImage";

        new Request(response).execute(endpoint, postBody);

    }

    /**
     * Gets the plants with the query in either the the name or bio
     * @param query the query to search
     * @param response the class the implements AsyncResponse for the return
     */
    public static void getPlantByQuery(String query, AsyncResponse response) {

        String postBody = "{ \"query\": \"" + query + "\"}";
        String endPoint = "/plants/byQuery";

        new Request(response).execute(endPoint, postBody);
    }

    /**
     * gets the plant with the associated id
     * @param plantId the id of the plant
     * @param response the class the implements AsyncResponse for the return
     */
    public static void getPlantById(int plantId, AsyncResponse response) {

        String postBody = "{ \"plantId\": " + plantId + "}";
        String endPoint = "/plants/byId";

        new Request(response).execute(endPoint, postBody);
    }

    /**
     * gets the user with the given id from the api
     * @param userId the userid of the user to get
     * @param response the class the implements AsyncResponse for the return
     */
    public static void getUser(int userId, AsyncResponse response) {

        String postBody = "{ \"userId\": \"" + userId + "\"}";
        String endpoint = "/users/byId";

        new Request(response).execute(endpoint, postBody);

    }

    /**
     * handles a photoReport
     * @param adminId the admin handling it
     * @param photoReportId the id of the report
     * @param adminAction the action the admin wants to do
     * @param response the class the implements AsyncResponse for the return
     */
    public static void handlePhotoReport(int adminId, int photoReportId, int adminAction, AsyncResponse response) {

        String postBody = "{ \"adminAction\": " + adminAction + ", \"adminId\": \"" +
                adminId + "\", \"photoReportId\": " + photoReportId + "}";
        String endPoint = "/photoReports/handle";

        new Request(response).execute(endPoint, postBody);
    }

    /**
     * reports a photo
     * @param userId the id of the user who uploaded the photo
     * @param photoId the id of the photo to report
     * @param reportText the reason of the report
     */
    public static void reportPhoto(int userId, int photoId, String reportText) {

        String postBody = "{ \"photoId\":" + photoId + ", \"reportText\": \"" + reportText +
                "\" + \"userId\": \"" + userId +"\"}";

        String endPoint = "/photoReports/add";

        new Request(null).execute(endPoint, postBody);
    }


    /**
     * upload a photo to the database
     * @param image the image to upload
     * @param userId the user who uploaded it
     * @param plantId the id of what the photo is
     */
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

    /**
     * vote on a photo
     * @param userId the user who voted
     * @param photoId the photo that was voted
     * @param up up vote or down vote
     */
    public static void votePhoto(int userId, int photoId, Boolean up) {

        String postBody = "{ \"photoId\": " + photoId + ", \"up\": " + up +
                ", \"userId\":\"" + userId + "\"}";

        String endPoint = "/photos/vote";

        new Request(null).execute(endPoint, postBody);
    }

}
