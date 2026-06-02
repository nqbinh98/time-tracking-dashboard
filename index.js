const selectBtns = document.querySelectorAll('.select-btn');

selectBtns.forEach(btn => {
    btn.addEventListener('click', handleSelectBtn)
})

let cachedData = [];
const labelContent = {
    daily: "Yesterday",
    weekly: "Last Week",
    monthly: "Last Month",
}

const allCardElement = document.querySelectorAll('.card');
let state = document.querySelector('.select-btn.active').dataset.type;

function handleSelectBtn (e) {
    let selectBtn = e.target;
    state = selectBtn.dataset.type;
    if (selectBtn.classList.contains('active')) {
        return;
    } else {
        selectBtns.forEach(btn => {
            btn.classList.remove('active');
        })
        selectBtn.classList.add('active')
        render()
    }
}

function render () {
    let card;
    let currentTimeElement;
    let previousTimeElement;

    allCardElement.forEach((cardElement) => {
            card = cardElement.getAttribute('data-activity');
            currentTimeElement = cardElement.querySelector('.current-time');
            previousTimeElement = cardElement.querySelector('.previous-time');
            let matchData = cachedData.find(data => {
                let title = data.title.toLowerCase();
                return title === card;
            })

            let timeframes = matchData.timeframes[state]; 
            if (matchData && timeframes) {
                currentTimeElement.innerHTML = `${timeframes.current}hrs`;
                previousTimeElement.innerHTML = `${labelContent[state]} - ${timeframes.previous}hrs`;
            }

    })
}


async function fetchData () {
    const errorContainer = document.querySelector('.error-container');

    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('Oops! Something wrong.');
        } 
        const data = await response.json();
        errorContainer.style.display = 'none';
        if (Array.isArray(data)) {
            cachedData = data;
            render();
        }

    } catch (error) {
        errorContainer.style.display = 'block';
        console.log(error)
    }   
}

fetchData();