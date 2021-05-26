# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. [Covered in the course]
2. [The RestAPI Backend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-restapi), a Node-Express server which can be deployed to a cloud service. [Covered in the course]
3. [The Image Filtering Microservice](https://github.com/udacity/cloud-developer/tree/master/course-02/project/image-filter-starter-code), the final project for the course. It is a Node-Express application which runs a simple script to process images. [Your assignment]

### Setup Node Environment

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`

#### Image filtering endpoint Testing :
 
#### Testing from local:
1. Run Development server 
  `` npm run dev``
2. Getting Auth token: 
 POST to ` http://localhost:8082/apiauth ` 
 In postman body use the raw data radio button and set the type of data from text to JSON data:
 ` {"email":"swapna.udacity@test.com", "password":"test1234"} `
 This endpoint will return JWT token in response. 
 Copy the token for running the image filtering endpoint.
3. Image filtering endpoint:
 ` http://localhost:8082/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg `
 In postman set authorization to Bearer token and paste the bearere token from prevoius step in the token field.
 This endpoint will authenticate the token in the header and return an image.

#### Testing Image Filter amazon EBS link:
1. Replace localhost:8082 in steps #2 and #3 above to the following EBS URL: 
  ` smaddimage-filter.us-east-1.elasticbeanstalk.com `

#### Testing Image Filter end point using POSTMAN Automation:
1. Run the postman collection. Validates the No Auth Headers/ Incorrect Auth Headers / Correct Auth Token.
  ` cloud-cdnd-c2-final.postman_collection.json `

Note: Postman Collection host variable is already set to EBS url.(Host varibale can be updated to run in local)

