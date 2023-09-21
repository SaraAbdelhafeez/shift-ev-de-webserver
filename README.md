# Shift EV-DE Webserver

Repository URL: [GitHub Repository](https://github.com/SaraAbdelhafeez/shift-ev-de-webserver)

## Overview
This is a Node.js web application built on Express.js. It serves as the backend server for the Shift EV-DE project. The main purpose of this application is to handle API requests and serve dynamic content to the client.

## Source Control and Continuous Integration
We have set up a CI process using Jenkins. The Jenkins pipeline is defined in the [Jenkinsfile](https://github.com/SaraAbdelhafeez/shift-ev-de-webserver/blob/main/Jenkinsfile). On every code push, the pipeline performs the following steps:
1. Checkout: Fetches the latest code from the repository.
2. Build: Installs project dependencies using `npm install`.
3. Syntax Check: Runs the linting process to catch any syntax errors.
4. Test: Executes unit tests using Jest.

## Dockerization
The web application has been packaged into a Docker container. The [Dockerfile](https://github.com/SaraAbdelhafeez/shift-ev-de-webserver/blob/main/Dockerfile) defines the steps taken to build the Docker image. It starts with a base Node.js 14 image, sets the working directory, copies the package.json file, installs dependencies, copies the application code, exposes port 3000, and specifies the command to run the application.

The Docker image is hosted on Docker Hub and can be accessed [here](https://hub.docker.com/repository/docker/saraabdelhafeez/node-app).

## Dockerfile Steps
Here is a breakdown of the steps in the Dockerfile:

1. `FROM node:14`: Specifies the base image to use for building the Docker image. In this case, it uses the official Node.js 14 image.
2. `WORKDIR /app`: Sets the working directory inside the Docker container where the application code will be copied.
3. `COPY package*.json ./`: Copies the package.json and package-lock.json files from the host (your local machine) to the Docker container.
4. `RUN npm install`: Installs the project dependencies inside the Docker container.
5. `COPY . .`: Copies all the files from the host to the Docker container.
6. `EXPOSE 3000`: Exposes port 3000 to allow incoming traffic to the web application.
7. `CMD [ "node", "app.js" ]`: Specifies the command to run when the Docker container starts. In this case, it runs the `app.js` file using Node.js.

## AWS Infrastructure Architecture

![Alt image](https://github.com/SaraAbdelhafeez/shift-ev-de-webserver/blob/main/aws%20architecture.PNG?raw=true)

## Deployment
To deploy the application on AWS, follow these steps:

1. Create two VPCs:
   - One VPC for the Jenkins server deployment.
   - Another VPC for the highly available and auto-scalable application servers.

2. Create an Internet Gateway:
   - Create an Internet Gateway for each VPC and update the route tables of the public subnets to route default traffic through the Internet Gateway for inbound/outbound Internet connection.

3. Create a NAT Gateway and update route tables:
   - Create a NAT Gateway in the public subnet and update the route tables of the private subnets to route default traffic through the NAT Gateway for outbound internet connection.

4. Create a Transit Gateway:
   - Create a Transit Gateway and associate both VPCs to enable private communication between them.

5. Create a CloudWatch Log Group and enable Flow Logs:
   - Create a CloudWatch Log Group with two Log Streams to store the VPC Flow Logs of both VPCs.
   - Enable Flow Logs for both VPCs and push the logs to the respective Log Streams in the CloudWatch Log Group.

6. Create a Security Group for the Jenkins server:
   - Create a Security Group allowing inbound traffic on port 22 (SSH) and port 8080 from the public.

7. Deploy the Jenkins server in the public subnet:
   - Create an EC2 instance for the Jenkins server in the public subnet.
   - Choose an appropriate Amazon Machine Image (AMI) for Jenkins, such as the official Jenkins AMI.
   - Configure security group rules to allow inbound traffic on port 8080 for public access and port 22 (SSH) for remote access to the Jenkins server.
   - Assign an Elastic IP (EIP) to the Jenkins server for a static public IP address.
   - Install Jenkins on the server and set up necessary plugins and configurations.

8. Define a Jenkins pipeline or job:
   - Configure the Jenkins server to have access to your repository and the necessary credentials to fetch the code.
   - Define a Jenkins pipeline or job to automate the build, test, and deployment process of your Node.js app.
   - Configure the pipeline or job to trigger on every code push and perform necessary steps such as checking the syntax errors, installing the necessary packages, and running tests.

9. Create Launch Configuration: Create a Launch Configuration with the following configuration: 
   - Instance Type: t2.micro
   - AMI: Ubuntu
   - Userdata: install docker and run a container with port 3000
     ```
      #!/bin/bash

      # Install Docker
      curl -fsSL https://get.docker.com -o get-docker.sh
      sudo sh get-docker.sh
      
      # Add the current user to the docker group
      sudo usermod -aG docker $USER
      
      # Start Docker service
      sudo systemctl start docker
      
      # Pull the image
      sudo docker pull saraabdelhafeez/node-app
      
      # Run the container
      sudo docker run -d -p 3000:3000 saraabdelhafeez/node-app
     ```
   - Security Group: Allow inbound traffic on port 22 from Jenkins server and port 3000 from the public.
   - Key Pair: Specify the key pair for SSH access.

9. Create an Auto Scaling Group:
   - Create an Auto Scaling Group with a minimum of 2 and a maximum of 4 instances.
   - Associate two private subnets with availability zones 1a and 1b.

10. Create a Target Group:
    - Create a Target Group and associate it with the Auto Scaling Group to distribute traffic among instances.

11. Create an Application Load Balancer:
    - Create an Application Load Balancer in the public subnet and add the Target Group as a target.
    - This allows the load balancer to distribute traffic evenly among the instances.

12. Deploy Multi-AZ MySQL RDS instance into private subnets:
    - Create an RDS instance with the Multi-AZ deployment option for high availability.
    - Choose MySQL as the database engine and specify the necessary configuration details.
    - Select the private subnets for the RDS instance to ensure it is not accessible from the public internet.
    - Create a Security Group for the RDS instance and allow inbound traffic on port 3306 from the application instances.

The live web application can be accessed via a public URL, which will be provided after the deployment process is complete.

## How to Run Locally
To run the web application locally, follow these steps:
1. Clone the repository: 
```
git clone https://github.com/SaraAbdelhafeez/shift-ev-de-webserver.git
```
2. Build the Docker image:
```
docker build -t node-app .
```
3. Run the web application on your local machine: 
```
docker run -p 3000:3000 node-app
```
You can then access the web application in your browser at 
```
http://localhost:3000
```

Feel free to reach out if you have any questions or need further assistance!
