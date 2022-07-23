import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.scss";
import { trpc } from "./trpc";
const queryClient = new QueryClient();

const AppContent = () => {
  const hello = trpc.useQuery(["hello"]);
  const getMessages = trpc.useQuery(["getMessages", 100]);
  const addMessage = trpc.useMutation("addMessage");
  const userInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>{JSON.stringify(getMessages.data)}</div>
      <div>
        <input
          ref={userInputRef}
          className="border-red-400 border"
          placeholder="user"
        />
        <input
          ref={messageInputRef}
          className="border-red-400 border"
          placeholder="message"
        />
      </div>
      <button
        onClick={() => {
          if (messageInputRef.current && userInputRef.current) {
            addMessage.mutate(
              {
                message: messageInputRef.current.value ?? "",
                user: userInputRef.current.value ?? "",
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries(["getMessages"]);
                },
              }
            );
            messageInputRef.current.value = "";
            userInputRef.current.value = "";
          }
        }}
        className="border border-red-300"
      >
        add message
      </button>
    </div>
  );
};

const App = () => {
  const [trpcClient] = useState(() => {
    return trpc.createClient({
      url: "http://localhost:8080/trpc",
    });
  });
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
