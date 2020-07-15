// First Commit
// Split Screen Design
// Will use white and a light red as a theme
// left side is where city selector will be
// right side is the results
// modals maybe
//Edge cases: states with duplicate city names, 404 city not found protocol 
// responsive design: once you hit the big breaking point start doing vertical design

//querySelector must have period


//add event listener to each list item in loop
// try to animate the div expansion for selection a certain restaurant
// i remember using inner.html to get the city list item to know what results to get
// get rid of suggestion box when city is picked

//error on line 109 (removing header container)
//with this error ^ once you remove it once and then try to do another search, it's already removed so its returning null for that remove call

//create two new functions for getResturantPic and getResturantPrice. Just pass the data through as a parameter
// merge branches
// placeholder text = city when city is selected
// hover over card -- do some sort of styling

document.getElementById('button').addEventListener('click', generateCards)

function fetchCity(){
    let cityParam = '?q=' + document.getElementById('city-selector').value

    let request = new Request('https://developers.zomato.com/api/v2.1/cities' + cityParam, {
        headers: new Headers({
            'user-key': '56a17a2f4bcd0c8fc2eab2b69d0f4f01'
        })
    })


    fetch(request, {
        method: 'get'
    }).then(function(response) {
        return response.json()
    }).then(function(j) {
        displaySuggestions(j)
    }).catch(function(err) {
        console.log('error')
    })

    
}

function displaySuggestions(data){
    // erase the last search suggestions
    let suggestionsDOM = document.getElementById('suggestionsList')
    while(suggestionsDOM.firstChild){
        suggestionsDOM.removeChild(suggestionsDOM.firstChild);
    }
    
    document.getElementById('suggestions').style.display = 'inline-block'

    if(data.location_suggestions.length > 0){
        for(let i = 0; i < data.location_suggestions.length; i++){
            let listItem = document.createElement('li')
            listItem.innerHTML = data.location_suggestions[i].name

            let city = {
                name:data.location_suggestions[i].name,
                id:data.location_suggestions[i].id
            }

            document.getElementById('suggestionsList').appendChild(listItem)

            listItem.addEventListener('click', function(){
                generateCards(city)
            })
        }
    }else{
        let listItem = document.createElement('p')
        listItem.style.padding = '1rem 0'
        listItem.innerHTML = 'No results found'
        document.getElementById('suggestionsList').appendChild(listItem)
    }
}

function generateCards(city){

    erasePreviousStructure()

    let cityID = city.id
    let request = new Request('https://developers.zomato.com/api/v2.1/search?entity_id=' + cityID + '&entity_type=city', {
        headers: new Headers({
            'user-key': '56a17a2f4bcd0c8fc2eab2b69d0f4f01'
        })
    })

    fetch(request, {
        method: 'get'
    }).then(function(response) {
        return response.json()
    }).then(function(j) {
        for(let i = 0; i < Math.ceil(j.results_shown / 3); i++){
            createRow(i)
        }
        addCards(j)
    }).catch(function(err) {
        console.log('error')
    })

}

function erasePreviousStructure(){
    document.getElementById('right-container').style.display = 'block'
    document.getElementById('right-container').style.gridTemplateRows = 'none'
    document.getElementById('header-container').remove()
    document.getElementById('step1-container').remove()
    document.getElementById('step2-container').remove()

    let modal = document.createElement('div')
    let modalContent = document.createElement('div')
    modal.id = 'modal'
    modalContent.id = 'modal-content'

    document.getElementById('right-container').appendChild(modal)

    modal.appendChild(modalContent)

    let closeBtn = document.createElement('span')
    closeBtn.id = 'closeBtn'
    closeBtn.innerHTML = '&times;'
    modalContent.appendChild(closeBtn)

    let modalText = document.createElement('p')
    modalText.id = 'modalText'
    modalText.innerHTML = 'this is the modal content'
    modalContent.appendChild(modalText)

    closeBtn.addEventListener('click', function(){
        modal.style.display = 'none'
    })

    window.addEventListener('click', clickOutside)
    

}

function createRow(count){
    let row = document.createElement('div')
    row.id = 'row' + (count + 1)
    document.getElementById('right-container').appendChild(row)
    row.style.width = '100%'
    row.style.height = '33.3vh'
    row.style.display = 'flex'
    row.style.justifyContent = 'space-evenly'
}

function addCards(data){
    // if row isnt filled than the cards are strectched - maybe try max width: for card

    let count = 1
    for(let i = 0; i < data.results_shown; i++){

        let cardContainer = document.createElement('div')
        cardContainer.classList.add('card-container')
        cardContainer.id = 'card-container-' + i

        if(i > 0 && i % 3 == 0){
            count += 1
        }

        document.getElementById('row' + count).appendChild(cardContainer)

        let card = document.createElement('div')
        card.classList.add('card')
        card.id = 'card-' + i
        document.getElementById('card-container-' + i).appendChild(card)

        card.addEventListener('click', function(){
            displayDOM()
        })

        let cardPicture = document.createElement('div')
        cardPicture.classList.add('card-picture')

        //getting picture
        cardPicture.style.background = '#848484 url(images/strawberry.svg) no-repeat center'
        cardPicture.style.backgroundSize = '40% 70%'

        document.getElementById('card-' + i).appendChild(cardPicture)

        let cardCaptionContainer = document.createElement('div')
        cardCaptionContainer.classList.add('card-caption-container')
        cardCaptionContainer.id = 'card-caption-container-' + i
        document.getElementById('card-' + i).appendChild(cardCaptionContainer)
            
        let cardCaptionTextContainer = document.createElement('div')
        cardCaptionTextContainer.classList.add('card-caption-text-container')
        cardCaptionTextContainer.id = 'card-caption-text-container-' + i
        document.getElementById('card-caption-container-' + i).appendChild(cardCaptionTextContainer)

        let cardCaption = document.createElement('p')
        cardCaption.innerHTML = data.restaurants[i].restaurant.name
        cardCaption.classList.add('card-caption')
        document.getElementById('card-caption-text-container-' + i).appendChild(cardCaption)

        let cardCaptionPriceContainer = document.createElement('div')
        cardCaptionPriceContainer.classList.add('card-caption-price-container')
        cardCaptionPriceContainer.id = 'card-caption-price-container-' + i
        document.getElementById('card-caption-container-' + i).appendChild(cardCaptionPriceContainer)

        let cardPrice = document.createElement('p')
        cardPrice.innerHTML = '$'.repeat(data.restaurants[i].restaurant.price_range)
        cardPrice.classList.add('card-caption')
        cardPrice.style.textAlign = 'center'
        document.getElementById('card-caption-price-container-' + i).appendChild(cardPrice)
    }
}

function displayDOM(){
    document.getElementById('modal').style.display = 'block'
}

function clickOutside(e){
    if(e.target == modal){
        document.getElementById('modal').style.display = 'none'
    }
}

function getResturantPic(data){

}

function getResturantPrice(data){
}

