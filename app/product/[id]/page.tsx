"use client";
import { use } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const shirtTemplateUrl = "/template/shirt.png";

type product = {
  name: string;
  price: number;
  date_creation: string; // ISO
  contribution: string[];
  img_src: string;
  matrix: number[][]; //placeholder
};
function GetProduct(id: string) {
  const matrix: number[][] = [[1]];
  const thisBatik: product = {
    contribution: [],
    img_src: `${shirtTemplateUrl}`,
    date_creation: "2025-07-24T19:28:55+00:00",
    matrix: matrix,
    name: "Batik #67",
    price: 259000,
  };
  return thisBatik;
}
export default function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = GetProduct(id);
  const friendlyDate = format(new Date(product.date_creation), "MMMM do yyyy");
  return (
    <div className="text-accent-foreground flex flex-row justify-center items-center h-screen">
      <div className="flex flex-row h-2/3 items-center gap-10">
        <div className="h-fit relative flex items-center w-fit">
          <Image
            width={600}
            height={600}
            alt=""
            src={product.img_src}
            className=""
          ></Image>
          <div className="h-4/5 bg-secondary w-full -z-10 absolute rounded-[10px]"></div>
        </div>
        <div className="bg-secondary h-fit flex flex-col items-center rounded-[10px] p-8">
          <div className="stoke-regular text-[48px] mt-3">{product.name}</div>
          <div className=" opacity-70 text-[28px] mb-5">
            Created on {friendlyDate}
          </div>
          <div className="opacity-30 text-[20px] underline cursor-pointer">
            {product.contribution.length} people contributed to this apparel
          </div>
          <div className="flex flex-col gap-5 mt-5">
            <Button
              variant={"outline"}
              className="text-[28px] w-[385px] p-10 rounded-[8px]"
            >
              View Background
            </Button>
            <Button className="text-[28px] w-full p-10 rounded-[8px]">
              Purchase {product.price}{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
