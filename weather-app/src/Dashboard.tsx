import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import "./Dashboard.css";
import {
  useState,
  useEffect,
  ChangeEventHandler,
  FormEventHandler,
  SetStateAction,
  Dispatch,
} from "react";

interface WeatherData {
  currentConditions?: currentConditions;
  address?: string;
  days?: DailyData[];
  description?: string;
}

interface DailyData {
  conditions?: string;
  datetime?: string;
  temp?: number;
  cloudcover?: number;
  uvindex?: number;
  tempmax?: number;
  tempmin?: number;
}

interface currentConditions {
  conditions?: string;
  temp?: number;
  datetime?: string;
  sunrise?: string;
  sunset?: string;
  feelslike?: number;
  humidity?: number;
}

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [otherCity1, setOtherCity1] = useState<WeatherData | null>(null);
  const [otherCity2, setOtherCity2] = useState<WeatherData | null>(null);
  const [otherCity3, setOtherCity3] = useState<WeatherData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [days, setDays] = useState<DailyData[]>([]);

  const apiKey = import.meta.env.VITE_API_KEY;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    fetchWeatherData(searchQuery);
  };

  async function fetchWeatherData(
    searchQuery: string,
    latitude?: number,
    longitude?: number
  ) {
    let apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/`;

    if (latitude !== undefined && longitude !== undefined) {
      apiUrl += `${latitude},${longitude}?unitGroup=uk&key=${apiKey}`;
    } else {
      searchQuery = searchQuery.trim().toLowerCase();
      apiUrl += `${searchQuery}?unitGroup=uk&key=${apiKey}`;
    }

    try {
      const request = await fetch(apiUrl);
      const response = await request.json();
      console.log("api response from searchQuery", response);
      setWeatherData(response);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
    }
  }

  function fireOtherCity() {
    fetchOtherCity("Mandaluyong", setOtherCity1);
    fetchOtherCity("Stockholm", setOtherCity2);
    fetchOtherCity("London", setOtherCity3);
  }

  async function fetchOtherCity(
    searchQuery: string,
    setter: Dispatch<SetStateAction<WeatherData | null>>
  ): Promise<void> {
    searchQuery.trim().toLowerCase();

    try {
      const request = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQuery}?unitGroup=uk&key=${apiKey}`
      );
      const response = await request.json();
      console.log("api response", response);
      setter(response);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  useEffect(() => {
    if (weatherData?.days) {
      const firstSevenDays = weatherData.days.slice(0, 7);
      setDays(firstSevenDays);
      console.log("days", firstSevenDays);
    } else if (weatherData === null) {
      console.log("No weather data available.");
    } else if (weatherData === undefined) {
      console.log("Weather data is still loading...");
    }
  }, [weatherData]);

  useEffect(() => {
    fireOtherCity();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(
            "",
            position.coords.latitude,
            position.coords.longitude
          );
          setLocationEnabled(true);
        },
        (error) => {
          let errMessage = "";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationEnabled(false);
              errMessage =
                "Location access denied. Please allow location access in your browser settings to see local weather.";
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationEnabled(false);
              errMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              setLocationEnabled(false);
              errMessage = "Getting your location timed out.";
              break;
            default:
              setLocationEnabled(false);
              errMessage =
                "An unexpected error occurred while getting your location.";
              break;
          }
          setLocationError(errMessage);
          console.error("Geolocation error: ", errMessage);
        }
      );
    } else {
      setLocationEnabled(false);
      setLocationError("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const formatTime = (timeString: string | undefined): string | undefined => {
    if (!timeString) {
      return "N/A";
    }

    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour ? hour : 12;

    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  function formatDate(dateString: string | undefined): string | undefined {
    if (!dateString) {
      return "Loading...";
    }
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
  }

  return (
    <div className="relative z-10 h-screen w-screen">
      {locationEnabled === false && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
          <Card className="w-96 gap-0">
            <CardHeader className="pb-2">
              <CardTitle className="mb-0">LOCATION REQUIRED</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {locationError && (
                <p className="text-red-400 mb-2">{locationError}</p>
              )}
              <p> You might need to:</p>
              <ul className="list-disc list-inside">
                <li>Check your browser settings.</li>
                <li>Allow location access for this site.</li>
                <li>Refresh the page after enabling location.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {locationEnabled !== false && (
        <div className="relative z-10 p-4 box-border grid w-full gap-4 overflow-y-auto grid-cols-1 auto-rows-auto  min-h-screen  h-full lg:grid-cols-[0.5fr_1.2fr_0.5fr] lg:grid-rows-[0.1fr_auto_1.5fr] lg:py-10 lg:px-25 ">
          <p className="min-w-3xs text-2xl justify-self-center font-bold text-white flex flex-row-reverse justify-end items-center lg:justify-self-start">
            The Weather App
            <img
              src="/weather-icon.svg"
              alt="Weather Icon"
              style={{ width: "50px" }}
            ></img>
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center "
          >
            <Input
              type="search"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search"
              className="text-white text-center font-medium text-lg placeholder:text-white border-none bg-[#bfc6cf]/50 focus-visible:outline focus-visible:ring-1 focus-visible:ring-[#bfc6cf]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#6c94bc] lg:row-start-1 lg:col-start-2 lg:col-span-1 lg:h-10"
            />
          </form>

          <Card className="w-full bg-[#2d61a3] shadow-md border-none lg:row-start-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">
                {weatherData?.address?.toLocaleUpperCase() || "..."}
              </CardTitle>
              <CardDescription className="text-white">
                as of{" "}
                {weatherData?.currentConditions?.datetime
                  ? formatTime(weatherData?.currentConditions?.datetime)
                  : "Loading..."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white font-bold text-5xl text-center my-12">
              {weatherData?.currentConditions?.temp || "Loading"}°C
            </CardContent>
            <CardFooter className="text-white justify-center text-lg font-medium">
              {weatherData?.currentConditions?.conditions || "Loading..."}
            </CardFooter>
            <CardFooter className="text-white justify-evenly text-center text-sm font-normal">
              {weatherData?.description || "Loading..."}
            </CardFooter>
          </Card>

          <Card className="w-full grid grid-cols-[1fr_1fr_1fr_1fr] lg:grid-rows-[1fr_1fr] bg-[#2d61a3] px-6 shadow-md border-none lg:row-start-2 lg:col-span-1">
            <Card className="bg-[#bfc6cf]/20 border-none w-full rounded-md row-start-1 col-start-1 col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Feels Like
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white font-bold text-center">
                {weatherData?.currentConditions?.feelslike}°C
              </CardContent>
            </Card>

            <Card className="bg-[#bfc6cf]/20 border-none w-full rounded-md lg:row-start-1 lg:col-start-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Humidity
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white font-bold text-center">
                {weatherData?.currentConditions?.humidity}%
              </CardContent>
            </Card>

            <Card className="bg-[#bfc6cf]/20 border-none w-full rounded-md lg:row-start-2 lg:col-start-1 lg:col-span-">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Min Temp
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white font-bold text-center">
                {days[0]?.tempmin}°C
              </CardContent>
            </Card>

            <Card className="bg-[#bfc6cf]/20 border-none w-full rounded-md lg:row-start-2 lg:col-start-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Max Temp
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white font-bold text-center">
                {days[0]?.tempmax}°C
              </CardContent>
            </Card>

            <Card className="bg-[#bfc6cf]/20 border-none w-full rounded-md lg:row-start-1 lg:col-start-4 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Cloud Cover
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white font-bold text-center">
                {days[0]?.cloudcover}%
              </CardContent>
            </Card>

            <Card className="bg-[#bfc6cf]/20 border-none w-full rounded-md lg:row-start-2 lg:col-start-4 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  UV Index
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white font-bold text-center">
                {days[1]?.uvindex}
              </CardContent>
            </Card>

            <Card className="bg-[#bfc6cf]/20 border-none w-full rounded-md lg:col-start-3 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Sunrise
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white font-bold text-center">
                {weatherData?.currentConditions?.sunrise} am
              </CardContent>
            </Card>

            <Card className="bg-[#bfc6cf]/20 border-none w-full rounded-md lg:row-start-2 lg:col-start-3 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white text-center">Sunset</CardTitle>
              </CardHeader>
              <CardContent className="text-white font-bold text-center">
                {weatherData?.currentConditions?.sunset
                  ? formatTime(weatherData?.currentConditions?.sunset)
                  : "loading..."}
              </CardContent>
            </Card>
          </Card>

          <Card className="w-full bg-[#2d61a3] border-none lg:row-start-3 lg:col-span-2 px-6">
            <CardHeader className="p-0">
              <CardTitle className="text-white">7 Day Forecast</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-row justify-around items-center gap-4 overflow-auto pb-4 px-0">
              {days.map((day) => (
                <Card className="bg-[#bfc6cf]/20 border-none w-32 h-48 rounded-md">
                  <CardHeader>
                    <CardTitle className="text-white text-sm font-medium text-center">
                      {formatDate(day.datetime)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white text-xl font-bold text-center">
                    {day?.temp || "Loading"}°C
                  </CardContent>
                  <CardFooter className="text-white text-sm font-medium justify-evenly text-center">
                    {day?.conditions || "Loading"}
                  </CardFooter>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-transparent border-none shadow-none lg:col-start-3 lg:col-span-1 lg:row-start-2 lg:max-h-full p-0 gap-6">
            <CardHeader className="p-0">
              <CardTitle className="text-white pl-1">Other Cities</CardTitle>
            </CardHeader>

            <CardContent className="w-full grid grid-cols-1 gap-6 w-full p-0">
              <Card className="w-full bg-[#2d61a3] border-none shadow-md flex flex-row justify-between py-7">
                <CardContent className="text-white text-lg font-bold">
                  {otherCity1?.address || "Loading..."}
                </CardContent>
                <CardContent className="text-white text-lg font-bold">
                  {otherCity1?.currentConditions?.temp || "Loading..."}°C
                </CardContent>
              </Card>

              <Card className="w-full bg-[#2d61a3] border-none shadow-md flex flex-row justify-between py-7">
                <CardContent className="text-white text-lg font-bold">
                  {otherCity2?.address || "Loading..."}
                </CardContent>
                <CardContent className="text-white text-lg font-bold">
                  {otherCity2?.currentConditions?.temp || "Loading..."}°C
                </CardContent>
              </Card>

              <Card className="w-full bg-[#2d61a3] border-none shadow-md flex flex-row justify-between py-7">
                <CardContent className="text-white text-lg font-bold">
                  {otherCity3?.address || "Loading..."}
                </CardContent>
                <CardContent className="text-white text-lg font-bold">
                  {otherCity3?.currentConditions?.temp || "Loading..."}°C
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="bg-[#2d61a3] border-none lg:row-start-3 lg:col-start-3 lg:col-span-1 flex flex-col justify-center">
            <CardContent className="text-white text-sm  font-normal text-center">
              made with ❤️ by neo
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
