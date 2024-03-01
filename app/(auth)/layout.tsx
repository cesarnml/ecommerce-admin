import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login/SignUp",
  description: "Authenticate",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="grid place-items-center h-full">{children}</div>;
}
