import NextLink from "next/link";
import Image from "next/image";
import { Box, Text, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import ParallaxImage from "./parallax-image";

export const WorkGridItem = ({ children, id, title, thumbnail }) => (
  <Box w="100%" textAlign="Left">
    <LinkBox as={NextLink} href={`${id}`} scroll={false} cursor="pointer">
      <ParallaxImage image={thumbnail}></ParallaxImage>
      <LinkOverlay as="div" href={`/works/${id}`}>
        <Text mt={2} fontSize={18} fontWeight="semibold">
          {title}
        </Text>
      </LinkOverlay>
      <Text fontSize={14} mr="15%">
        {children}
      </Text>
    </LinkBox>
  </Box>
);

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 4px;
      }
    `}
  />
);
