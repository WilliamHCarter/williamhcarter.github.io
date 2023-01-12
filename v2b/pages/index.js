import { Container, Box, Heading } from "@chakra-ui/react"
import Head from "next/head"
import Section from "../components/section.js"
import Paragraph from "../components/paragraph.js"
const Page = () => {
    return (
    <Container>
        <Box p={3} mb={6} align="center"></Box>
        <Box borderRadius="lg" bg="teal" p={3} mb={6} align="center">
            This should be a box with rounded corners.
        </Box>
        <Box display={{md:'flex'}}>
            <Box flexGrow={1}>
                <Heading as="h2" variant="page-title">
                    Will Carter
                </Heading>
                <p>Developer | Designer | Creative</p>
            </Box>    
        </Box>
        <Section delay={0.1}>
            <Heading as="h3" variant="section-title">
                Bio
            </Heading>
            <Paragraph>
                Paragraph
            </Paragraph>
        </Section>
    </Container>
    )
}

export default Page