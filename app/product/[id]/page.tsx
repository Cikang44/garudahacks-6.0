"use client";
import { use } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import Countdown from "@/components/countdown/countdown";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

const shirtTemplateUrl = "/template/shirt.png";

type product = {
  name: string;
  price: number;
  createdAt: string; // ISO
  contribution: string[];
  imageUrl: string;
  matrix: number[][]; //placeholder
};
function GetProduct(id: string) {
  // const matrix: number[][] = [[1]];
  // const thisBatik: product = {
  //   contribution: [],
  //   img_src: `${shirtTemplateUrl}`,
  //   createdAt: "2025-07-24T19:28:55+00:00",
  //   matrix: matrix,
  //   name: "Batik #67",
  //   price: 259000,
  // };
  // return thisBatik;

  const { data, isLoading, error } = useSWR(`/api/product/${id}`, async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }
    return res.json() as Promise<product>;
  });

  if (error) {
    return {
      name: "Error loading product",
      price: 0,
      createdAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
      contribution: [],
      imageUrl: shirtTemplateUrl,
      matrix: [[1]],
    } as product;
  }

  if (isLoading || !data) {
    return {
      name: "Loading...",
      price: 0,
      closedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      contribution: [],
      imageUrl: shirtTemplateUrl,
      matrix: [[1]],
    } as product;
  }

  return {
    name: data.name,
    price: data.price,
    createdAt: data.createdAt,
    closedAt: (data as any).closedAt,
    contribution: data.contribution,
    imageUrl: data.imageUrl || shirtTemplateUrl,
    matrix: data.matrix || [[1]],
  } as product;
}
export default function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = GetProduct(id);
  const friendlyDate = format(new Date(product.createdAt), "MMMM do yyyy");
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      id: id,
      name: product.name,
      price: product.price,
      img_src: product.imageUrl,
      createdAt: product.createdAt,
    });
    
    // Optionally redirect to cart or show a success message
    router.push('/cart');
  };

  return (
    <>
      <div className="sticky top-0 z-10">
        <Countdown targetDate={(new Date((product as any).closedAt)).toISOString()} />
      </div>
      <div className="text-accent-foreground flex flex-row justify-center items-center h-screen">
        <div className="flex flex-row h-2/3 items-center gap-10">
          <div className="h-fit relative flex items-center w-fit">
            <Image
              width={600}
              height={600}
              alt=""
              src={product.imageUrl}
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
              {(product.contribution.length != 0 ? product.contribution.length : 5) ?? 5} people contributed to this apparel
            </div>
            <div className="flex flex-col gap-5 mt-5">
              <Button 
                className="text-[28px] w-full p-10 rounded-[8px]"
                onClick={handleAddToCart}
              >
                Purchase {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}