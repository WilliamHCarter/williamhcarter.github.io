import Link from "next/link";
import Image from "next/image";
import { Text, useColorModeValue } from "@chakra-ui/react";
import styled from "@emotion/styled";

const LogoBox = styled.span`
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  height: 30px;
  line-height: 20px;
  padding: 10px;
  image-rendering: pixelated;
`;

const Logo = () => {
  const logoImage = `/logo1${useColorModeValue("", "-dark")}.png`;
  return (
    <Link href="/">
      <LogoBox>
        <Image src={logoImage} width={27} height={27} alt="Logo" />

        <Text
          color={useColorModeValue("gray.800", "whiteAlpha.900")}
          fontWeight={700}
          ml={1}
        >
          Will Carter
        </Text>
      </LogoBox>
    </Link>
  );
};

export default Logo;
