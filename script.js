//Elements
const heroSection = document.querySelector(".hero_section");
const heroSectionDetails = document.querySelector(".hero_section_details");
const cardContainer = document.querySelector(".card_container");

let selectedCardElements = [];
let pressed = false;
let startX;
let startScrollLeft;

function initialize(cards) {
  //Add card card items
  for(let i = 0; i < cards.length; i++) {
    
    let cardElement = createCardElement(cards[i]);
    //The first card when initializing will marked as animated already
    if(i == 0) {
      setHeroSectionBackground(cardElement.style.backgroundImage);
      selectedCardElements.push(cardElement);
      cardElement.remove();

      createCardFullscreenDetails(cards[i].id);
    }
  }

  cardContainer.addEventListener("mousedown", (event) => {
    pressed = true;
    startX = event.clientX;
    startScrollLeft = cardContainer.scrollLeft;
  });

  cardContainer.addEventListener("mouseup", () => {
    cardContainer.style.cursor = "default";
    pressed = false;
  });  

  cardContainer.addEventListener("mousemove", (event) => {
    if (!pressed) return;
    event.preventDefault();

    cardContainer.style.cursor = 'grabbing';

    // How far the mouse has been moved
    const dx = event.clientX - startX;

    // Scroll the element
    cardContainer.scrollLeft = startScrollLeft - dx;
  });
}

function setHeroSectionBackground(backgroundImage) {
  //Transfer image from cardFullscreen to heroSection
  heroSection.style.backgroundImage = backgroundImage;
}

function appendCardContentElements(card, cardElement) {
  const infoDiv = document.createElement("div");
  infoDiv.className = "card_info";

  const cardLocation = document.createElement("p");
  cardLocation.className = "card_info_location";
  cardLocation.innerText = card.location;

  const cardName = document.createElement("h1");
  cardName.className = "card_info_name";
  cardName.innerText = card.name;

  infoDiv.appendChild(cardLocation);
  infoDiv.appendChild(cardName);

  cardElement.appendChild(infoDiv);
}

function createCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.className = "card slideIn";
  cardElement.style.backgroundImage = "url(" + card.image + ")";
  cardElement.dataset.cardId = card.id;

  cardElement.addEventListener("click", cardClick);
  cardElement.addEventListener("animationend", cardSlideInAnimationEnd);

  appendCardContentElements(card, cardElement);

  cardContainer.appendChild(cardElement);

  return cardElement;
}

function cardSlideInAnimationEnd(event) {
  event.target.classList.remove("slideIn");
}

function cardSlideOutAnimationEnd(event) {
  event.target.remove();
}

function cardClick(event) {
  event.stopPropagation();

  const cardInfo = event.target.querySelector(".card_info");
  cardInfo.classList.add("textSlideOut");
  cardInfo.addEventListener("animationend", cardInfoAnimationEnd);
}

function cardInfoAnimationEnd(event) {
  event.stopPropagation();
  event.target.removeEventListener("animationend", cardInfoAnimationEnd);

  //Get the card element
  const cardElement = event.target.parentElement;

  //Hide clicked card before starting background animation
  cardElement.style.visibility = "hidden";
  //Animate hidden clicked card with slideOut
  cardElement.classList.add("slideOut");
  cardElement.addEventListener("animationend", cardSlideOutAnimationEnd);

  /* If card offsetLef is bigger than the window width, 
    remove (card width + (card margin * 2)) from the offsetLeft value 
    to prevent body horizontal scroll */
  const posLeft = (cardElement.offsetLeft >= window.outerWidth ? 
    (cardElement.offsetLeft - (cardElement.offsetWidth + 32)) :
    cardElement.offsetLeft);

  //Create cardFullscreen
  const cardFullscreen = document.createElement("div");
  cardFullscreen.className = "card_fullscreen";
  cardFullscreen.style.left = posLeft + 'px';
  cardFullscreen.style.top = cardElement.offsetTop + 'px';
  cardFullscreen.style.backgroundImage = cardElement.style.backgroundImage;
  cardFullscreen.dataset.cardId = cardElement.dataset.cardId;
  cardFullscreen.addEventListener("animationend", cardFullscreenAnimationEnd);

  heroSection.appendChild(cardFullscreen);

  //Save into the list of cards already selected
  selectedCardElements.push(cardElement);

  //Start slideIn animation for cards in the slider
  startCardSlideInAnimation(parseInt(cardElement.dataset.cardId));

  //Check if need to add back the previous cliked card to the slider
  if(selectedCardElements.length >= 2) {
    //Get card ID from previous card selected
    const previousCardItem = cards.filter(x => 
      x.id === parseInt(selectedCardElements[0].dataset.cardId))[0];

    //Remove first item from the selectedCardElements array
    selectedCardElements.shift();

    //Add card back to the card slider
    createCardElement(previousCardItem);
  }
}

function cardFullscreenAnimationEnd(event) {
  setHeroSectionBackground(event.target.style.backgroundImage);
  //Add card fullscreen details to the document.
  createCardFullscreenDetails(parseInt(event.target.dataset.cardId));

  //Remove cardFullscreen element
  event.target.remove();
}

function startCardSlideInAnimation(ignoreCardId) {
  const cards = document.querySelectorAll(".card");

  for(let i = 0; i < cards.length; i++) {
    if(parseInt(cards[i].dataset.cardId) === ignoreCardId) {
      continue;
    }

    cards[i].classList.add("slideIn");
  }
}

function createCardFullscreenDetails(cardId) {
  const cardFullscreenDetailsClassName = "card_fullscreen_details";

  //Remov old element with the card details
  const oldCardfullscreenDetailsElement = heroSectionDetails
    .querySelector("." + cardFullscreenDetailsClassName);
    
  if(oldCardfullscreenDetailsElement)
   oldCardfullscreenDetailsElement.remove();


  //Add new element with the card details 
  const card = cards.filter(x => x.id === cardId)[0];

  const cardFullscreenDetails = document.createElement("div");
  cardFullscreenDetails.className = cardFullscreenDetailsClassName;
  
  const cardLocation = document.createElement("p");
  cardLocation.innerText = card.location;

  const cardName = document.createElement("h1");
  cardName.innerText = card.name;

  cardFullscreenDetails.appendChild(cardLocation);
  cardFullscreenDetails.appendChild(cardName);

  heroSectionDetails.appendChild(cardFullscreenDetails);
}

const cards = [{
  id: 1,
  image: "https://i.postimg.cc/tCk1v4H2/3877461.jpg",
  location: "Nara, Japan",
  name: "Mount Yoshino"
},
{
  id: 2,
  image: "https://i.postimg.cc/63PcvfM4/download.jpg",
  location: "Wakayama, Japan",
  name: "Kumano-Nachi Taisha"
},
{
  id: 3,
  image: "https://i.postimg.cc/3wfr2kmD/download-1.jpg",
  location: "Kyoto, Japan",
  name: "Daigoji Temple"
},
{
  id: 4,
  image: "https://i.postimg.cc/N0dkhvrw/download-3.jpg",
  location: "Hyogo, Japan",
  name: "Himeji Castle"
},
{
  id: 5,
  image: "https://i.postimg.cc/vT3dGJzQ/download-4.jpg",
  location: "Gifu, Japan",
  name: "Shirakawa-go Village"
},
{
  id: 6,
  image: "https://i.postimg.cc/1tRQbRGW/download-5.jpg",
  location: "Shizuoka, Japan",
  name: "Mount Fuji"
}
]


initialize(cards);