import { ChakraProvider } from "@chakra-ui/react"
import Layout from '../components/layouts/main'
import Theme from '../theme.js'
import Fonts from '../components/fonts.js'
const Website = ({Component, pageProps, router}) =>{
    return (
        <ChakraProvider theme={Theme}>
            <Fonts/>
            <Layout router = {router}>
                <Component {...pageProps} key = {router.route}/>
            </Layout>
        </ChakraProvider>
    )
}

export default Website
