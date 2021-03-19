# EAM Light Frontend
EAM Light Frontend is the user facing module of the EAM Light web application, providing the core functionality of Infor EAM Extended. It uses [eam-light-backend](https://github.com/cern-eam/eam-light-backend) as a facade to retrieve the required data from Infor EAM.

This project was created using the create-react-app application and you can consult its documentation for further configuration details. 

## Configuration
You can modify the following environment variables in the `Dockerfile` before building the docker image to change some of the default settings:

| Variable               | Default value | Usage                                        |
| ---------------------- |--------------:| -------------------------------------------- |
| REACT_APP_BACKEND      | /rest         | Should have a leading, but no trailing slash |
| PUBLIC_URL             | /eamlight     | Public URL for react-router-dom              |
| REACT_APP_LOGIN_METHOD | STD           | Should match EAMLIGHT_AUTHENTICATION_MODE    |
| REACT_APP_CERN_MODE    | FALSE         | Not used for organizations outside CERN      |

If you wish for others to use your locally deployed server, you have to change the REACT_APP_BACKEND variable to an absolute URL: http://your_machine:9090/apis/rest.

When installed on a web server, not using Docker, EAM Light frontend should be hosted by default in the /eamlight subdirectory. Please change the PUBLIC_URL variable if you wish to host EAM Light at the root directory of the server, or in another subdirectory.

REACT_APP_LOGIN_METHOD - Change this parameter if you would like to disable the standard login prompt window and secure EAM Light with the shared authentication schema of your enterprise. This requires further configuration of EAM Light Backend, which is explained [here](https://github.com/cern-eam/eam-light-backend).

## Run
You may run the frontend standalone in a Docker container. Once you have your own environment variables set up, please execute the following sequence of commands to build and start the docker container:
```
git clone https://github.com/cern-eam/eam-light-frontend.git
cd eam-light-frontend
docker build . -t eam-light-frontend
docker run -p 8080:8080 eam-light-frontend
``` 

Once the docker container is started, the application will be available at `http://your_server:8080/eamlight` (assuming you have not changed the value of the PUBLIC_URL variable). 

## License
This software is published under the GNU General Public License v3.0 or later.