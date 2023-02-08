import { Box, Text, CloseButton, useDisclosure } from "@chakra-ui/react";

const CompExample = () => {
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  return isVisible ? (
    <Box
      display="flex"
      borderRadius="lg"
      bg="teal"
      p={2}
      mb={6}
      align="center"
      justifyContent="space-between"
      fontWeight="semibold"
      color="white"
    >
      <Text width="2em"></Text>
      <Text m="0" alignSelf="center">
        Welcome to the new website!
      </Text>
      <CloseButton size="md" alignSelf="center" onClick={onClose} />
    </Box>
  ) : (
    <div w="0" h="0"></div>
  );
};
export default CompExample;
