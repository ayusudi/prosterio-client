import Layout from "../layout";
import { useEffect, useState } from "react";
import api from "@/service/api";
import { useParams } from "next/navigation";
import ChatPreview from "@/components/chat-preview";
import isAuth from "@/components/is-auth";

function Page() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (params?.id) {
      setIsLoading(true);
      api
        .get(`/api/chats/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setData(JSON.parse(res.data.chat.chats));
        })
        .catch((err) => {
          setData([{ role: "assistant", content: "Chat not found" }]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params]);

  return (
    <Layout>
      <div className="flex flex-col gap-4 overflow-y-auto">
        <ChatPreview chat={data} isLoading={isLoading} />
      </div>
    </Layout>
  );
}

export default isAuth(Page);