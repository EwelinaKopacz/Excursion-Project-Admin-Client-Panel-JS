import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const apiAdmin = new ExcursionsAPI();
document.addEventListener('DOMContentLoaded', init);

const panelExcursions = document.querySelector('.panel__excursions');

const clearInput = () =>{
    const formEl = document.querySelector('.form');
    const inputEls = formEl.querySelectorAll('.form__field');
    if(formEl && inputEls){
        inputEls.forEach((item) => {
            item.value = '';
        })
    }
}

function init (){
    loadExcursions();
    removeExcursion();
    addExcursion();
    updateExcursion();
}

function loadExcursions(){
    apiAdmin.loadData()
        .then(response => insertExcursions(response))
        .catch(error => console.error(error))
}

function insertExcursions(dataExcursions){
    const excursionsItem = panelExcursions.querySelector('.excursions__item');
    panelExcursions.innerText = '';

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
}

function removeExcursion(){
    const excursionsPanel = document.querySelector('.excursions');
    excursionsPanel.addEventListener('click', e => {
        e.preventDefault();
        const targetEl = e.target;

        if(targetEl.classList.contains('excursions__field-input--remove')){
           const excursionFields = e.target.parentElement;
           const excursionsForm = excursionFields.parentElement;
           const pickedExcursionToDelete = excursionsForm.parentElement;
           const id = pickedExcursionToDelete.dataset.idExcursion;

           apiAdmin.removeData(id)
                .catch(error => console.error(error))
                .finally(loadExcursions);
        }
    });
}

function addExcursion(){
    const form = document.querySelector('.form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const {destination,description,adults,children} = e.target.elements;
        const newExcursion = {destination:destination.value,description:description.value,adultPrice:adults.value,childrenPrice:children.value};

        apiAdmin.addData(newExcursion)
            .then(() => clearInput())
            .catch(error => console.error(error))
            .finally(loadExcursions)
    });
}

function updateExcursion(){
    const excursionsPanel = document.querySelector('.excursions');
    excursionsPanel.addEventListener('click', e => {
        e.preventDefault();
        const targetEl = e.target;
        if(targetEl.classList.contains('excursions__field-input--update')){
            const excursionFields = e.target.parentElement;
            const excursionsForm = excursionFields.parentElement;
            const pickedExcursionToUpdate = excursionsForm.parentElement;

            const tripName = pickedExcursionToUpdate.querySelectorAll('h2');
            const tripDescription = pickedExcursionToUpdate.querySelectorAll('p');
            const tripCost = pickedExcursionToUpdate.querySelectorAll('strong');

            const itemToChange = [...tripName,...tripDescription,...tripCost];

            const isEditable = itemToChange.every(
                (item) => item.isContentEditable
            );

            if(isEditable){
                const id = pickedExcursionToUpdate.dataset.idExcursion;
                const [destination,description,adultPrice,childrenPrice] = itemToChange;
                const data = {destination:destination.innerText,description:description.innerText,adultPrice:adultPrice.innerText,childrenPrice:childrenPrice.innerText};;

                apiAdmin.updateData(id,data)
                    .catch(error => console.error(error))
                    .finally(() => {
                        targetEl.value = 'edytuj';
                        itemToChange.forEach(item => item.contentEditable = false);
                    });
            }
            else {
                targetEl.value = 'zapisz';
                itemToChange.forEach(item => item.contentEditable = true);
            }
        }
    });
}

