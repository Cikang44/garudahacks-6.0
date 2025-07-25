"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import useSWR from "swr";

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
    imageUrl: "/template/shirt.png",
    status: "Active",
    countdownTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "contribute",
  },
  {
    id: 2,
    name: "Retro Wave Hoodie",
    imageUrl: "/template/shirt.png",
    status: "Active",
    countdownTo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "contribute",
  },
  {
    id: 3,
    name: "Cyberpunk Jacket",
    imageUrl: "/template/shirt.png",
    status: "Locked",
    countdownTo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "buy",
  },
  {
    id: 4,
    name: "Minimalist Crewneck",
    imageUrl: "/template/shirt.png",
    status: "Active",
    countdownTo: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    buttonState: "buy",
  },
  {
    id: 5,
    name: "Graffiti Art Bomber",
    imageUrl: "/template/shirt.png",
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
  index: number;
  current: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ApparelCard: React.FC<ApparelCardProps> = ({ item, index, current }) => {
  const router = useRouter();
  const handleButtonClick = useCallback(
    (type: ButtonState) => {
      if (!router) return;
      router.push(
        type === "contribute" ? `/editor/${item.id}` : `/product/${item.id}`
      );
    },
    [router]
  );

  return (
    <Card
      className={`w-full has-hover: h-full relative border-none text-primary  overflow-hidden bg-transparent shadow-none flex flex-col items-center`}
    >
      <div className="absolute peer gap-4 hover:*:visible *:invisible flex flex-col items-center justify-center w-fit h-4/5 z-20 text-[28px] text-center">
        <p>
          You can contribute a portion to <br /> this apparel before the catalog
          resets
        </p>
        <Button
          onClick={() => handleButtonClick(item.buttonState)}
          size={"lg"}
          className="w-full text-[28px] h-1/8 transition-all pointer-events-auto"
        >
          {item.buttonState}
        </Button>
      </div>
      <div className="relative flex peer-hover:opacity-40 opacity-100 transition-opacity justify-center items-center h-[600px]">
        <div className="bg-secondary absolute w-full h-4/5 -z-10 rounded-[10px]"></div>
        <Image
          src={item.imageUrl}
          width={400}
          height={600}
          alt={item.name}
          className="h-4/5 w-auto object-cover duration-300 ease-in-out "
          style={{ height: current == index + 1 ? "100%" : "80%" }}
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

  useEffect(() => {
    console.log(current);
  }, [current]);

  const { data, isLoading, error } = useSWR('/api/showcase', fetcher);

  if (isLoading) return <div className="text-white flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="text-white flex items-center justify-center h-screen">Error loading showcase</div>;

  const apparels: Apparel[] = data.map((v: any) => ({
    id: v.id,
    name: v.name,
    imageUrl: v.imageUrl ?? '/template/shirt.png',
    buttonState: v.imageUrl ? "buy" : "contribute",
  }));

  return (
    <div className="w-full text-accent-foreground gap-36 bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="flex flex-col items-center">
        <div className="stoke-regular text-[64px] mt-72">Wastra Nusantara</div>
        <div className="text-[28px] text-[#AE8263] ">
          Blending Cultures through Batik
        </div>
      </div>
      <div className="w-full mx-auto">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            loop: true,
            align: "center",
          }}
          className="w-full group"
        >
          <CarouselContent className="-ml-8 select-none">
            {apparels.map((item, index) => (
              <CarouselItem key={item.id + index} className="pl-8 lg:basis-1/3 ">
                <div className="p-1">
                  <ApparelCard item={item} index={index} current={current} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
