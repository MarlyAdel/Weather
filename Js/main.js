
const apiKey = "4d77bc18c69b4fabb09201915241512";
const FindBtn = document.querySelector('#submit');
const searchInput = document.querySelector('#search');

let dateEle = document.querySelector('#mainDate');
let myEle = document.querySelector('h1');

// * Date&Time:

function getTime(){
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  let day = date.toLocaleDateString('en',{weekday: 'long'});
  let month = date.toLocaleDateString('en', {month: 'long'});
  let year = date.getFullYear();

 let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; 

  myEle.innerHTML = `${hours}:${minutes<10 ? '0'+minutes : minutes}:${seconds<10 ? '0'+seconds : seconds} <span style="color:white;font-size: 20px;">${ampm}</span>`;

  dateEle.innerHTML = `${day} ${month} ${year}`;

  setTimeout(getTime , 1000);
}
getTime();


// * Weather
searchInput.addEventListener('keyup', () => {
    const city = searchInput.value.trim(); 
    if (city) {
        searchWeather(city); 
    }
});    

window.onload = () => {
    searchWeather("Cairo");
}

async function searchWeather(city) {
  
  if (city.length <= 2) {
        console.log("City name must be more than 2 characters.");
        return;  
    }

    try {
        let res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
        
        if (!res.ok) {
            throw new Error('Weather data not found.');
        }

        let data = await res.json();
        
        updateMainCard(data.location, data.current);
        updateForecastCard(data.forecast.forecastday[1], "day2", "temp2", "min-temp2", "icon2", "condition2");
        updateForecastCard(data.forecast.forecastday[2], "day3", "temp3", "min-temp3", "icon3", "condition3");
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
   
}


function updateMainCard(location, current){

  document.getElementById("city-name").innerHTML = location.name,
  document.getElementById("temp").innerHTML = `${current.temp_c}<sup>o</sup>C`;
  document.getElementById("condition").innerText = current.condition.text;
  document.getElementById("icon").src = `https:${current.condition.icon}`; 

  const now = new Date();
  document.getElementById('day1').innerText = now.toLocaleDateString('en', { weekday: 'long' });
  document.getElementById('date1').innerText = now.toLocaleDateString('en', { day: 'numeric', month: 'long'});
}

function updateForecastCard(dayData, dayId, tempId, minTempId, iconId, conditionId){
  
  const day = new Date(dayData.date).toLocaleDateString('en',{ weekday: 'long'});

  document.getElementById(dayId).innerText = day;
  document.getElementById(iconId).src = `https:${dayData.day.condition.icon}`;
  document.getElementById(tempId).innerHTML = `${dayData.day.maxtemp_c}<sup>o</sup>C`;
  document.getElementById(minTempId).innerHTML = `${dayData.day.mintemp_c}<sup>o</sup>C`;
  document.getElementById(conditionId).innerText = dayData.day.condition.text;
}