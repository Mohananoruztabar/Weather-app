const searchBtn = document.querySelector('.search-btn')
const searchInput = document.querySelector('.search-input')
const locationTemp = document.querySelector('.location')
const weatherImg = document.querySelector('.weather-img')
const minTemp = document.querySelector('.mintemp')
const maxTemp = document.querySelector('.maxtemp')
const humidityEl = document.querySelector('.humidity')
const windEl = document.querySelector('.wind')
const cityName = document.querySelector('.city-name')
const chancerain = document.querySelector('.chancerain')
const tempture = document.querySelector('.tempture')
const dayEl = document.querySelector('.current-day')
const hourlyItems = document.querySelectorAll('.hourly-item')
const weather = document.querySelector('.weather')
const weeklyItems = document.querySelectorAll('.weekly-item')

const bgVideo = document.getElementById('bg-video');

function changeBackgroundVideo(weatherMain){
    switch(weatherMain){
        case "Clear":
            bgVideo.src = "assets/video/0_Blue_Sky_sunny.mov";
            break;
        case "Clouds":
            bgVideo.src = "assets/video/0_Clouds_Sky_3840x2160 - Trim.mp4";
            break;
        case "Rain":
            bgVideo.src = "assets/video/istockphoto-rainy.mp4";
            break;
        case "Snow":
            bgVideo.src = "assets/video/857032-snowy.mp4";
            break;
        default:
            bgVideo.src = "assets/video/7020362_Steamer_Flow.mp4";
    }
    bgVideo.play(); 
}


///API LINK////////
const apiKey = "263481c1f4751bed3f34b5a8e343cbf5"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric"

async function checkweather(city) {
    try{
        locationTemp.style.display = 'none';
        const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`)
        const data = await response.json()
        console.log(data)
        if(response.status === 404){
            locationTemp.style.display = 'block'

        }
        ///////Day
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date();
        const dayName = days[today.getDay()];


        
        tempture.innerHTML = (Math.floor(data.main.temp )) + "°C"
        cityName.innerHTML = data.name
        humidityEl.textContent = data.main.humidity + "%"
        windEl.innerHTML = Math.floor(data.wind.speed) + "m/s"
        dayEl.innerHTML = dayName

        const lat = data.coord.lat;
        const lon = data.coord.lon;

        DaysWeather(lat, lon)

        ///////img
        if(data.weather[0].main == "Mist"){
            weatherImg.src = "assets/img/mist-png.webp"
        }else if(data.weather[0].main == "Clear"){
            weatherImg.src = "assets/img/3d-yellow-sun-png.webp"
        }else if(data.weather[0].main == "Clouds"){
            weatherImg.src = "assets/img/cloudy-png.png"
        }else if(data.weather[0].main == "Rain"){
            weatherImg.src = "assets/img/3d-heavy-rain-png.webp"
        }else if(data.weather[0].main == "Thunderstorm"){
            weatherImg.src = "assets/img/thunderstorm-png.png"
        }else if(data.weather[0].main == "Snow"){
            weatherImg.src = "assets/img/heavy snow-png.png"
        }else if(data.weather[0].main == "Hail"){
            weatherImg.src = "assets/img/hail-png.webp"
        }else if(data.weather[0].main == "Tornado"){
            weatherImg.src = "assets/img/tornado-png.png"
        }

        changeBackgroundVideo(data.weather[0].main);

    }catch(error){
        console.error(error)
    }
}

/////////ForecastUrl//////////
async function cheakFore(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const responseForecast = await fetch(forecastUrl);
    const dataForecast = await responseForecast.json();

    minTemp.innerHTML = dataForecast.list[0].main.temp_min +"°C"
    maxTemp.innerHTML = dataForecast.list[0].main.temp_max +"°C"


    const targetHours = ["21:00:00", "15:00:00", "09:00:00", "03:00:00"];

    const tempsSelected = dataForecast.list.filter(item => {
        return targetHours.includes(item.dt_txt.split(" ")[1]);
    });

    
    tempsSelected.forEach((item, index) => {
    if(hourlyItems[index]){ 
        const tempEl = hourlyItems[index].querySelector('.hourly-temp');
        const hourEl = hourlyItems[index].querySelector('.hour');

        tempEl.textContent = Math.round(item.main.temp) + "°C";
        hourEl.textContent = item.dt_txt.split(" ")[1].slice(0,5);
    }
});

}
async function DaysWeather(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        
        const seenDays = new Set();
        const dailyForecasts = [];
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            
            if (!seenDays.has(dayKey)) {
                seenDays.add(dayKey);
                dailyForecasts.push({
                    date: date,
                    temp: item.main.temp
                });
            }
        });

        
        dailyForecasts.slice(0, 7).forEach((day, index) => {
            if(weeklyItems[index]){
                const dayNameEl = weeklyItems[index].querySelector('.day-name');
                const dayTempEl = weeklyItems[index].querySelector('.day-temp');

                const dayOfWeek = day.date.getDay();
                
                dayNameEl.textContent = days[dayOfWeek];
                dayTempEl.textContent = Math.round(day.temp) + "°C"; 
            }
        });

    } catch (error) {
        console.error('Error in DaysWeather:', error);
    }
}
searchBtn.addEventListener('click' , ()=>{
    let text = searchInput.value
    if(text == ''){
        text = 'tehran'
    }else{
        text = searchInput.value
    }
    checkweather(text)
    cheakFore(text)

})



