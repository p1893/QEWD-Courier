# QEWD Courier

Email: <code.custodian@ripple.foundation>

2017-18 Ripple Foundation Community Interest Company 

[http://ripple.foundation](http://ripple.foundation)

Author: Rob Tweed, M/Gateway Developments Ltd (@rtweed)

# QEWD-Courier

## Summary of the QEWD-Courier Architecture

The QEWD-Courier middle-tier environment consists of a series of MicroServices, each of which is a Dockerised instance of
[QEWD.js](https://qewdjs.com) that is customised to perform a specific task.  

QEWD-Courier implements the REST APIs that are used by an application's User Interface (UI) and invokes the services responsible for resolving those requests.

The MicroServices are as follows:

- *conductor* (folder *~/QEWD-Courier/courier-conductor-service*).  All incoming REST requests are channelled through this MicroService.  This MicroService does very little other than act as a router for incoming requests, forwarding them to the other MicroServices that handle them, and returning the responses from those MicroServices back to the user.  Some requests and responses are transformed, but most pass through the *conductor* MicroService unchanged.

- *hello-world* (folder *~/QEWD-Courier/hello-world-service*).  A sample MicroService that accepts some simple REST requests
and returns an appropriate response.

## Installation

Clone this repo into a folder named ~/QEWD-Courier on your host system, eg:

       git clone https://github.com/RippleOSI/QEWD-Courier ~/QEWD-Courier


## Install Docker

If you haven't already done so, install Docker on your host machine(s)

There are lots of instructions for doing this on the Internet, but
if your machine is running Ubuntu 18.04, invoke the following commands:

        sudo apt update
        sudo apt install apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
        sudo apt update
        apt-cache policy docker-ce
        sudo apt install docker-ce

To check that it's working, try:

        sudo systemctl status docker

To avoid having to use sudo with the docker commands:

        sudo usermod -aG docker ${USER}
        su - ${USER}

You'll be prompted for your password when invoking the second command above



## Configuration


### 1. Define the IP addresses or domain names of the MicroService Containers

These are defined in the file:

      ~/QEWD-Courier/global_settings/configuration.json

This file is read and used by all the QEWD-Courier MicroServices when they start up.

It is recommended that you don't change the suggested ports unless you need to, in which case you'll need to make corresponding changes to the commands that start each MicroService.

Note 1: The *conductor* service is externally-facing and should be accessed via SSL

Note 2: External access will be proxied via nginx (see later)

Note 3: On cloud machines, the *hello-world*, and your application's services make use of a bridged Docker network to communicate internally.  However, the *courier-conductor-service* host name should be the appropriate externally-facing IP address or domain name by which your UI can connect to it.


Example on a local VM:

        "microservices": {
          "conductor": {
            "host": "https://127.0.0.1",
            "port": 443
          },
          "hello-world": {
            "host": "http://hello-world",
            "port": 8001
        }

### 2. Change the shared JSON Web Token Secret

It is strongly recommended that you change the shared JSON Web Token (JWT) secret that is used by the Helm MicroServices for authenticating and signing the JWTs that flow between PulseTile and the Helm MicroServices.

The JWT Secret is defined in:

      ~/QEWD-Courier/global_settings/configuration.json

ie replace the value of the *secret* property in this section:

     "jwt": {
       "secret": "bd645d9e-6281-4a96-949a-b249f6ff3d97"
     }

The Secret value can be any string.  Ensure that you use a value that is not too short or easily-guessable.


### 6. Change the QEWD.js Management Passwords

Each MicroService folder includes a file named *startup_config.json* that tells the QEWD.js module how to configure itself when it starts up.  Unless you understand what you're doing, it is best to leave most of the settings in this file untouched.  However it is a good idea to change the first property: *managementPassword*

The *managementPassword* is used to access the QEWD-Monitor application for each MicroService. 

Change this value before you start up the MicroService.  If you want to change it thereafter, you must restart the MicroService for it to take effect.



## Install and Configure NGINX

NGINX acts as the main web server for QEWD-COurier, and proxies access to the QEWD MicroServices.

### Installing NGINX

You'll find lots of instructions on how to install it on the Internet.

However, to install it on Ubuntu 18.04, simply run these two commands:

      sudo apt update
      sudo apt install nginx


Check that it's working using: 

      systemctl status nginx

### Configuring NGINX

Configure NGINX for use with Helm by replacing this file on your machine:

      /etc/nginx/nginx.conf

with the file that you'll find at:

      ~/QEWD-Courier/DMZ/etc/nginx/nginx.conf


Then add or replace the contents of the file:

      /etc/nginx/conf.d

with the file that you'll find at:

      ~/QEWD-Courier/DMZ/etc/nginx/conf.d

There's just one file in that folder:  *default.conf* 


### Set up the Proxy Redirections for your System


Change ALL the proxy redirection IP addresses in:

      /etc/nginx/conf.d/default.conf

to match those used by your Helm MicroServices, eg change:

      proxy_pass http://192.168.55.11:8000;

to

      proxy_pass http://192.168.1.100:8000;


### Copy the Self-Signed certificates:

In order to access QEWD-Courier over SSL (HTTPS), you will need the appropriate certificates.  One a test/demonstration system you can create your own Self-Signed versions: there are lots of instructions on the Internet on how to do this for NGINX.  

However, if you wish, you can make use of the Self-Signed certificates that are included in the repository. If you're happy that these will be satisfactory and adequate for your needs (bearing in mind the lack of inherent security that they will provide), then follow these steps:

If your system doesn't already have the folder /etc/pki, create it copy in the contents of the folder:

       ~/QEWD-Courier/DMZ/etc/pki

Or, if */etc/pki* already exists, copy the files from: 

       ~/QEWD-Courier/DMZ/etc/pki

to corresponding sub-folders

To take effect you must restart nginx:

      sudo systemctl restart nginx



## Running the Suite of QEWD Courier MicroServices

*Note:* If you have previously installed and run QEWD Courier and have updated your version from
the Github repository, make sure you update your copy of the *rtweed/qewd-server* Docker Container.
You **MUST** be using the latest version!  To update it:

      docker pull rtweed/qewd-server

To start the Helm MicroServices, either run:

      source ~/QEWD-Courier/start.sh

or open the script file and invoke the commands within it manually, one by one.

To check that the MicroService Containers are running:

     docker ps

To view the log of each one

     docker logs -f {container-name}

where {container-name} is one of:

- conductor
- hello-world

Note: when you start the first QEWD-Courier MicroService for the first time, Docker will automatically download the container *rtweed/qewd-server* from the Docker Hub, which takes a couple of minutes depending on your network speed.


Everything should now be up and running.


# Other Useful Information about the QEWD-Courier Middle Tier Architecture

## What is the ~/QEWD-Courier/yottadb Folder For?

Each MicroService is run as a Docker Container - this container uses the *qewd-server* Docker service which
includes not only an instance of QEWD, but also an instance of the [YottaDB](https://yottadb.com/) NoSQL database which is mainly
used for QEWD internal management and user Session management.  However, it is also used as a database for
other MicroServices.  In order for such data to persist beyond the life-span of the 
Docker containers, the YottaDB database files are mapped to pre-initialised files in the *~/QEWD-Courier/yottadb* directory.

**Please do not** touch or change the files in this directory and its sub-directories.


## Stopping and Restarting the QEWD-Courier MicroServices

You can use a variety of mechanisms for stopping the Ripple-QEWD MicroServices, for example:

- if a MicroService is running as a foreground Docker process (using the *-it* parameter), you
  can simply use *CTRL & C* to stop it

- you can use *sudo docker stop {pid}*.  Use *sudo docker ps* to discover the PIDs for your
  MicroServices.  Usually you only need to specify the first 3 characters of the PID

- you can use the QEWD Monitor application (see below) for the MicroService you want to shut down.  Click
  the red X button next to the Master process displayed in the Overview Screen.

Note: In order to minimise any risk of corruption of the YottaDB database, it is recommended that you shut down the MicroServices using the QEWD Monitor option above.  This ensures that
QEWD Worker process connections to YottaDB are cleanly shut down.

However, each QEWD.js Container ensures that the YottaDB database is correctly run-down when the Container starts, and recovers any data from the YottaDB Journal if any corruption is detected.

To re-start each MicroService, see the section **Running the Suite of MicroServices** above.


## The QEWD Monitor Application

Each QEWD-Courier MicroService runs as a self-contained QEWD instance, and includes its own copy
of the QEWD Monitor application.

This is a browser-based application that is started using the URL path */{proxy-path}/qewd-monitor/index.html*

where {proxy_path} is an NGINX-interpreted path that routes the request to the appropriate MicroService.  These paths are as follows:

- **conductor**:      */courier_conductor/*
- **hello-world**:    */helloworld/*


For example, to access the QEWD Monitor application for the *conductor* service, point your browser at:

       http://www.myserver.com/qewd_conductor/qewd-monitor/index.html

If you successfully enter the QEWD Management Password (see earlier for details of how this is defined/configured), you will now be presented with the Overview screen.

From the Overview screen you can:

- examine how QEWD is configured
- stop the MicroService by stopping the QEWD Master Process
- stop any or all of the QEWD Worker processes.  QEWD will automatically restart them on demand

Select the Document Store tab/option to view any persistent documents in the QEWD/YottaDB Database

Select the Sessions tab/option to view and optionally shut down any active QEWD user sessions.



## Shell Access to Each MicroService

It is sometimes useful, for system management reasons, to be able to gain shell access to a MicroService.  You can do this by invoking the command:

       docker exec -it {container-name} bash

where {container-name} is one of:

- conductor
- hello-world

Once you have shell access, you can open the YottaDB interactive shell to view / maintain its Global Storage.  From the Container's intenal /opt/qewd folder, simply invoke the command:

      ./ydb

You should see the YottaDB interactive shell prompt:

      YDB>

To exit the YottaDB interactive shell, type:

      H{Enter}

To exit shell access to the Container, type:

      exit{Enter}

