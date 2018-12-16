# Backend Readme

## Installing Dependencies
After pulling the branch, make sure to do ```npm i``` so that your local node_modules/ folder is up-to-date. Otherwise, there may be missing dependencies that prevent the code from executing.

To add a new dependency, use ```npm i {name}```.

## Running the API
To run the API:
1. Run api.js.
2. Open the command line.
3. Run ```ngrok http 2500``` in the command line.
4. Requests can now be sent to the URL displayed.

## Sending a Request to the API
To send a request to the API (for testing purposes):
1. Go to [apitester.com](apitester.com).
2. Switch from "GET" to "POST" request.
3. Add the following header: ```Content-Type```. It must have the following value: ```application/json```. This tells the API that there will be a request body ("Post Data") in JSON format.
4. Fill out the body in valid JSON format.
5. Make the request.
6. Check that the request returned the expected body.
