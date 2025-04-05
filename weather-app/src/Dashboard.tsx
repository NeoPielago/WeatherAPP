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

function Dashboard() {
  return (
    <div className="relative z-10 p-4 grid grid-cols-[0.5fr_1.2fr_0.5fr] gap-4 grid-rows-[0.1fr_auto_1.5fr] h-screen py-10 px-25 box-border">
      <Input
        placeholder="Search"
        className="h-10 text-white font-medium placeholder:text-white font border-none bg-[#bfc6cf]/50 focus-visible:outline focus-visible:ring-1 focus-visible:ring-[#bfc6cf]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#6c94bc] col-span-1"
      />

      {/* <Card className="w-full h-full bg-[#6c94bc]">
          <CardHeader>
            <CardTitle className="text-white">Current Weather</CardTitle>
            <CardDescription className="text-white">
              Current weather in your location
            </CardDescription>
          </CardHeader>
          <CardContent className="text-white text-2xl font-bold">
            25°C
          </CardContent>
          <CardFooter className="text-white">Sunny</CardFooter>
        </Card> */}

      <Card className="w-full bg-[#2d61a3] border-none row-start-2 col-span-1S">
        <CardHeader>
          <CardTitle className="text-white">Current Weather</CardTitle>
          <CardDescription className="text-white">7:10AM</CardDescription>
        </CardHeader>
        <CardContent className="text-white font-bold text-5xl text-center my-15">
          25°C
        </CardContent>
        <CardFooter className="text-white justify-center text-lg font-medium">
          Sunny
        </CardFooter>
      </Card>

      <Card className="w-full bg-[#2d61a3] border-none row-start-2 col-span-1">
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
              Cebu
            </CardContent>
            <CardContent className="text-white text-lg font-bold">
              32°C
            </CardContent>
          </Card>

          <Card className="w-full bg-[#2d61a3] border-none shadow-md flex flex-row justify-between py-7">
            <CardContent className="text-white text-lg font-bold">
              Stockholm
            </CardContent>
            <CardContent className="text-white text-lg font-bold">
              32°C
            </CardContent>
          </Card>

          <Card className="w-full bg-[#2d61a3] border-none shadow-md flex flex-row justify-between py-7">
            <CardContent className="text-white text-lg font-bold">
              London
            </CardContent>
            <CardContent className="text-white text-lg font-bold">
              32°C
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="w-full bg-[#2d61a3] border-none row-start-3 col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-row justify-around items-center gap-2">
          <Card className="bg-[#bfc6cf]/50 border-none w-32 h-48 rounded-md"></Card>
          <Card className="bg-[#bfc6cf]/50 border-none w-32 h-48 rounded-md"></Card>
          <Card className="bg-[#bfc6cf]/50 border-none w-32 h-48 rounded-md"></Card>
          <Card className="bg-[#bfc6cf]/50 border-none w-32 h-48 rounded-md"></Card>
          <Card className="bg-[#bfc6cf]/50 border-none w-32 h-48 rounded-md"></Card>
          <Card className="bg-[#bfc6cf]/50 border-none w-32 h-48 rounded-md"></Card>
          <Card className="bg-[#bfc6cf]/50 border-none w-32 h-48 rounded-md"></Card>
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
