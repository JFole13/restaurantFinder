let numOfRequests = 0

// button gets clicked when enter key is pressed
document.getElementById('citySelector').addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('button').click();
    }
});

document.getElementById('button').addEventListener('click', generateCards)

function fetchCity(){
    let cityParam = '?q=' + document.getElementById('citySelector').value

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
    // erases the last search suggestions
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
    //this is to transition from the homepage to the cards on the first request
    if(numOfRequests < 1){
        eraseHomepageStructure()
    }
   
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
        if(numOfRequests < 1){
            for(let i = 0; i < Math.ceil(j.results_shown / 3); i++){
                createRow(i)
            }
            addCards(j)
        }else{
            replaceCardData(j)
        }
        numOfRequests++
    }).catch(function(err) {
        console.log('error')
    })

}

function eraseHomepageStructure(){
    document.getElementById('right-container').style.display = 'block'
    document.getElementById('right-container').style.gridTemplateRows = 'none'
    document.getElementById('header-container').remove()
    document.getElementById('step1-container').remove()
    document.getElementById('step2-container').remove()
}

function createRow(count){
    let row = document.createElement('div')
    row.id = 'row' + (count + 1)
    document.getElementById('right-container').appendChild(row)
    row.style.width = '100%'
    row.style.height = '33.33%'
    row.style.display = 'flex'
}

function addCards(data){
    createModal()
    
    let modalTitles = {}
    let modalAddresses = {}
    let modalTimings = {}
    let modalPricings = {}
    let modalRatings = {}

    let count = 1
    for(let i = 0; i < data.results_shown; i++){
        // card container creation 
        let cardContainer = document.createElement('div')
        cardContainer.classList.add('card-container')
        cardContainer.id = 'card-container-' + i

        if(i > 0 && i % 3 == 0){
            count += 1
        }

        document.getElementById('row' + count).appendChild(cardContainer)

        // card creation
        let card = document.createElement('div')
        card.classList.add('card')
        card.id = 'card' + i
        document.getElementById('card-container-' + i).appendChild(card)

        card.addEventListener('click', function(){
            document.getElementById('modal').style.display = 'block'
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            document.querySelector('body').classList.toggle('stop-scrolling')
            getTitleForModal(modalTitles, i)
            getAddressForModal(modalAddresses, i)
            getTimingForModal(modalTimings, i)
            getPricingForModal(modalPricings, i)
            getRatingForModal(modalRatings, i)
        })

        // card picture creation
        let cardPicture = document.createElement('div')
        cardPicture.classList.add('card-picture')
        cardPicture.id = 'cardPicture' + i

        cardPicture.style.background = '#848484 url(images/' + getRestaurantPic(data, i) + '.svg) no-repeat center'
        cardPicture.style.backgroundSize = '40% 70%'

        document.getElementById('card' + i).appendChild(cardPicture)

        // card caption creation
        let cardCaptionContainer = document.createElement('div')
        cardCaptionContainer.classList.add('card-caption-container')
        cardCaptionContainer.id = 'card-caption-container-' + i
        document.getElementById('card' + i).appendChild(cardCaptionContainer)
        
        let cardCaptionTextContainer = document.createElement('div')
        cardCaptionTextContainer.classList.add('card-caption-text-container')
        cardCaptionTextContainer.id = 'card-caption-text-container-' + i
        document.getElementById('card-caption-container-' + i).appendChild(cardCaptionTextContainer)

        let cardCaption = document.createElement('p')
        cardCaption.id = 'cardCaption' + i
        cardCaption.innerHTML = data.restaurants[i].restaurant.name
        cardCaption.classList.add('card-caption')
        document.getElementById('card-caption-text-container-' + i).appendChild(cardCaption)

        // each card iteration is a key to its unique data in this array 
        modalTitles['title' + i] = data.restaurants[i].restaurant.name
        modalAddresses['address' + i] = data.restaurants[i].restaurant.location.address 
        modalTimings['timing' + i] = data.restaurants[i].restaurant.timings
        modalPricings['pricing' + i] = data.restaurants[i].restaurant.average_cost_for_two
        modalRatings['rating' + i] = data.restaurants[i].restaurant.user_rating.aggregate_rating

        // card caption price creation
        let cardCaptionPriceContainer = document.createElement('div')
        cardCaptionPriceContainer.classList.add('card-caption-price-container')
        cardCaptionPriceContainer.id = 'card-caption-price-container-' + i
        document.getElementById('card-caption-container-' + i).appendChild(cardCaptionPriceContainer)

        let cardPrice = document.createElement('p')
        cardPrice.innerHTML = '$'.repeat(data.restaurants[i].restaurant.price_range)
        cardPrice.classList.add('card-caption')
        cardPrice.id = 'cardPrice' + i
        cardPrice.style.textAlign = 'center'
        document.getElementById('card-caption-price-container-' + i).appendChild(cardPrice)
    }

    let extraContainer = document.createElement('div')
    extraContainer.classList.add('extra-card-container')
    document.getElementById('row' + Math.ceil(data.results_shown / 3)).appendChild(extraContainer)
}

// card data is swapped out for new data 
function replaceCardData(data){
    let modalTitles = {}
    let modalAddresses = {}
    let modalTimings = {}
    let modalPricings = {}
    let modalRatings = {}

    for(let i = 0; i < data.results_shown; i++){
    
        document.getElementById('cardCaption' + i).innerHTML = data.restaurants[i].restaurant.name

        document.getElementById('cardPicture' + i).style.background = '#848484 url(images/' + getRestaurantPic(data, i) + '.svg) no-repeat center'
        document.getElementById('cardPicture' + i).style.backgroundSize = '40% 70%'

        document.getElementById('cardPrice' + i).innerHTML = '$'.repeat(data.restaurants[i].restaurant.price_range)

        document.getElementById('card' + i).addEventListener('click', function(){
            getTitleForModal(modalTitles, i)
            getAddressForModal(modalAddresses, i)
            getTimingForModal(modalTimings, i)
            getPricingForModal(modalPricings, i)
            getRatingForModal(modalRatings, i)
        })

        modalTitles['title' + i] = data.restaurants[i].restaurant.name
        modalAddresses['address' + i] = data.restaurants[i].restaurant.location.address 
        modalTimings['timing' + i] = data.restaurants[i].restaurant.timings
        modalPricings['pricing' + i] = data.restaurants[i].restaurant.average_cost_for_two
        modalRatings['rating' + i] = data.restaurants[i].restaurant.user_rating.aggregate_rating
    }
}


function getTitleForModal(modalTitles, index){
    document.getElementById('modalTitle').innerHTML = modalTitles['title' + index]    
}

function getAddressForModal(modalAddresses, index){
    document.getElementById('modalAddress').innerHTML = modalAddresses['address' + index]
}

function getTimingForModal(modalTimings, index){
    if(modalTimings['timing' + index] == ''){
        document.getElementById('modalTiming').innerHTML = 'N/A'
    }else{
        document.getElementById('modalTiming').innerHTML = modalTimings['timing' + index]
    }
}

function getPricingForModal(modalPricings, index){
    if(modalPricings['pricing' + index] == ''){
        document.getElementById('modalPricing').innerHTML = 'N/A'
    }else{
        document.getElementById('modalPricing').innerHTML = `Average Price for Two: $${modalPricings['pricing' + index]}` 
    }
}

function getRatingForModal(modalRatings, index){
    if(modalRatings['rating' + index] == ''){
        document.getElementById('modalRating').innerHTML = 'N/A'
    }else{
        document.getElementById('modalRating').innerHTML = `${modalRatings['rating' + index]} out of 5`
    }
}

// used for modal
function clickOutside(e){
    if(e.target == modal){
        document.getElementById('modal').style.display = 'none'
    }
}

function createModal(){
    let modal = document.createElement('div')
    let modalContent = document.createElement('div')
    modal.id = 'modal'
    modalContent.id = 'modal-content'

    modalContent.style.display = 'grid'
    modalContent.style.gridTemplateRows = 'repeat(5, 1fr)'

    document.getElementById('right-container').appendChild(modal)

    modal.appendChild(modalContent)

    // modal title creation
    let modalTitleContainer = document.createElement('div')
    modalTitleContainer.id = 'modalTitleContainer'
    modalContent.appendChild(modalTitleContainer)
    
    let modalTitleIcon = document.createElement('img')
    modalTitleIcon.id = 'modalTitleIcon'
    modalTitleIcon.src = 'images/restaurant-outline.svg'
    modalTitleContainer.appendChild(modalTitleIcon)

    let modalTitle = document.createElement('p')
    modalTitle.id = 'modalTitle'
    modalTitleContainer.appendChild(modalTitle)

    let closeBtn = document.createElement('p')
    closeBtn.id = 'closeBtn'
    closeBtn.innerHTML = '&times;'
    modalTitleContainer.appendChild(closeBtn)

    closeBtn.addEventListener('click', function(){
        document.getElementById('modal').style.display = 'none'
        document.querySelector('body').classList.toggle('stop-scrolling')
    })

    // modal address creation
    let modalAddressContainer = document.createElement('div')
    modalAddressContainer.id = 'modalAddressContainer'
    modalContent.appendChild(modalAddressContainer)

    let modalAddressIcon = document.createElement('img')
    modalAddressIcon.id = 'modalAddressIcon'
    modalAddressIcon.src = 'images/compass-outline.svg'
    modalAddressContainer.appendChild(modalAddressIcon)

    let modalAddress = document.createElement('p')
    modalAddress.id = 'modalAddress'
    modalAddressContainer.appendChild(modalAddress)

    // modal timing creation
    let modalTimingContainer = document.createElement('div')
    modalTimingContainer.id = 'modalTimingContainer'
    modalContent.appendChild(modalTimingContainer)

    let modalTimingIcon = document.createElement('img')
    modalTimingIcon.id = 'modalTimingIcon'
    modalTimingIcon.src = 'images/time-outline.svg'
    modalTimingContainer.appendChild(modalTimingIcon)

    let modalTiming = document.createElement('p')
    modalTiming.id = 'modalTiming'
    modalTimingContainer.appendChild(modalTiming)

    // modal pricing creation
    let modalPricingContainer = document.createElement('div')
    modalPricingContainer.id = 'modalPricingContainer'
    modalContent.appendChild(modalPricingContainer)

    let modalPricingIcon = document.createElement('img')
    modalPricingIcon.id = 'modalPricingIcon'
    modalPricingIcon.src = 'images/cash-outline.svg'
    modalPricingContainer.appendChild(modalPricingIcon)

    let modalPricing = document.createElement('p')
    modalPricing.id = 'modalPricing'
    modalPricingContainer.appendChild(modalPricing)

    // modal rating creation
    let modalRatingContainer = document.createElement('div')
    modalRatingContainer.id = 'modalRatingContainer'
    modalContent.appendChild(modalRatingContainer)

    let modalRatingIcon = document.createElement('img')
    modalRatingIcon.id = 'modalRatingIcon'
    modalRatingIcon.src = 'images/star-outline.svg'
    modalRatingContainer.appendChild(modalRatingIcon)

    let modalRating = document.createElement('div')
    modalRating.id = 'modalRating'
    modalRatingContainer.appendChild(modalRating)

    window.addEventListener('click', clickOutside)
}

function getRestaurantPic(data, index){
    let cuisine = data.restaurants[index].restaurant.cuisines
    let commaIndex = cuisine.search(',')
    let foodtype

    if(commaIndex != -1){
        foodtype = cuisine.substring(0, commaIndex)
    }else{
        foodtype = cuisine
    }

    if(cuisine.includes('Coffee and Tea')){
        foodtype = 'Coffee and Tea'
    }else if(cuisine.includes('Mexican')){
        foodtype = 'Mexican'
    }else if(cuisine.includes('Seafood')){
        foodtype = 'Seafood'
    }

    switch(foodtype){
        case '':
            return 'pop'
        case 'Afghan':
            return 'bowlOfSomethin'
        case 'Afghani':
            return 'bowlOfSomethin'
        case 'African':
            return 'kabob'  
        case 'American':
            return 'burger' 
        case 'Amish':
            return 'bread'
        case 'Argentine':
            return 'kabob'
        case 'Armenian':
            return 'bowlOfSomethin'
        case 'Asian':
            return 'riceBall'
        case 'Australian':
            return 'lobster'
        case 'Austrian':
            return 'lobster'
        case 'Belgian':
            return 'beer'
        case 'Bagels':
            return 'coffee'
        case 'Bakery':
            return 'bread'
        case 'Bar Food':
            return 'beer'
        case 'BBQ':
            return 'hambone'
        case 'Beverages':
            return 'sodaCup'
        case 'Brazilian':
            return 'kabob'
        case 'Breakfast':
            return 'donut'
        case 'British':
            return 'tea'
        case 'Bubble Tea':
            return 'sodaCup'
        case 'Burger':
            return 'burger'
        case 'Burmese':
            return 'bowlOfSomethin'
        case 'Cafe':
            return 'coffee'
        case 'Cajun':
            return 'lobster'
        case 'California':
            return 'burger'
        case 'Cambodian':
            return 'lobster'
        case 'Canadian':
            return 'coffee'
        case 'Cantonese':
            return 'riceBall'
        case 'Caribbean':
            return 'kabob'
        case 'Central Asian':
            return 'riceBall'
        case 'Chilean':
            return 'kabob'
        case 'Chili':
            return 'bowlOfSomethin'
        case 'Chinese':
            return 'riceBall'
        case 'Coffee and Tea':
            return 'coffee'
        case 'Colombian':
            return 'bowlOfSomethin'
        case 'Creole':
            return 'crab'
        case 'Crepes':
            return 'croissant'
        case 'Cuban':
            return 'kabob'
        case 'Danish':
            return 'croissant'
        case 'Deli':
            return 'cheese'
        case 'Desserts':
            return 'iceCreamCone'
        case 'Dim Sum':
            return 'kabob'
        case 'Diner':
            return 'burger'
        case 'Dominican':
            return 'kabob'
        case 'Donuts':
            return 'donut'
        case 'Drinks Only':
            return 'pop'
        case 'Eastern European':
            return 'kabob'
        case 'Ecuadorian':
            return 'bowlOfSomethin'
        case 'Ethiopian':
            return 'kabob'
        case 'European':
            return 'kabob'
        case 'Fast Food':
            return 'fries'
        case 'Filipino':
            return 'bowlOfSomethin'
        case 'lobster and Chips':
            return 'lobster'
        case 'Fondue':
            return 'cheese'
        case 'French':
            return 'croissant'
        case 'Frozen Yogurt':
            return 'iceCream'
        case 'Fusion':
            return 'kabob'
        case 'Georgian':
            return 'misubi'
        case 'German':
            return 'beer'
        case 'Greek':
            return 'kabob'
        case 'Grill':
            return 'hambone'
        case 'Hawaiian':
            return 'hambone'
        case 'Healthy Food':
            return 'avocado'
        case 'Hungarian':
            return 'hambone'
        case 'Ice Cream':
            return 'iceCreamCone'
        case 'Indian':
            return 'bowlOfSomethin'
        case 'Indonesian':
            return 'bowlOfSomethin'
        case 'International':
            return 'kabob'
        case 'Iranian':
            return 'bowlOfSomethin'
        case 'Irish':
            return 'hambone'
        case 'Israeli':
            return 'kabob'
        case 'Italian':
            return 'pizza'
        case 'Jamaican':
            return 'kabob'
        case 'Japanese':
            return 'sushiWithChopsticks'
        case 'Jewish':
            return 'lobster'
        case 'Juices':
            return 'soda'
        case 'Kebab':
            return 'kebab'
        case 'Korean':
            return 'riceBall'
        case 'Laotian':
            return 'riceBall'
        case 'Latin American':
            return 'kabob'
        case 'Lebanese':
            return 'misubi'
        case 'Malaysian':
            return 'riceBall'
        case 'Mediterranean':
            return 'lobster'
        case 'Mexican':
            return 'taco'
        case 'Middle Eastern':
            return 'kabob'
        case 'Mongolian':
            return 'hambone'
        case 'Morrocan':
            return 'bowlOfSomethin'
        case 'Mughlai':
            return 'bowlOfSomethin'
        case 'Nepalese':
            return 'kabob'
        case 'New American':
            return 'kabob'
        case 'New Mexican':
            return 'taco'
        case 'New Zealand':
            return 'misubi'
        case 'Nicaraguan':
            return 'kabob'
        case 'Pacific':
            return 'lobster'
        case 'Pacific Northwest':
            return 'lobster'
        case 'Pakistani':
            return 'bowlOfSomethin'
        case 'Pan Asian':
            return 'misubi'
        case 'Peruvian':
            return 'kabob'
        case 'Pizza':
            return 'pizza'
        case 'Po&quotBoys':
            return 'lobster'
        case 'Polish':
            return 'misubi'
        case 'Portuguese':
            return 'bowlOfSomethin'
        case 'Pub Food':
            return 'beer'
        case 'Puerto Rico':
            return 'kabob'
        case 'Ramen':
            return 'riceBall'
        case 'Russian':
            return 'kabob'
        case 'Salad':
            return 'tomato'
        case 'Salvadorean':
            return 'taco'
        case 'Sandwich':
            return 'burger'
        case 'Scandinavian':
            return 'hambone'
        case 'Scottish':
            return 'bread'
        case 'Seafood':
            return 'lobster'
        case 'Sichuan':
            return 'bowlOfSomethin'
        case 'Singaporean':
            return 'misubi'
        case 'Somali':
            return 'kabob'
        case 'Soul Food':
            return 'hambone'
        case 'South African':
            return 'kabob'
        case 'South American':
            return 'kabob'
        case 'Southern':
            return 'corn'
        case 'Southwestern':
            return 'hambone'
        case 'Spanish':
            return 'taco'
        case 'Sri Lankan':
            return 'riceBall'
        case 'Steak':
            return 'hambone'
        case 'Sushi':
            return 'sushiWithChopsticks'
        case 'Taco':
            return 'taco'
        case 'Taiwanese':
            return 'misubi'
        case 'Tapas':
            return 'taco'
        case 'Thai':
            return 'riceBall'
        case 'Tea':
            return 'tea'
        case 'Teriyaki':
            return 'riceBall'
        case 'Tex-Mex':
            return 'taco'
        case 'Tibetan':
            return 'kabob'
        case 'Tunisian':
            return 'bowlOfSomethin'
        case 'Turkish':
            return 'bowlOfSomethin'
        case 'Ukranian':
            return 'kabob'
        case 'Uruguayan':
            return 'kabob'
        case 'Vegetarian':
            return 'avocado'
        case 'Venezuelan':
            return 'kabob'
        case 'Vietnamese':
            return 'riceBall'
        case 'Welsh':
            return 'hambone'
    }
}
