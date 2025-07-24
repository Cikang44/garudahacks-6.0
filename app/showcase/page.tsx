"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type ApparelStatus = "Active" | "Locked";
type ButtonState = "contribute" | "buy";

interface Apparel {
  id: number;
  name: string;
  imageUrl: string;
  status: ApparelStatus;
  countdownTo: string; // ISO Date String
  buttonState: ButtonState;
}

const apparelData: Apparel[] = [
  {
    id: 1,
    name: "Cosmic Dreamer Tee",
    imageUrl:
      "https://placehold.co/600x800/1a1a1a/ffffff.png?text=Shirt+1&font=raleway",
    status: "Active",
    countdownTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "contribute",
  },
  {
    id: 2,
    name: "Retro Wave Hoodie",
    imageUrl:
      "https://placehold.co/600x800/1a1a1a/ffffff.png?text=Apparel+2&font=raleway",
    status: "Active",
    countdownTo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "contribute",
  },
  {
    id: 3,
    name: "Cyberpunk Jacket",
    imageUrl:
      "https://placehold.co/600x800/1a1a1a/ffffff.png?text=Shirt+3&font=raleway",
    status: "Locked",
    countdownTo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "buy",
  },
  {
    id: 4,
    name: "Minimalist Crewneck",
    imageUrl:
      "https://placehold.co/600x800/1a1a1a/ffffff.png?text=Apparel+4&font=raleway",
    status: "Active",
    countdownTo: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "buy",
  },
  {
    id: 5,
    name: "Graffiti Art Bomber",
    imageUrl:
      "https://placehold.co/600x800/1a1a1a/ffffff.png?text=Shirt+5&font=raleway",
    status: "Locked",
    countdownTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "contribute",
  },
];

interface CountdownTimerProps {
  targetDate: string;
}

interface ApparelCardProps {
  item: Apparel;
}

const ApparelCard: React.FC<ApparelCardProps> = ({ item }) => {
  const router = useRouter();
  const handleButtonClick = useCallback(
    (type: ButtonState) => {
      if (!router) return;
      router.push(
        type === "contribute" ? `/editor/${item.id}` : `/item/${item.id}`
      );
    },
    [router]
  );

  return (
    <Card className="w-full h-full border-none overflow-hidden bg-transparent shadow-none">
      <div className="relative ">
        <Badge
          variant={item.status === "Locked" ? "destructive" : "default"}
          className="absolute top-4 left-4 z-10"
        >
          {item.status}
        </Badge>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-auto object-cover aspect-[3/4] duration-300 ease-in-out hover:scale-105"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "https://placehold.co/600x800/1a1a1a/ffffff.png?text=Image+Error&font=raleway";
          }}
        />
      </div>
      <CardContent className="p-4 text-center"></CardContent>
    </Card>
  );
};

export default function ApparelShowcasePage() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const handleScroll = useCallback(() => {
    if (!api) return;

    const scrollProgress = api.scrollProgress();
    const slides = api.slideNodes();

    console.log(scrollProgress);
    slides.forEach((slide: any, index: any) => {
      const diff = Math.abs(index - scrollProgress * (slides.length - 1));
      const scale = 1 - Math.min(diff * 0.3, 0.3);
      const opacity = 1 - Math.min(diff * 0.5, 0.5);

      // slide.style.transform = `scale(${scale})`;
      // slide.style.opacity = `${opacity}`;
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;

    handleScroll();
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      handleScroll();
    };

    api.on("select", onSelect);
    api.on("scroll", handleScroll);

    return () => {
      api.off("select", onSelect);
      api.off("scroll", handleScroll);
    };
  }, [api, handleScroll]);

  return (
    <div className="w-full text-accent-foreground h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      <div>test</div>
      <div className="w-full max-w-7xl mx-auto">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            loop: true,
            align: "center",
          }}
          className="w-full group"
        >
          <CarouselContent className="-ml-8">
            {apparelData.map((item) => (
              <CarouselItem key={item.id} className="pl-8 lg:basis-1/3 ">
                <div className="p-1">
                  <ApparelCard item={item} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="py-4 text-center text-sm text-muted-foreground">
        Item {current} of {apparelData.length}
      </div>
    </div>
  );
}
