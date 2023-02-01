import Head from 'next/head'
import { Box, Container } from '@chakra-ui/react'
import Navbar from '../navbar'

const Main = ({children, router}) => {
    return ( 
    <Box as="main" pb={8}>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>Will Carter - Home</title>
            <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png/"></link>
        </Head>
        <Navbar path={router.asPath}/>
        <Container maxW="container.lg" pt={16}>
            {children}
        </Container>
    </Box>
    )

}

export default Main