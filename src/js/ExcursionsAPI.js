class ExcursionsAPI {
    constructor (){
        this.urlExcursions = 'http://localhost:3000/excursions';
        this.urlOrder = 'http://localhost:3000/orders';
    }

    loadData(){
        return fetch(this.urlExcursions)
            .then(response => {
                if(response.ok){return response.json();}
            return Promise.reject(response);
        });
    }
    addData(order){
        const options = {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {'Content-Type': 'application/json'}
        };

    return fetch(this.urlOrder,options)
            .then(response => {
                if(response.ok){return response.json();}
            return Promise.reject(response);
        });
    }
}

export default ExcursionsAPI;



// Został on stworzony, aby przechowywać w jednym miejscu całą komunikację z API.
// To tutaj powinny być zdefiniowane metody, które odpytują API, np. pozwalają pobrać wycieczki z bazy lub je do niej dodać.
// Ta klasa będzie używana zarówno po stronie client, jak i admin, dlatego też została już zaimportowana do obu plików JS odpowiedzialnych za każdą z części.