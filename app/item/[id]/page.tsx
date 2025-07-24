"use client";
import { use } from "react";

export default function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div>
      <p>{id}</p>
    </div>
  );
}
