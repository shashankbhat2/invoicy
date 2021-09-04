import { Container, Heading } from "@chakra-ui/react";
import React from "react";
import "./styles/App.scss";
import { GitHub } from "react-feather";
import InvoiceLayout from "./InvoiceLayout";

const App: React.FC = () => {
  return (
    <div className="App">
      <div>
        <header className="header">
          <Container maxW="container.xl">
            <nav className="nav_bar">
              <a href="/">
                <Heading fontSize="xl" className="logo">
                  Invoicey
                </Heading>
              </a>
              <a
                href="https://github.com/shashankbhat2/invoicy"
                target="_blank"
                rel="noreferrer"
              >
                <GitHub className="git_icon" />
              </a>
            </nav>
            <div className="hero">
              <Heading className="hero_title" fontSize="4xl">
                Quickly create invoices for your clients!
              </Heading>
            </div>
          </Container>
        </header>
        <Container maxW="container.xl">
          <InvoiceLayout />
        </Container>
      </div>
    </div>
  );
};

export default App;
