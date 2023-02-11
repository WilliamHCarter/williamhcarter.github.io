import { useState, useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Image from "next/image";

const useParallax = (scrollY) => {
  const [height, setHeight] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    setHeight(imageRef.current?.offsetHeight || 0);
  }, [imageRef]);

  const inputRange = [-height, height];
  const outputRange = [-height * 0.1, height * 0.1];
  const translation = interpolate(scrollY, inputRange, outputRange);

  return { height, translation, imageRef };
};

function interpolate(inputValue, inputRange, outputRange) {
    return (
      outputRange[0] +
      (outputRange[1] - outputRange[0]) *
        ((inputValue - inputRange[0]) / (inputRange[1] - inputRange[0]))
    );

}

function useController() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollY;
}

const ParallaxImage = ({ image }) => {
  const scrollY = useController();
  const { height, translation, imageRef } = useParallax(scrollY);

  return (
    <Box
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={4}
      width="100%"
      height="100%"
      sx={{ "aspect-ratio": "16/10" }}
    >
      <Image
        style={{
          transform: `translate(-50%, ${Math.min(
            Math.max(translation, -height * 0.1),
            height * 0.1
          )}px) scale(1.2)`,
          objectFit: "cover",
          maxWidth: "110%",
        }}
        src={image}
        alt="thumbnail"
      />
    </Box>
  );
};

export default ParallaxImage;
