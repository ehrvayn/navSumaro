import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { PostProvider } from "./context/PostContext";
import { ListingProvider } from "./context/ListingContext";
import { MessageProvider } from "./context/MessageContext";
import { GroupProvider } from "./context/GroupContex";
import { PageProvider } from "./context/PageContex";
import { EventProvider } from "./context/EventContex";
import { CurrentUserProvider } from "./context/CurrentUserContex";
import { LoginProvider } from "./context/LoginContex";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PageProvider>
      <CurrentUserProvider>
        <LoginProvider>
          <GroupProvider>
            <PostProvider>
              <ListingProvider>
                <MessageProvider>
                  <EventProvider>
                    <App />
                  </EventProvider>
                </MessageProvider>
              </ListingProvider>
            </PostProvider>
          </GroupProvider>
        </LoginProvider>
      </CurrentUserProvider>
    </PageProvider>
  </React.StrictMode>,
);
