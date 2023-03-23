const searchInput = document.querySelector(".search__input");
const searchResult = document.querySelector(".search__results");
const listContainer = document.querySelector(".search__list");

function createCard() {
  const card = document.createElement("li");
  const cardContent = document.createElement("div");
  const cardCloseButton = document.createElement("button");
  cardContent.classList.add("search__card-text");
  cardCloseButton.classList.add("search__card-button--close");
  card.appendChild(cardContent);
  card.appendChild(cardCloseButton);
  card.classList.add("search__card");
  listContainer.appendChild(card);

  const closeListener = cardCloseButton.addEventListener("click", function (e) {
    cardCloseButton.parentElement.remove();
  });
  return card;
}

async function searchRepo() {
  const searchUrl = `https://api.github.com/search/repositories?q=${this.value}&per_page=5&page=1`;
  return await fetch(searchUrl)
    .then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          makeAnswer(res);
        });
      } else {
        removeAnswer();
      }
    })
    .catch((err) => console.log(err));
}

const debounce = (fn, debounceTime) => {
  let count;
  return function (...args) {
    clearTimeout(count);
    count = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

const debounceSearch = debounce(searchRepo, 1000);

searchInput.addEventListener("input", debounceSearch);

function makeAnswer(arr) {
  removeAnswer();
  const repos = arr.items;
  repos.forEach((elem) => {
    let answer = document.createElement("li");
    answer.classList.add("search__item");
    answer.textContent = elem.name;
    searchResult.appendChild(answer);
    answer.addEventListener("click", function () {
      const newCard = createCard(elem);
      const text = newCard.querySelector(".search__card-text");
      text.textContent = `name: ${elem.name} \r\n`;
      text.textContent += `owner: ${elem.owner.login} \r\n`;
      text.textContent += `stars: ${elem.stargazers_count}`;
      removeAnswer();
    });
  });
}

function removeAnswer() {
  searchResult.textContent = "";
}
