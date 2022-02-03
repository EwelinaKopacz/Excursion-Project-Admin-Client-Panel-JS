class ExcursionsAPI {
    constructor (){
        this.urlExcursions = 'http://localhost:3000/excursions';
        this.urlOrder = 'http://localhost:3000/orders';
    }

    loadData(){
        return this._fetch();
    }

    removeData(id){
        const options = {method:'DELETE'};
        return this._fetch(options,`/${id}`);
    }

    updateData(id,data){
        const options = {
            method:'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        return this._fetch(options,`/${id}`);
    }

    addData(data){
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        return this._fetch(options);
    }

    _fetch(options,additionalPath=''){
        const url = this.urlExcursions + additionalPath;
        return fetch(url,options)
            .then(response => {
                if(response.ok) {return response.json();}
                return Promise.reject(response);
            });
    }

    addNewOrder(order){
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
