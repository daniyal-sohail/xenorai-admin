import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chat Widget",
    description: "AI Chatbot Widget",
};

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    padding: 0,
                    width: "100vw",
                    height: "100vh",
                    overflow: "hidden",
                    background: "transparent",
                    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                {children}
            </body>
        </html>
    );
}