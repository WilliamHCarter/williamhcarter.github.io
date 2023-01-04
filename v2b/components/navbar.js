import Logo from './logo'
import NextLink from 'next/link'
import {
    Container,
    Box,
    Link,
    Stack,
    Heading,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    IconButton,
    useColorModeValue,
    position
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'

const LinkItem = ({href, path, children}) => {
    const active = path === href
    const inactiveColor = useColorModeValue('gray.200', 'whiteA')
    
    return(
        <NextLink href={href}>
            <Link 
            p={2}
            bg ={active ? 'glassTeal' : undefined}
            color ={active ? '#202023' : inactiveColor}>
                {children}
            </Link>

        </NextLink>
    )
}

const Navbar = props => {
    const {path} = props
    return(
    <Box
    position="fixed"
    as="nav"
    w="100%"
    bg={useColorModeValue('#ffffff40', '#20202380')}
    css={{ backdropFilter: 'blur(10px)' }}
    zIndex={1}
    {...props}
    >
          <Container
          display="flex"
          p={2}
          maxW="container.md"
          wrap="wrap"
          align="center"
          justify="space-between"
          >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="lg" letterSpacing={"tight"}>
                    <Logo/>
                </Heading>

            </Flex>
          </Container>
    </Box>
    )
}

export default Navbar