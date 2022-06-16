# JavaScript Form - Excursion Project

## About the project:
The aim of this project was rebuild previous project: "Excursion Project" and extension functionality adding Admin panel. I used JSON server as my local REST API. 


#### CLIENT PANEL
The Client can:
* pick up trip and after typing number od adults and children added trip to the basket
* remove picked trip from basked
* make an order and get summary with price

Features:
* in the basket client always see actual value of total order, if remove one trip, the price will update.
* form validation check if data is correct and show errors when data are wrong.
* correct data are sending to the API using JSON Server and inputs fields are cleared.


#### ADMIN PANEL
The Admin can:
* to add a new excursion
* to remove an excursion
* to update an excursion: title, description, prices

Features:
* client can see changes after reload page
* data are sending to the API using JSON Server and inputs fields are cleared.

Data in the form on the admin panel are not validated (I know this functionality is necessary but I have no more time on this project right now).

## How to see it
Please see the screenshots below, I am working on video preview.

## Technologies:
* JavaScript
* HTML
* CSS
* JSON Server
* Desktop only version

## Solutions
By creating this project I had an opportunity to practice/learn:
* CRUD operation in JavaScript
* working with API and practice fetch()
* working with class - "ExcursionAPI" -  build resuable code
* new funcionality like "remove item from basket"
* ways to check if data in inputs is correct before sending the form
* working with existing HTML structure using prototypes (.*--prototype)

The most interesting part were CRUD operation in JavaScript. In the ExcursionAPI.js I created class with functions like:

```
loadData(){
        return this._fetch();
    }
```

```
removeData(id){
        const options = {method:'DELETE'};
        return this._fetch(options,`/${id}`);
    }
```

```
updateData(id,data){
        const options = {
            method:'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        return this._fetch(options,`/${id}`);
    }
```

```
addData(data){
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        return this._fetch(options);
    }

```

and use the same function "loadData() in two files: admin.js and client.js

This project was demanding, I had to use a lot of function and connect them togehter. I tried to use new functionality I have learned: ECMAScript 2015 (for example: arrow functions). It was a kind of summary what I have learned so far in JavaScript.

### Project preview
Client panel
![Project-preview](./preview/client-screen1.png)

Order form validation
![Project-preview](./preview/client-screen2.png)

Information after making an order
![Project-preview](./preview/client-screen3.png)

Admin panel
![Project-preview](./preview/admin-screen1.png)

Form to add a new excursion
![Project-preview](./preview/admin-screen2.png)

Added excursion on the list 
![Project-preview](./preview/admin-screen3.png)

### Feel free to contact me:
* [Linkedin](https://www.linkedin.com/in/ewelina-kopacz-929559100/) - Ewelina Kopacz

### Thanks for project and support to Mateusz Bogolubow:
* Mentor i Trener Programowania JavaScript - [DevMentor](https://devmentor.pl/) - Mateusz Bogolubow