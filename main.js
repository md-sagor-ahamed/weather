
//User Interface/ DOM related properties and methods
const UI = {
    loadSelector(){
        const countryElem = document.querySelector(".country");
        const cityElem = document.querySelector(".city");
        const formElem = document.querySelector(".inputForm");
        const buttonElem = document.querySelector(".submitBtn");
        const messageElem = document.querySelector(".message");
        const displayCity = document.querySelector(".displayCity");
        const displayTemp = document.querySelector(".temparature");
        const displayPassure = document.querySelector(".passure");
        const displayHumidity = document.querySelector(".humidity");
        const displayFeel = document.querySelector(".w-feel");
        const displayIcon = document.querySelector(".icon");

        return {
            countryElem,
            cityElem,
            formElem,
            buttonElem,
            messageElem,
            displayCity,
            displayTemp,
            displayPassure,
            displayHumidity,
            displayFeel,
            displayIcon
        }
    },
    hideMessage(){
        const {messageElem} = this.loadSelector();
        setTimeout(() => {
            messageElem.innerHTML = "";
            // messageElem.remove();
        }, 2000)
    },
    showMessage(message){
        const {messageElem} = this.loadSelector();
        messageElem.classList.add("alertMessage");
        messageElem.textContent = message;
        //hideing message
        this.hideMessage();
    },
    validateInput(city, country){
        if(city === "" || country === ""){
            this.showMessage("Please fillup the necessary information to show the weather");
            return false;
        }
        return true;
    },
    getInput(){
        const {cityElem, countryElem} = this.loadSelector();
        const city = cityElem.value;
        const country = countryElem.value;
        //validation of input
        const isValidated = this.validateInput(city, country);
        return { city, country, isValidated }
    },
    clearInput(){
        const {cityElem, countryElem} = this.loadSelector();
        cityElem.value = "";
        countryElem.value = "";
    },
    getIcon(iconCode){
        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
    },
    async getAndPopulateUI(){
        // oad data from localStorage
        const {city, country} = storage.getData();
        // setting to weatherData and calling API
        weatherData.city = city;
        weatherData.country = country;

        const data = await weatherData.getData();
        //populate to UI
        this.populateUi(data);

    },
    populateUi(data){
        const {
            displayCity,
            displayTemp,
            displayPassure,
            displayHumidity,
            displayFeel,
            displayIcon} = this.loadSelector();
            const {weather, main, name: cityName} = data;
            displayCity.textContent = cityName;
            displayTemp.textContent = `Temperature: ${main.temp}°C`
            displayPassure.textContent = `Passure: ${main.pressure}`
            displayHumidity.textContent = `Humidity: ${main.humidity}`
            displayFeel.textContent = weather[0].main;
            const url = this.getIcon(weather[0].icon);
            displayIcon.setAttribute('src', url)
    },
    init(){
        const {formElem} = this.loadSelector();
        formElem.addEventListener('submit', async e => {
            //prevent broweser reload
            e.preventDefault();
            //take input
            const {city, country, isValidated} = this.getInput()
            //clear Input
            this.clearInput();
            if(isValidated){
                weatherData.city = city;
                weatherData.country = country;
                //saving data to local storage
                storage.city = city;
                storage.country = country;
                // saving data to local storage
                storage.saveData();
                storage.getData();
                // weatherData.getCityCountry();
                const data =await weatherData.getData();
                //populating UI
                if(data){
                    this.populateUi(data);
                }
            }
        })
    window.addEventListener('DOMContentLoaded', this.getAndPopulateUI.bind(this));
    }
}

UI.init();

// temp data store and dealing
const weatherData = {
    city: '',
    country: '',
    APP_ID: 'a2a2d5064018a6a690724479d2439e2a',
   async getData(){
        //Requesting dota to server
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.APP_ID}`);
            // return await res.json();

            const data = await res.json()
            if(data.cod >= 400){
                UI.showMessage(data.message)
                return false
            }else{
                return data;
            }
        }
        catch{
            UI.showMessage("Ploblem in fetching weather");
        }
    }
}

//LocalStorage
const storage = {
    city: '',
    country: '',
    saveData(){
        //saving data to local storage
        localStorage.setItem('BD-WEATHER-CITY', this.city);
        localStorage.setItem('BD-WEATERH-COUNTRY', this.country);
    },
    getData(){
        const city = localStorage.getItem('BD-WEATHER-CITY') || 'Dhaka';
        const country = localStorage.getItem('BD-WEATERH-COUNTRY') || 'BD';
        return {city, country}
    }
}



