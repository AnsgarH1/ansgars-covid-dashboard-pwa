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
      pt="1rem"
      pl="1rem"
      pr="1rem"
    >
      <Box w="100vw" align="center">
        <Heading as="h2" color="gray.200" pt="10px">
          Corona Fallzahlen:
        </Heading>
        <Text color="gray.300">auf 100k Einwohner</Text>
      </Box>
      <Box w="100%" pt="1rem">
        <Input
          color="grey.100"
          type="text"
          placeholder="Landkreis suchen"
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
                background={
                  Math.round(item[1].weekIncidence) >= 200 ? "red.200" : "white"
                }
                m="3px"
                p="20px"
                borderRadius="5px"
                color="gray.600"
                fontWeight="semibold"
                letterSpacing="wide"
                ml="2"
              >
                <Heading fontSize="xl">
                  {item[1].name}: {Math.round(item[1].weekIncidence)}
                </Heading>
              </Box>
            ))}
        </Box>
      ) : (
        <Box flex="1" justify="center">
          <Spinner color="white" />
        </Box>
      )}
    </Flex>
  );
}

export default App;
