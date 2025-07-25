"use client";

import { intervalToDuration, isAfter, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>();
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Ensure targetDate is a valid string before proceeding
    if (!targetDate) {
      setIsFinished(true);
      return;
    }

    const targetDateTime = parseISO(targetDate);

    // Initial check to see if the target date is already in the past
    if (isAfter(new Date(), targetDateTime)) {
      setIsFinished(true);
      return;
    }

    // Set up an interval to update the countdown every second
    const intervalId = setInterval(() => {
      const now = new Date();

      // If the current time is past the target time, stop the countdown
      if (isAfter(now, targetDateTime)) {
        setIsFinished(true);
        clearInterval(intervalId);
        return;
      }

      // Calculate the duration between now and the target date
      const duration = intervalToDuration({
        start: now,
        end: targetDateTime,
      });

      setTimeLeft({
        hours: duration.hours || 0,
        minutes: duration.minutes || 0,
        seconds: duration.seconds || 0,
      });
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts or targetDate changes
    return () => clearInterval(intervalId);
  }, [targetDate]); // Rerun the effect if the targetDate prop changes
  return (
    <div className="absolute  w-screen h-screen flex justify-center items-center">
      <div className="absolute top-5 bg-secondary text-secondary-foreground px-8 py-4 rounded-[10px] text-[28px] flex flex-row gap-4 items-center">
        <p>
          Catalog Reset in : {timeLeft?.hours}h {timeLeft?.minutes}m{" "}
          {timeLeft?.seconds}s
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <FaInfoCircle width={20} />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              When the countdown ends : <br />
              All purchasable apparel will be inactive and unpurchasable. <br />
              All contributable or active apparel will be purchasable
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
