# EAM Light Frontend
EAM Light Frontend is Web application providing the core functionality of Infor EAM Extended. 

This project was created using the create-react-app application and you might consult its documentation for further configuration details. 

## Configuration
You can modify the following environment variables in the `Dockerfile` before building the docker image to change some of the default settings:

| Variable        | Required?  | Default value |
| ------------- | -----:|---------:|
| REACT_APP_BACKEND           | No | /apis/rest |
| PUBLIC_URL         | No | / |
| REACT_APP_LOGIN_METHOD | No | STD |

REACT_APP_BACKEND - Defines EAM Light Backend URL. Properly formatted REACT_APP_BACKEND should have a leading, but no trailing slash. 

**Note:** In case you are locally deploying the frontend and backend server, you have to change this value to: http://your_machine:8081/apis/rest.

PUBLIC_URL - By default EAM Light Frontend should be hosted at the web server's root. Please change this variable if EAM Light will be served from a sub-directory on your server.  

REACT_APP_LOGIN_METHOD - Change this parameter if you would like to disable the standard login prompt window and secure EAM Light with shared authentication schema of your enterprise. This requires further configuration of EAM Light Backend (explained on the project's website).

### Back-end URL 

The back-end URL for the front-end application is set when the application server starts. 
There is a configuration javascript file (public/environmentConfig.js) this file is imported into the main index.html.

The images starts with a custom startup script (scripts/startup.sh) which will first actualize this configuration from the environment variables (vis envsubst) and then start nginx as a foreground process.

The back-end url from the imported configuration script can be used/referenced like this : "window.environment.REACT_APP_BACKEND_URL". 

Parts:
- window: This object is supported by all browsers. It represents the browser's [window](https://www.w3schools.com/js/js_window.asp). 
- environment: This is the custom object where we are going to store the configuration values. This object can have functions and attributes.
- REACT_APP_BACKEND_URL: This is the attribute which contains the value which we want to use as a reference.

## Run

For the moment you have to manually build the docker image. Once you have your own environment variables set up, please execute the following sequence of commands to build and start the docker container:
```
git clone https://github.com/cern-eam/eam-light-frontend.git
cd eam-light-frontend
docker build . -t eam-light-frontend
docker run -p 8080:8080 eam-light-frontend
``` 

Once the docker container is started, the application will be available at `http://your_server:8080/` (assuming you haven't changed the value of the PUBLIC_URL variable). 

## License
This software is published under the GNU General Public License v3.0 or later.