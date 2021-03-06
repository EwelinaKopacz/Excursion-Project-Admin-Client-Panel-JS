import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

const apiClient = new ExcursionsAPI();
document.addEventListener('DOMContentLoaded', init);

const apiUrlExcursions = 'http://localhost:3000/excursions';

const panelExcursions = document.querySelector('.panel__excursions');
const panelSummary = document.querySelector('.panel__summary');
const orderForm = document.querySelector('.order');
const orderTotalPrice = orderForm.querySelector('.order__total-price');
let errorMessage = document.createElement('ul');

panelExcursions.addEventListener('submit', takeExcursionData);
panelSummary.addEventListener('click', removeExcursion);
orderForm.addEventListener('submit',checkOrderForm);

const prepareCart = (order) => {
    const cart = {};
    for(let i=0; i<order.length; i=i+2) {
        const key = order[i];
        const value = order[i+1];
        cart[key] = value;
    }
    return cart
}

const clearBasket = (items) => {
    items.forEach((el) => {el.remove();})
}


function init (){
    loadExcursions();
}

function loadExcursions(){
    apiClient.loadData()
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
            const [adultPriceEl,childrenPriceEl] = priceItems;
            adultPriceEl.innerText = adultPrice;
            childrenPriceEl.innerText = childrenPrice;
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
            errors.push('B????dne dane, wpisz liczb??.');
            alert(errors);
            clearInputValue(adults);
            clearInputValue(children);
        }
        else{
            addToBasket(dataExcursions, numberPeople);
            clearInputValue(adults);
            clearInputValue(children);
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

function clearInputValue(item){
    return item.value = '';
}

function addToBasket(dataExcursion,numberPeople){
    const summaryPanel = document.querySelector('.panel__summary');
    const summaryItemCopy = summaryPanel.firstElementChild.cloneNode(true);
    summaryItemCopy.classList.remove('summary__item--prototype');
    summaryPanel.appendChild(summaryItemCopy);

    const {destination,adultPrice,childrenPrice} = dataExcursion;
    const {adults,children} = numberPeople;
    const constOneExcursion = getSumOneExcursion(adults,adultPrice,children,childrenPrice);

    summaryItemCopy.querySelector('.summary__name').innerText = destination;
    summaryItemCopy.querySelector('.summary__total-price').innerText = `${constOneExcursion} ` + ` PLN`;
    summaryItemCopy.querySelector('.summary__prices').innerText = (`doro??li: ${adults} x ${adultPrice} PLN, dzieci ${children} x ${childrenPrice} PLN`);
    getSumOrder();
}

function getSumOneExcursion(adults,adultPrice,children,childrenPrice){
    const constOneExcursion = ((`${adults}` * `${adultPrice}`) + (`${children}` * `${childrenPrice}`));
    return constOneExcursion;
}

function getSumOrder(){
    const allPrices = document.querySelectorAll('.summary__total-price');
    const arrayCost= [...allPrices];
    const orderCost = arrayCost.reduce((acc,item) => {
        return acc + parseInt(item.innerText)
    },0);
    const currentTotalCost = document.querySelector('.order__total-price-value').innerText = `${orderCost} ` + `PLN`;
    return orderCost;
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
    }
    if(!checkEmail(email.value)){
        errors.push('Wpisz poprawny adres email');
    }
    else{
        showInfoToUser(name.value,email.value);
        addOrderToApi(userData);
        clearInputValue(name);
        clearInputValue(email);
    };
    showErrors(errors);
}

function checkPersonData(dataPerson){
    const regExp = /^[a-zA-Z]{2,30}/;
    if(dataPerson.match(regExp)){
        return true;
    }
    return false;
}

function checkEmail(dataEmail){
    const regExp = /^[-\w\.]+@([-\w]+\.)+[a-z]+$/i;
    if(dataEmail.match(regExp)){
        return true;
    }
    return false;
}

function showErrors(errorsArray){
    if(errorsArray.length>0){
        errorMessage = orderForm.insertBefore(errorMessage,orderTotalPrice);
        errorMessage.innerText = '';
        errorsArray.forEach((item) => {
            const errorInfoLi = document.createElement('li');
            errorInfoLi.innerText = item;
            errorInfoLi.style.color = 'red';
            errorMessage.appendChild(errorInfoLi);
        });
    }
}

function showInfoToUser(name,email){
    const totalCostToShowUser = getSumOrder();
    alert(`${name} dzi??kujemy za z??o??enie zam??wienia o warto??ci: ${totalCostToShowUser} PLN. Szczeg????y zam??wienia zosta??y wys??ane na adres e-mail: ${email}`);
}

function addOrderToApi(userData){
    const cart = document.querySelectorAll('.summary__item:not(.summary__item--prototype)');
    const order = [];
    const {name,email} = userData;
    const obj = {customer:name,customerEmail:email,cart};

    cart.forEach((item) => {
        const destination = item.querySelector('.summary__name').innerText;
        const price = item.querySelector('.summary__total-price').innerText;
        order.push(destination,price);
    });

    const orderToSend = {customer:name,customerEmail:email,cart: prepareCart(order)}

    apiClient.addNewOrder(orderToSend)
        .then(() => clearBasket(cart))
        .catch(error => console.error(error))
}


