// First Commit
// Split Screen Design
// Will use white and a light red as a theme
// left side is where city selector will be
// right side is the results
// modals maybe
//Edge cases: states with duplicate city names, 404 city not found protocol 
// responsive design: once you hit the big breaking point start doing vertical design

//querySelector must have period

//if more than like 6 cities pop up change the font size in the suggestion box

// fix the suggestion box, dont like the fixed position. Also need to add more restaurants to the right side

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
    
    document.getElementById('suggestions').style.display = 'inline-block che'

    if(data.location_suggestions.length > 0){
        for(let i = 0; i < data.location_suggestions.length; i++){
            let listItem = document.createElement('li')
            listItem.innerHTML = data.location_suggestions[i].name
            document.getElementById('suggestionsList').appendChild(listItem)

            listItem.addEventListener('click', generateCards)
        }
    }else{
        let listItem = document.createElement('p')
        listItem.style.padding = '1rem 0'
        listItem.innerHTML = 'No results found'
        document.getElementById('suggestionsList').appendChild(listItem)
    }
}

function generateCards(){
    createContainerForFirstRow()
    createContainerForSecondRow()
    createContainerForLastRow()

    let index = this.innerHTML.search(',')
    let city = this.innerHTML.substring(0, index)
    fetchRestaurants(city)
}

function createContainerForFirstRow(){
    document.getElementById('heading').remove()
    document.getElementById('header-container').style.display = 'grid'
    document.getElementById('header-container').style.gridTemplateColumns = '1fr 1fr 1fr'
}

function createContainerForSecondRow(){
    document.getElementById('step1-container').style.gridTemplateColumns = '1fr 1fr 1fr'
    document.getElementById('step1-container').style.gridTemplateRows = 'none'
    document.getElementById('step1-text-container').remove()
    document.getElementById('exampleSelection').remove()
}

function createContainerForLastRow(){
    document.getElementById('step2-container').style.gridTemplateColumns = '1fr 1fr 1fr'
    document.getElementById('step2-container').style.gridTemplateRows = 'none'
    document.getElementById('step2-text-container').remove()
    document.getElementById('example-cards-container').remove()
}

function fetchRestaurants(city){
    // fetch tjhis shit
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
        createCards(j)
    }).catch(function(err) {
        console.log('error')
    })
}

function createCards(data){
    for(let i = 0; i < 9; i++){

        let cardContainer = document.createElement('div')
        cardContainer.classList.add('card-container')
        cardContainer.id = 'card-container-' + i

        if(i < 3){
            document.getElementById('header-container').appendChild(cardContainer)
        }else if(i >= 3 && i < 6){
            document.getElementById('step1-container').appendChild(cardContainer)
        }else{
            document.getElementById('step2-container').appendChild(cardContainer)
        }

        let card = document.createElement('div')
        card.classList.add('card')
        card.id = 'card-' + i
        document.getElementById('card-container-' + i).appendChild(card)

        let cardPicture = document.createElement('div')
        cardPicture.classList.add('card-picture')
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
        cardCaption.innerHTML = 'lorem ipsum'
        cardCaption.classList.add('card-caption')
        document.getElementById('card-caption-text-container-' + i).appendChild(cardCaption)

        let cardCaptionPriceContainer = document.createElement('div')
        cardCaptionPriceContainer.classList.add('card-caption-price-container')
        cardCaptionPriceContainer.id = 'card-caption-price-container-' + i
        document.getElementById('card-caption-container-' + i).appendChild(cardCaptionPriceContainer)

        let cardPrice = document.createElement('p')
        cardPrice.innerHTML = '$'
        cardPrice.classList.add('card-caption')
        cardPrice.style.textAlign = 'center'
        document.getElementById('card-caption-price-container-' + i).appendChild(cardPrice)
    }
}
