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
    erasePreviousStructure()

    // amount = 11

    // for(let i = 0; i < Math.ceil(amount / 3); i++){
    //     createRow(i)
    // }

    // addCards()
}

function erasePreviousStructure(){
    document.getElementById('right-container').style.display = 'block'
    document.getElementById('right-container').style.gridTemplateRows = 'none'
    document.getElementById('header-container').remove()
    document.getElementById('step1-container').remove()
    document.getElementById('step2-container').remove()

    // let modal = document.createElement('div')
    // let modalContent = document.createElement('div')
    // modal.id = 'modal'
    // modalContent.id = 'modal-content'

    // document.getElementById('right-container').appendChild(modal)

    // modal.appendChild(modalContent)

    // let closeBtn = document.createElement('span')
    // closeBtn.id = 'closeBtn'
    // closeBtn.innerHTML = '&times;'
    // modalContent.appendChild(closeBtn)

    // let modalText = document.createElement('p')
    // modalText.id = 'modalText'
    // modalText.innerHTML = 'this is the modal content'
    // modalContent.appendChild(modalText)

    

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


function addCards(){
    for(let i = 0; i < 12; i++){

        let cardContainer = document.createElement('div')
        cardContainer.classList.add('card-container')
        cardContainer.id = 'card-container-' + i

        if(i < 3){
            document.getElementById('row1').appendChild(cardContainer)
        }else if(i >= 3 && i < 6){
            document.getElementById('row2').appendChild(cardContainer)
        }else if(i >= 6 && i < 9){
            document.getElementById('row3').appendChild(cardContainer)
        }else{
            document.getElementById('row4').appendChild(cardContainer)
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