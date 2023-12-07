# use an official node runtime as a parent image
# we first start with a base image
FROM node:18 

#set the working directory in the container to /app
WORKDIR /app


#copy package.json and package-lock.json into the working directory
COPY package*.json ./

# install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# install any needed packages specified in package.json
run npm install

#copy app source inside the docker image
COPY . .

# make port 3000 available outside this container
EXPOSE 3000

#define the command to run your app using CMD (only one CMD allowed)
CMD ["npm", "start"]