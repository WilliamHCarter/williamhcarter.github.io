import { forwardRef } from 'react'
import Logo from './logo'
import NextLink from 'next/link'
import {
    Container,
    Box,
    Button,
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
import { IoLogoGithub } from 'react-icons/io5'
import ThemeToggleButton from './theme-toggle-button'


const LinkItem = ({href, path, children}) => {
    const active = path === href
    const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')
    
    return(
        <Link
        as={NextLink}
        href={href}
        scroll={false}
        p={2}
        bg={active ? 'grassTeal' : undefined}
        color={active ? '#202023' : inactiveColor}
      >
        {children}
      </Link>
    )
}

const MenuLink = forwardRef((props, ref) => (
    <Link ref={ref} as={NextLink} {...props} />
  ))

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
          maxW="container.xl"
          wrap="wrap"
          align="center"
          justifyContent="space-between"
          >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="lg" fontSize="3xl" >
                    <Logo/>
                </Heading>

            </Flex>
            <Stack
                direction={{base: 'column', md: 'row'}}
                display={{base:'none', md: 'flex'}}
                width={{base:'full', md: 'auto'}}
                alignItems="center"
                justifyContent="flex-end"
                fontWeight="semibold"
                flexGrow={1}
                mt={{ base: 4, md: 0 }}
                >
                <LinkItem href="/work" path={path} >
                    Work
                </LinkItem>
                <LinkItem href="/WillCarterResume.pdf" path={path}>
                    Resume
                </LinkItem>
                <LinkItem href="/contact" path={path}>
                    Contact
                </LinkItem>
                <LinkItem href="https://github.com/williamhcarter">
                    <Button variant="solid"
                        leftIcon={<IoLogoGithub />}
                    >
                        Github
                    </Button>
                </LinkItem>
            
            <Box flex={0} align="right">
                <ThemeToggleButton/>
            </Box>
            </Stack>
            <Box ml={2} display={{base: 'inline-block', md: 'none' }}>
                    <Menu align="right">
                        <MenuButton as={IconButton} icon={<HamburgerIcon/>} variant="outline" aria-label="Options" />
                        <MenuList>
                            <MenuItem as={MenuLink} href="/">
                                About
                            </MenuItem>
                            <MenuItem as={MenuLink} href="/work">
                                Work
                            </MenuItem>
                            <MenuItem as={MenuLink} href="/WillCarterResume.pdf">
                                Resume
                            </MenuItem>
                            <MenuItem as={MenuLink} href="/contact">
                                Contact
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <ThemeToggleButton/>
                </Box>
          </Container>
    </Box>
    )
}

export default Navbar