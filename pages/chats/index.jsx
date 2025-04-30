"use client";
import Layout from "./layout";
import api from "@/service/api";
import { useEffect, useState } from "react";
import { IoIosChatboxes } from "react-icons/io";

export default function Page() {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 border-12 border-gray-200 rounded-full aspect-square items-center justify-center m-12">
          <IoIosChatboxes className="text-6xl text-gray-700" />
          <h1 className="text-xl font-semibold text-gray-700">Choose a chat</h1>
        </div>
      </div>
    </Layout>
  );
}
