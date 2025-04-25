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
}

interface currentConditions {
  conditions?: string;
  temp?: number;
  datetime?: string;
}

// TODO:
// I think we need to set a default value for the location so that when the page loads, it will show the weather for that location
// or you can use useEffect to fetch the default location based on user's location

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [otherCity1, setOtherCity1] = useState<WeatherData | null>(null);
  const [otherCity2, setOtherCity2] = useState<WeatherData | null>(null);
  const [otherCity3, setOtherCity3] = useState<WeatherData | null>(null);
  const [days, setDays] = useState<DailyData[]>([]);

  const apiKey = import.meta.env.VITE_API_KEY;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    fetchWeatherData(searchQuery);
  };

  // there should be a way to distribute the data from fetch oter city to other city variables.

  async function fetchWeatherData(searchQuery: string) {
    searchQuery.trim().toLowerCase();

    try {
      const request = await fetch(
        `      https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQuery}?unitGroup=uk&key=${apiKey}`
      );
      const response = await request.json();
      console.log("api response", response);
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
    <div className="relative z-10 p-4 grid grid-cols-[0.5fr_1.2fr_0.5fr] gap-4 grid-rows-[0.1fr_auto_1.5fr] h-screen py-10 px-25 box-border">
      <form onSubmit={handleSubmit} className="col-span-1">
        <Input
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search"
          className="h-10 text-white font-medium placeholder:text-white font border-none bg-[#bfc6cf]/50 focus-visible:outline focus-visible:ring-1 focus-visible:ring-[#bfc6cf]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#6c94bc] col-span-1"
        />
      </form>
      <Card className="w-full bg-[#2d61a3] shadow-md border-none row-start-2 col-span-1">
        <CardHeader>
          <CardTitle className="text-white">
            Current condition in{" "}
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
          {weatherData?.currentConditions?.temp || "Loading"} °C
        </CardContent>
        <CardFooter className="text-white justify-center text-lg font-medium">
          {weatherData?.currentConditions?.conditions || "Loading..."}
        </CardFooter>
        <CardFooter className="text-white justify-evenly text-center text-sm font-normal">
          {weatherData?.description || "Loading..."}
        </CardFooter>
      </Card>

      <Card className="w-full bg-[#2d61a3]  shadow-md border-none row-start-2 col-span-1">
        <CardHeader>
          <CardTitle className="text-white">Sunrise</CardTitle>
          <CardDescription className="text-white">
            Sunday, March 30, 2025
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white text-2xl font-bold">
          Sunrise and sunset times
        </CardContent>
        <CardFooter className="text-white"></CardFooter>
      </Card>

      <Card className="bg-transparent border-none shadow-none col-start-3 col-span-1 row-start-2 max-h-full overflow-auto p-0 gap-6">
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

      <Card className="w-full bg-[#2d61a3] border-none row-start-3 col-span-2">
        <CardHeader>
          <CardTitle className="text-white">7 Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-row justify-around items-center gap-2">
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

      <Card className="bg-[#2d61a3] border-none row-start-3 col-start-3 col-span-1 flex flex-col justify-center">
        <CardContent className="text-white text-sm  font-normal text-center">
          made with ❤️ by neo
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
