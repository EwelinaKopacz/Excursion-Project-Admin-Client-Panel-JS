import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

document.addEventListener('DOMContentLoaded', init);

const apiUrlExcursions = 'http://localhost:3000/excursions';

const panelExcursions = document.querySelector('.panel__excursions');
const panelSummary = document.querySelector('.panel__summary');
const orderForm = document.querySelector('.order');

panelExcursions.addEventListener('submit', takeExcursionData);
panelSummary.addEventListener('click', removeExcursion);
orderForm.addEventListener('submit',checkOrderForm)


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

async function takeExcursionData(e){
    e.preventDefault();
    const pickedExcursion = e.target.parentElement;
    const idPickedExcursion = pickedExcursion.dataset.idExcursion;
    const {adults,children} = e.target.elements;
    const numberPeople = {adults:adults.value,children:children.value};

    const dataExcursions = await getAllDataExcursion(idPickedExcursion);

    const errors =[];
        if(!checkIfNumber(adults.value) || !checkIfNumber(children.value)){
            errors.push('Błędne dane, wpisz liczbę.');
            alert(errors);
        }
        else{
            showBasket(dataExcursions, numberPeople);
        }
}

function getAllDataExcursion(id) {
   return fetch(`${apiUrlExcursions}/${id}`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        return Promise.reject(response);
    })
    .then(response => {return response})
    .catch(error => console.error(error))
}

function checkIfNumber(value){
    const regExp = /^[0-9]*$/;
    if(value.match(regExp)){
        return value;
    }
    return false;
}

function showBasket(dataExcursion,numberPeople){
    const summaryPanel = document.querySelector('.panel__summary');
    const summaryItemCopy = summaryPanel.firstElementChild.cloneNode(true);
    summaryItemCopy.classList.remove('summary__item--prototype');
    summaryPanel.appendChild(summaryItemCopy);

    const {destination,adultPrice,childrenPrice} = dataExcursion;
    const {adults,children} = numberPeople;
    const constOneExcursion = getSumOneExcursion(adults,adultPrice,children,childrenPrice);

    summaryItemCopy.querySelector('.summary__name').innerText = destination;
    summaryItemCopy.querySelector('.summary__total-price').innerText = `${constOneExcursion} ` + ` PLN`;
    summaryItemCopy.querySelector('.summary__prices').innerText = (`dorośli: ${adults} x ${adultPrice} PLN, dzieci ${children} x ${childrenPrice} PLN`);
    getSumOrder();
}

function getSumOneExcursion(adults,adultPrice,children,childrenPrice){
    const constOneExcursion = ((`${adults}` * `${adultPrice}`) + (`${children}` * `${childrenPrice}`));
    return constOneExcursion;
}

function getSumOrder(){
    const allPrices = document.querySelectorAll('.summary__total-price');
    const arrayCost= [...allPrices];
    const orderCost = arrayCost.reduce((acc,item,index) => {
        return acc + parseInt(item.innerText)
    },0,[1]);
    const currentTotalCost = document.querySelector('.order__total-price-value').innerText = `${orderCost} ` + `PLN`;
}

function removeExcursion(e){
    e.preventDefault();
    if(e.target.classList.contains('summary__btn-remove')){
        const btnClickParent = e.target.parentElement.parentElement;
        btnClickParent.remove();
        getSumOrder();
    }
}

function checkOrderForm(e){
    e.preventDefault();
    let errors = [];
    const{name,email} = e.target.elements;
    const userData = {name:name.value,email:email.value};

    if(!checkPersonData(name.value)){
        errors.push('Wpisz poprawne imie i nazwisko (tylko litery)');
    };

    if(!checkEmail(email.value)){
        errors.push('Wpisz poprawny adres email');
    };
    showErrors(errors,email.value);
}

function checkPersonData(dataPerson){
    const regExp = /^[a-zA-Z]{2,30}/;
    if(dataPerson.match(regExp)){
        return dataPerson;
    }
    return false;
}

function checkEmail(dataEmail){
    const regExp = /^[-\w\.]+@([-\w]+\.)+[a-z]+$/i;
    if(dataEmail.match(regExp)){
        return dataEmail;
    }
    return false;
}

function showErrors(errorsArray,userEmail){
    const orderForm = document.querySelector('.order');
    const orderTotalPrice = orderForm.querySelector('.order__total-price');
    let errorMessage = document.createElement('ul');

    if(errorsArray.length>0){
        errorMessage = orderForm.insertBefore(errorMessage,orderTotalPrice);
        errorMessage.innerText = '';
        errorsArray.forEach(function(item){
            const errorInfoLi = document.createElement('li');
            errorInfoLi.innerText = item;
            errorInfoLi.style.color = 'red';
            errorMessage.appendChild(errorInfoLi);
        });
    }
    else {
        const totalCostToShowUser = getSumOrder();
        orderForm.submit(alert('Dziękujemy za złożenie zamówienia o wartości: ' + totalCostToShowUser + ' PLN. Szczegóły zamówienia zostały wysłane na adres e-mail: ' + userEmail));
    }
}



