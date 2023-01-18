import { Container, Box, Heading } from "@chakra-ui/react"
import Section from "../components/section.js"
import Paragraph from "../components/paragraph.js"
import Work from "./work.js"
import Contact from "./contact.js"

const Page = () => {
    return (
    <Container          
    maxW="container.lg">
        <Box p={3} mb={6} align="center"></Box>
        <Box borderRadius="lg" bg="teal" p={3} mb={6} align="center" fontWeight="semibold" color="white">
            Welcome to the new website!.
        </Box>
        <Box display={{md:'flex'}} >
            <Box flexGrow={1}>
                <Heading as="h2" variant="page-title">
                    Will Carter
                </Heading>
                <p>Developer | Designer | Creative</p>
            </Box>    
        </Box>
        <Section delay={0.1} >
            <Heading as="h3" variant="section-title">
                Bio
            </Heading>
            <Paragraph maxW="container.md" align="left">
            Digital design and product creation are what I love to do. 
            With over 8 years of development experience, I have the technical skillset
            to create performant and scalable products, while maintaining accesible user 
            experiences and a bit of creative flair. I have a variety of experience in agile 
            software development, from startups, to academic research for universities,
             and even large technical firms.
            </Paragraph>
        </Section>
        <Section delay={0.2}>
            <Work></Work>
        </Section>
        <Section delay={0.3}>
            <Contact></Contact>
        </Section>
    </Container>
    )
}

export default Page