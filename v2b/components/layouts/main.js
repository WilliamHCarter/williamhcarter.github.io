import Head from 'next/head'
import { Box, Container } from '@chakra-ui/react'
import Navbar from '../navbar'

const Main = ({children, router}) => {
    return ( 
    <Box as="main" pb={8}>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>Will Carter - Home</title>

        </Head>
        <Navbar path={router.asPath}/>
        <Container maxW="container.md" pb={15}>
            {children}
        </Container>
    </Box>
    )

}

export default Main