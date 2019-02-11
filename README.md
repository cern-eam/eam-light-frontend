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

PUBLIC_URL - By default EAM Light Frontend should be hosted at the web server's root. Please change this variable if EAM Light will be served from a sub-directory on your server.  

REACT_APP_LOGIN_METHOD - Change this parameter if you would like to disable the standard login prompt window and secure EAM Light with shared authentication schema of your enterprise. This requires further configuration of EAM Light Backend (explained on the project's website).

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