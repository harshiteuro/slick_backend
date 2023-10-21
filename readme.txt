Node.js v16.14.2


Steps to run SLICK_BACKEND--

1.clone the directory-

2.run npm install

3.Make sure to setup mysql and phpmyadmin service using the below command-
sudo docker compose up -d --build

4.Execute migrations/ Data Engestion
/scripts/
RUN node upload_scripts.js  

5.in root directory start server using nodemon
nodemon app.js

6.Test the APIs using postman-
API- http://localhost:3000/fetch_products
METHOD TYPE- POST
REQUEST BODY-
{
    "type":"plum_products"  //kopari_products, mcaffeine_products, yogabars_products
}


I have shared screentshots of working API in postman and database migration in screenshot directory.


DIRECTORY-

main file - app.js
routes defined in - routes directory
controllers functions - controllers directory
database handling - models directory
products json data - datasets directory
migrations / engestion - scripts
