import ToastContext from "../../components/ToastContext";
import "../globals.css";
import Provider from "../../components/Provider";

export const metadata = {
  title: "ZepLao Chat Auth",
  description: "ZepLao Chat Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-purple-1">
        <Provider>
          <ToastContext />
          {children}
        </Provider>
      </body>
    </html>
  );
}
