
import Provider from "@/components/Provider";
import "../globals.css";
import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";


export const metadata = {
  title: "ZepLao Chat",
  description: "Chat with ZepLao",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-blue-2">
        <Provider>
          <TopBar />
          {children}
          <BottomBar />
        </Provider>
      </body>
    </html>
  );
}
