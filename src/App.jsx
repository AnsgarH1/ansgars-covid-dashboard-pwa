import { Box, Flex, Heading, Input, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("https://api.corona-zahlen.org/districts")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);
  const compare = (curr, prev) => {
    if (curr[1].name < prev[1].name) {
      return -1;
    }
    if (curr[1].name > prev[1].name) {
      return 1;
    }
    return 0;
  };
  
  const [filterString, setFilterString] = useState("");
  return (
    <Flex
      direction="column"
      w="100vw"
      h="100vh"
      bgGradient="linear(to-b, #91039c ,#8889d1,#292933  20%)"
      align="center"
      p="4rem"
    >
      <Box>
        <Heading as="h1" color="white">
          Hallo Covid!
        </Heading>
        <Text color="white" pt="10px">
          Aktuelle Corona Fallzahlen
        </Text>
      </Box>
      <Box w="100%" pt="1rem">
        <Input
          color="grey.100"
          type="text"
          placeholder="Ort suchen"
          onChange={(event) => setFilterString(event.target.value)}
        ></Input>
      </Box>
      {data ? (
        <Box overflowY="scroll" overflowX="unset" mt="1rem" w="90vw">
          {Object.entries(data.data)
            .sort(compare)
            .filter(
              (item) =>
                filterString.length < 1 || item[1].name.includes(filterString)
            )
            .map((item) => (
              <Box
                background="white"
                m="3px"
                p="20px"
                borderRadius="5px"
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                ml="2"
              >
                <p>{item[1].name}</p>
                <p>Fälle pro 100k: {Math.round(item[1].weekIncidence)}</p>
                <p>{item[1].population}</p>
              </Box>
            ))}
        </Box>
      ) : (
        <Box  flex="1" justify="center">
          <Spinner color="white" />
        </Box>
      )}
    </Flex>
  );
}

export default App;
