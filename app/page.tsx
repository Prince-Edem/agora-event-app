import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, CalendarPlus, Share2, UserStar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  {
    icon: <CalendarPlus />,
    title: "Create in minutes",
    description: "Set the date, place, and details for any gathering, big or small."
  },
  {
    icon: <Share2 />,
    title: "Share with a link",
    description: "Send one link to your guests, however you already message them.",
  },
  {
    icon: <UserStar />,
    title: "Track RSVPs live",
    description: "See who's in, who's out, and who hasn't answered yet.",
  }
]

export default function Home() {
  return (
    <div className="py-16 space-y-12 md:py-18 md:space-y-16">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center max-w-xl space-y-5">
          <h1 className="text-4xl font-semibold">
            Create an event. Share it. Watch the yeses come in.
          </h1>
          <p className="text-muted-foreground">
            Palava makes it simple to set up an event, send it to your guests, and see who's coming — no spreadsheets required.
          </p>
        </div>
        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button className="px-6 py-5 cursor-pointer">
            Create and event
            <span>
              <ArrowRight />
            </span>
          </Button>
          <Button className="px-6 py-5 cursor-pointer border" variant="ghost">
            Open dashboard
          </Button>
        </div>
      </div>
      {/* Cards */}
      <div className="flex flex-col sm:flex-row max-w-4xl mx-auto justify-center items-center gap-5 font-semibold">
        { cards.map((card, key) => (
          <Card key={key} className="px-3 pb-7">
            <CardHeader>
              <span className="py-3">
                {card.icon}
              </span>
              <CardTitle>
                <h2>{card.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card> 
        ))}
        {/* <Card className="px-3 py-7">
          <CardHeader>
            <CardTitle>Share with a link</CardTitle>
          </CardHeader>
          <CardContent>
            Send one link to your guests, however you already message them.
          </CardContent>
        </Card>
        <Card className="px-3 py-7">
          <CardHeader>
            <CardTitle>Track RSVPs live</CardTitle>
          </CardHeader>
          <CardContent>
            See who's in, who's out, and who hasn't answered yet.
          </CardContent>
        </Card>  */}
      </div>
    </div>
  );
}
