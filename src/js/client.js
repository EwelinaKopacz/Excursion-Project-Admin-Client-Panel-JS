import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

document.addEventListener('DOMContentLoaded', init);
const apiUrlExcursions = 'http://localhost:3000/excursions';
const panelExcursions = document.querySelector('.panel__excursions');
panelExcursions.addEventListener('submit', takeExcursionData);

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
    const excursionsItem = panelExcursions.querySelector('.excursions__item');
    for(let i=0;i < dataExcursions.length;i++){
        const excursionsItemCopy = excursionsItem.cloneNode(true);
        panelExcursions.appendChild(excursionsItemCopy);
            const item  = dataExcursions[i];
            const {id,destination,description,adultPrice,childrenPrice} = item;

            excursionsItemCopy.setAttribute('data-id-excursion', id);
            excursionsItemCopy.querySelector('.excursions__title').innerText = destination;
            excursionsItemCopy.querySelector('.excursions__description').innerText = description;
            const priceItems = excursionsItemCopy.querySelectorAll('.excursions__price');
            priceItems[0].innerText = adultPrice;
            priceItems[1].innerText = childrenPrice;
    }
    excursionsItem.classList.add('hide__prototype');
}

function takeExcursionData(e){
    e.preventDefault();
    const pickedExcursion = e.target.parentElement;
    const idPickedExcursion = pickedExcursion.dataset.idExcursion;
    const {adults,children} = e.target.elements;
    let dataExcursions = {};
    // getAllDataExcursion(idPickedExcursion);

    const basket = {adults:adults.value,children:children.value};

    const errors =[];
        if(!checkIfNumber(adults.value) || !checkIfNumber(children.value)){
            errors.push('Błędne dane, wpisz liczbę.');
            alert(errors);
        }
        else{
            // getAllDataExcursion(idPickedExcursion,basket);
            // console.log('tak');
            // console.log(dataExcursions);
            dataExcursions = getAllDataExcursion(idPickedExcursion);
            console.log(dataExcursions);
        }
}


function getAllDataExcursion(id,basket) {
   fetch(`${apiUrlExcursions}/${id}`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        return Promise.reject(response);
    })
    .then(response => console.log(response))
    .then(response => {return response})
    .catch(error => console.error(error))
}

// function getData(response){
//     console.log(response);
// }


function checkIfNumber(value){
    const regExp = /^[0-9]*$/;
    if(value.match(regExp)){
        return value;
    }
    return false;
}

