import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

document.addEventListener('DOMContentLoaded', init);
const apiUrlExcursions = 'http://localhost:3000/excursions';

function init (){
    console.log('client');
    loadExcursions();
}

function loadExcursions(){
    fetch(apiUrlExcursions)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            return Promise.reject(response);
        })
        .then(response => insertExcursions(response))
        .catch(error => console.error(error))
}

function insertExcursions(dataExcursions){
    const panelExcursions = document.querySelector('.panel__excursions');
    const excursionsItem = panelExcursions.querySelector('.excursions__item');
    for(let i=0;i < dataExcursions.length;i++){
        const excursionsItemCopy = excursionsItem.cloneNode(true);
        panelExcursions.appendChild(excursionsItemCopy);
            const item  = dataExcursions[i];
            const {id,destination,description,adultPrice,childrenPrice} = item;
            console.log(id,destination,description,adultPrice,childrenPrice);

            excursionsItemCopy.setAttribute('data-id-excursion', id);
            excursionsItemCopy.querySelector('.excursions__title').innerText = destination;
            excursionsItemCopy.querySelector('.excursions__description').innerText = description;
            const priceItems = excursionsItemCopy.querySelectorAll('.excursions__price');
            priceItems[0].innerText = adultPrice;
            priceItems[1].innerText = childrenPrice;
    }
    excursionsItem.classList.add('hide__prototype');
}




