import { IconButton } from "@chakra-ui/button";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text, Link } from "@chakra-ui/layout";
import React, { FunctionComponent } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import * as appData from "../../package.json";

type LayoutProps = {
  title: String;
};

const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  const history = useHistory();
  return (
    <Flex
      direction="column"
      w={["100vw"]}
      h="100vh"
      bgGradient="linear(to-b,#122e40 10%,#1d427d 41%,#41959a 72%, #cfcfcf 100%)"
      align="center"
      px={["1rem", "4rem"]}
    >
      {/*************** Header / Menu ****************/}
      <Box display="flex" width="100%" align="center" alignItems="center">
        <Box flex={1} align="center" background="#122e40">
          <Heading as="h2" color="gray.200" py="10px">
            <RouterLink to="/">{title} </RouterLink>
          </Heading>
        </Box>
        <IconButton
          variant="outline"
          aria-label="Einstellungen"
          icon={<SettingsIcon color="gray.200" />}
          onClick={() => history.push("/settings")}
        />
      </Box>

      {/*************** Content ****************/}
      <Box px={["1rem", "16vw", "24vw"]} height="100%" overflowY="scroll">
        {children}
      </Box>

      {/*************** Footer ****************/}
      <Box
        width="100vw"
        px={["1rem", "16vw", "24vw"]}
        background="#405250"
        display="flex"
        justifyContent="space-around"
        color="gray.200"
        position="absolute"
        bottom="0"
      >
        <Text>
          <Link isExternal href="https://www.hoyer-it.de">
            ©Hoyer-IT 2021
          </Link>{" "}
        </Text>{" "}
        <Text>|</Text>
        <Text>
          <Link isExternal href="https://www.hoyer-it.de/Impressum">
            Impressum und Datenschutz
          </Link>
        </Text>
        <Text>|</Text>
        <Text>v{appData.version}</Text>
      </Box>
    </Flex>
  );
};
export default Layout;
