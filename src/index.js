import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import {fetchCountries} from './fetchCountries.js';
const DEBOUNCE_DELAY = 300;


const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
    e.preventDefault();
  
  const name = e.target.value.trim();
  let items = document.querySelectorAll('.country-list li');
  
  fetchCountries(name).then((data) => {
     if (name != '') {
    items.forEach(function (elem) {
      const position = elem.innerText.search(name); 
      if (position == -1) {
        elem.classList.add('hide');
        elem.innerHTML = elem.innerText;
      } else {
        elem.classList.remove('hide');
        let str = elem.innerText;
        elem.innerHTML = insertMark(str, position, name.length);
      }
    });
  } else {
    items.forEach(function (elem) {
      elem.classList.remove('hide');
      elem.innerHTML = elem.innerText;
      })
    }

    if (data.length > 10) {
      Notiflix.Notify.failure('Too many matches found. Please enter a more specific name.');
          
    } else if (data.status === 404) {
        
      Notiflix.Notify.failure('Oops, there is no country with that name');
    } else if (data.length === 1) {
          
      showCountry(data);
    }
    else if (data.length <= 10) {
      searchCountry(data);
    }
  })
  .catch((error) => console.log(error));
 clearCountryList();
 }

function clearCountryList() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function insertMark(string, pos, len) {
  return string.slice(0, pos) + '<mark>' + string.slice(pos + pos + len) + '</mark>' + string.slice(pos + len);
}

function showCountry(fields) {
 
  const markupInfo = fields.map(({ flags, name, capital, population, languages }) => {
    // const language = languages.map(({ name }) => name);
    
  return `<ul>
   <li><img src="${flags.svg}" alt="" widht="40" height="40"></img><b> ${name.official}</b></li>
  <li><b>Сapital: </b>${capital}</li>
  <li><b>Population: </b>${population}</li>
  <li><b>Languages: </b>${Object.values(languages).join(',')}</li>
  </ul>`
  }).join("");
   countryInfo.innerHTML = markupInfo; 
}

function searchCountry(fields) {
   const markup = fields.map(({flags, name}) => {
  return `<li><img src="${flags.svg}" alt="" widht=25" height="25"></img><b> ${name.official}</b></li>`
  }).join("");
  
  countryList.insertAdjacentHTML('beforeend', markup);
  console.log(countryList);
}


