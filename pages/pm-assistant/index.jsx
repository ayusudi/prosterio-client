"use client";
import DefaultLayout from "@/components/default-layout";
import Chat from "@/components/chat";

export default function Page() {
  return (
    <DefaultLayout>
      <div>
        <Chat />
      </div>
    </DefaultLayout>
  );
}
