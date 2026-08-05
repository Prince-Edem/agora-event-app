import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, CalendarPlus, Share2, UserStar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const cards = [
  {
    icon: CalendarPlus,
    title: "Create in minutes",
    description: "Set the date, place, and details for any gathering, big or small.",
    bgClass: "bg-sky-600",
    iconClass: "text-white",
  },
  {
    icon: Share2,
    title: "Share with a link",
    description: "Send one link to your guests, however you already message them.",
    bgClass: "bg-emerald-600",
    iconClass: "text-white",
  },
  {
    icon: UserStar,
    title: "Track RSVPs live",
    description: "See who's in, who's out, and who hasn't answered yet.",
    bgClass: "bg-amber-500",
    iconClass: "text-white",
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
            Gathr makes it simple to set up an event, send it to your guests, and see who's coming - no spreadsheets required.
          </p>
        </div>
        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link href={"/events/new"}>
            <Button className="px-6 py-6 cursor-pointer">
              Create an event
              <span>
                <ArrowRight />
              </span>
            </Button>
          </Link>
          <Link href={"/dashboard"}>
            <Button className="px-6 py-6 cursor-pointer bg-white" variant="ghost">
              Open dashboard
            </Button>
          </Link>
        </div>
      </div>
      {/* Cards */}
      <div className="flex flex-col sm:flex-row mx-auto justify-center items-center gap-5">
        { cards.map((card, key) => {
          const Icon = card.icon;
          return (
            <Card key={key} className="flex-1 px-3 pb-14 pt-8 shadow-md">
              <CardHeader className="flex flex-col items-start gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${card.bgClass}`}>
                  <Icon className={`h-6 w-6 ${card.iconClass}`} />
                </span>
                <CardTitle>
                  <h2 className="font-semibold">{card.title}</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
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
