import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

const apiAdmin = new ExcursionsAPI();
document.addEventListener('DOMContentLoaded', init);

const apiUrlExcursions = 'http://localhost:3000/excursions';
const panelExcursions = document.querySelector('.panel__excursions');

function init (){
    console.log('admin');
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
                .then(() => console.log('excursion was removed'))
                .catch(error => console.error(error))
                .finally(loadExcursions); // nie działa przeładowanie, f-cja sie nie wywoluje, nie rozumiem why?
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
            .then(() => console.log('excursion was added'))
            .catch(error => console.error(error))
            .finally(loadExcursions) // nie działa przeładowanie, f-cja sie nie wywoluje, nie rozumiem why?
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
                const data = {
                    destination:itemToChange[0].innerText,
                    description:itemToChange[1].innerText,
                    adultPrice:itemToChange[2].innerText,
                    childrenPrice:itemToChange[3].innerText,
                }

                apiAdmin.updateData(id,data)
                    .then(() => console.log('excursion was update'))
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