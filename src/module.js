import './styles.css';

/*
 * News API constants
*/
const API_KEY = `0e54fdc30e0f4fe8a4e1e372a825af9d`;
const API_HOST = `http://newsapi.org/v2`;

/*
 * DOM constants
*/
const SOURCE_SELECT_ELEMENT = document.getElementById('sources');
const SEARCH_QUERY_ELEMENT = document.getElementById('search-query');
const SEARCH_FORM = document.getElementById('search-form');
const NEWS_FEED_CONTAINER = document.getElementById('news-feed');
const NOTHING_TO_SHOW_CONTAINER = document.getElementById('nothing-to-show-section');
const LOAD_MORE_CONTAINER = document.getElementById('load-more-section');
const LOAD_MORE_BUTTON = document.getElementById('load-more-button');

const DEFAULT_PAGE_SIZE = 5;
const FIRST_PAGE = 1
const EMPTY_SEARCH_QUERY = ''

// initialize feed once the page loaded
loadNews(getSelectedSource(), EMPTY_SEARCH_QUERY, FIRST_PAGE);

/*
 * Global variables
*/
var pageNo = 1;

/*
 * Register listeners
*/
SEARCH_FORM.addEventListener("submit", (e) => {
    e.preventDefault();
    resetPageNo();
    displayLoadMoreButton();
    cleanNewsFeed();
    loadNews(getSelectedSource(), getSearchQuery(), FIRST_PAGE);
});

LOAD_MORE_BUTTON.addEventListener("click", (e) => {
    e.preventDefault();
    if (pageNo < 8) {
        pageNo++;
        loadNews(getSelectedSource(), getSearchQuery(), pageNo);
    }
    if (pageNo == 8) {
        hideLoadMoreButton();
    }
})

SOURCE_SELECT_ELEMENT.addEventListener("change", (e) => {
    e.preventDefault();
    resetPageNo();
    displayLoadMoreButton();
    cleanNewsFeed();
    loadNews(getSelectedSource(), EMPTY_SEARCH_QUERY, FIRST_PAGE);
})

function loadNews(source, query, page, pageSize = DEFAULT_PAGE_SIZE) {
    fetchNews(source, query, page, pageSize)
        .then(response => {
            const articles = response.articles;
            const total = response.totalResults;
            if (total == 0) {
                displayNothingToShow();
                hideLoadMoreButton();
            } else if (total <= pageSize) {
                hideLoadMoreButton();
            }else {
                addArticlesToFeed(articles);
                displayLoadMoreButton();
            }
        });
}

async function fetchNews(source, query, page, pageSize) {
    let url = `${API_HOST}/everything?apiKey=${API_KEY}&sources=${source}&page=${page}&pageSize=${pageSize}`;
    if (query) {
        url += `&q=${query}`;
    }
    return await fetch(url)
        .then(response => response.json())
        .then(json => json);
}

function getSelectedSource() {
    return SOURCE_SELECT_ELEMENT.value;
}

function getSearchQuery() {
    return SEARCH_QUERY_ELEMENT.value;
}

function resetPageNo() {
    pageNo = 0;
}

function cleanNewsFeed() {
    NEWS_FEED_CONTAINER.textContent = '';
}

function hideNothingToShow() {
    NOTHING_TO_SHOW_CONTAINER.style.display = 'none';
}

function displayNothingToShow() {
    NOTHING_TO_SHOW_CONTAINER.style.display = 'flex';
}

function hideLoadMoreButton() {
    LOAD_MORE_CONTAINER.style.display = 'none';
}

function displayLoadMoreButton() {
    LOAD_MORE_CONTAINER.style.display = 'flex';
}

function addArticlesToFeed(articles) {
    for (const article of articles) {
        let html = generateArticleHTML(article);
        NEWS_FEED_CONTAINER.insertAdjacentHTML('beforeend', html);
    }
}

function generateArticleHTML(article) {
    const imageUrl = article.urlToImage ? article.urlToImage : 'https://cdn2.img.inosmi.ru/images/20739/28/207392879.jpg';
    const author = article.author ? article.author : 'Uknown author';
    const description = article.description ? article.description : 'Description is not available';
    const date = formatDate(article.publishedAt);
    const template =
        `<article class="news">
            <div class="news-image-wrapper">
                <img src="${imageUrl}">
            </div>
            <div class="news-description">
                <h2 class="news-description__title">${article.title}</h2>
                <div class="news-description__subtitle">
                    <span>${author} at </span>
                    <span>${date}</span>
                </div>
                <div class="news-description__text">${description}</div>
                <a class="news-description__more" href="${article.url}" target="blank_">More</a>
            </div>
        </article>`
    return template;
}

function formatDate(stringDate) {
    const date = new Date(stringDate);
    const formattedDate = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
    return formattedDate;
}