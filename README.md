# EAM Light Frontend
EAM Light Frontend is Web application that provides the core functionality of Infor EAM Extended. 

## Configuration
You need to define the following environment variables before building the docker image

| Variable        | Required?  | Default value |
| ------------- | -----:|---------:|
| REACT_APP_BACKEND           | **Yes** | /SSO/eamlightws/rest |
| PUBLIC_URL         | **Yes** | / |

## Run

The docker container exposes the following ports:

| Port        | Description  |
| ------------- | -----:|
| 8080          | EAM Light Frontend | 

Once you have your own environment variables set up, plese do the following to start a new docker container:
```
git clone https://github.com/cern-eam/eam-light-frontend.git
cd eam-light-frontend
docker build . -t eam-light-frontend
docker run -p 8080:8080 eam-light-frontend
``` 

Once the docker container is started, the REST web services are available at the endpoint `/SSO/eamlightws/rest`

## License
This software is published under the GNU General Public License v3.0 or later.