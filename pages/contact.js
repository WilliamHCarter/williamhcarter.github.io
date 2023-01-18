import { Button, Container, Heading, Link, List, ListItem, NextLink } from '@chakra-ui/react'
import { IoLogoGithub } from 'react-icons/io5'
import { ChevronRightIcon, EmailIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
const Contact = () => (
  <Layout title="Work">
    <Container maxW="container.lg" p={0}>
        <Heading as="h3" variant="section-title">
          Contact
        </Heading>
        <List>
          <ListItem>
            <Link href="https://github.com/williamhcarter" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<IoLogoGithub />}
              >
                @WilliamHCarter
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="mailto:cartew4@rpi.edu" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<EmailIcon />}
              >
                cartew4@rpi.edu (English)
              </Button>
            </Link>
          </ListItem>
        </List>
    </Container>
  </Layout>
)

export default Contact
