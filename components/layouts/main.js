import Head from "next/head";
import { Box, Container } from "@chakra-ui/react";
import Navbar from "../navbar";

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="William Carter Portfolio Homepage" />
        <meta name="author" content="William Carter" />
        <title>Will Carter - Home</title>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
      </Head>
      <Navbar path={router.asPath} />
      <Container maxW="container.lg" pt={16}>
        {children}
      </Container>
    </Box>
  );
};

export default Main;
