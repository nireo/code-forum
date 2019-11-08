import React from "react";
import Container from "@material-ui/core/Container";
import Chat from "./Chat";

const ChatPage: React.FC = () => {
    return (
        <div>
            <Container maxWidth="md" style={{ paddingTop: "2rem" }}>
                <Chat />
            </Container>
        </div>
    );
};

export default ChatPage;
