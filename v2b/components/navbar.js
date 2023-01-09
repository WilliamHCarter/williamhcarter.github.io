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
import ThemeToggleButton from './theme-toggle-button'


const LinkItem = ({href, path, children}) => {
    const active = path === href
    const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')
    
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
          justifyContent="space-between"
          >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="lg" letterSpacing={"tight"}>
                    <Logo/>
                </Heading>

            </Flex>
            <Stack
                direction={{base: 'column', md: 'row'}}
                display={{base:'none', md: 'flex'}}
                width={{base:'full', md: 'auto'}}
                alignItems="center"
                justifyContent="flex-end"
                flexGrow={1}
                mt={{ base: 4, md: 0 }}
                >
                <LinkItem href="/works" path={path}>
                    Work
                </LinkItem>
                <LinkItem href="/resume" path={path}>
                    Resume
                </LinkItem>
                <LinkItem href="/contact" path={path}>
                    Contact
                </LinkItem>
            
            <Box flex={0} align="right">
                <ThemeToggleButton/>
            </Box>
            </Stack>
            <Box ml={2} display={{base: 'inline-block', md: 'none' }}>
                    <Menu align="right">
                        <MenuButton as={IconButton} icon={<HamburgerIcon/>} variant="outline" aria-label="Options" />
                        <MenuList>
                            <NextLink href="/" passHref>
                            <MenuItem as={Link}>About</MenuItem>
                            </NextLink>
                            <NextLink href="/work" passHref>
                            <MenuItem as={Link}>Work</MenuItem>
                            </NextLink>
                            <NextLink href="/resume" passHref>
                            <MenuItem as={Link}>Resume</MenuItem>
                            </NextLink>
                            <NextLink href="/contact" passHref>
                            <MenuItem as={Link}>Contact</MenuItem>
                            </NextLink>
                        </MenuList>
                    </Menu>
                    <ThemeToggleButton/>
                </Box>
          </Container>
    </Box>
    )
}

export default Navbar