import Link from 'next/link'
import Image from 'next/image'
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'

const LogoBox = styled.span`
font-weight: bold;
display: inline-flex;
align-items: center;
height: 30px;
line-height: 20px;
padding: 10px;
`

const Logo = () => {
    const logoImage = `/logo${useColorModeValue('','-dark')}.png`
    return(
        <Link href='/'>
                <LogoBox>
                    <Image src={logoImage} width={20} height={20} alt="Logo"/>
                    <Text color={useColorModeValue('gray.800', 'whiteAlpha.900')}
                    fontFamily='Libre Franklin, sans-serif'
                    fontWeight={600}
                    ml={3}>
                        Will Carter
                    </Text>
                </LogoBox>
        </Link>
    )
    
}

export default Logo