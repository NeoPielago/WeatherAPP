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
    <div className="relative z-10 p-4 grid grid-cols-[0.5fr_1.5fr_0.5fr] gap-4 grid-rows-[0.1fr_0.5fr_1.5fr] h-screen py-10 px-25 box-border">
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

      <Card className="w-full bg-[#2d61a3] border-none row-start-2">
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

      <div className="extra-weather"></div>
    </div>
  );
}

export default Dashboard;
