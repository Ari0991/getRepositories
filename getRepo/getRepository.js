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
  return card;
}

async function searchRepo() {
  return await fetch(
    `https://api.github.com/search/repositories?q=${searchInput.value}&per_page=5&page=1`
  )
    .then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          let result = makeAnswer.call(this, res);
        });
      } else {
        removeAnswer.call(this);
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

const debounseSearch = debounce(searchRepo, 1000);

searchInput.addEventListener("keyup", debounseSearch);

function makeAnswer(arr) {
  removeAnswer.call(this);
  const repos = arr.items;
  repos.forEach((elem) => {
    let answer = document.createElement("li");
    answer.classList.add("search__item");
    answer.textContent = elem.name;
    searchResult.appendChild(answer);
    answer.addEventListener("click", function () {
      const newCard = createCard.call(this, elem);
      const text = newCard.querySelector(".search__card-text");
      text.textContent = `name: ${elem.name} \r\n`;
      text.textContent += `owner: ${elem.owner.login} \r\n`;
      text.textContent += `stars: ${elem.stargazers_count}`;
      removeAnswer();
    });
  });
  return this;
}

function removeAnswer() {
  searchResult.textContent = "";
}

listContainer.addEventListener("click", function (e) {
  const closeButtons = document.querySelectorAll(".search__card-button--close");

  closeButtons.forEach((elem) => {
    if (elem === e.target) {
      elem.parentElement.remove();
    }
  });
});