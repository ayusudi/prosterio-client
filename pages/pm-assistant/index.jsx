import DefaultLayout from "@/components/default-layout";
import Chat from "@/components/chat";
import isAuth from "@/components/is-auth";

function PMAssistantPage() {
  return (
    <DefaultLayout>
      <div>
        <Chat />
      </div>
    </DefaultLayout>
  );
}

export default isAuth(PMAssistantPage);