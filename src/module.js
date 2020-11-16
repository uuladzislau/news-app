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

const DEFAULT_PAGE_SIZE = 5;
const FIRST_PAGE = 1
const EMPTY_SEARCH_QUERY = ''

/*
 * Global variables
*/
var pageNo = 1;
var source = getSelectedSource();

/*
 * Register listeners
*/
SEARCH_FORM.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedSource = getSelectedSource();
    const queryString = getSearchQuery();
    cleanNewsFeed();
    fetchNews(selectedSource, queryString, FIRST_PAGE, DEFAULT_PAGE_SIZE);
});

// initialize feed once the page loaded
fetchNews(source, EMPTY_SEARCH_QUERY, pageNo, DEFAULT_PAGE_SIZE);


function fetchNews(source, query, page, pageSize) {
    let url = `${API_HOST}/everything?apiKey=${API_KEY}&sources=${source}&page=${page}&pageSize=${pageSize}`;
    if (query) {
        url += `&q=${query}`;
    }
    fetch(url)
        .then(response => response.json())
        .then(json => {
            let total = json.totalResults;
            let articles = json.articles;
            console.log(articles);
            addArticlesToFeed(articles);
        });
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