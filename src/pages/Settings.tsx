import { Button } from "@chakra-ui/button";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Heading, Link, Spacer, Stack, Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { unregister } from "../serviceWorkerRegistration";

function SettingsPage() {
  const [deleteOfflineStatus, setDeleteOfflineStatus] = useState<boolean>(
    false
  );
  return (
    <Layout title="Einstellungen">
      <Stack pt="2rem" w="100%" px="1rem" flex="1">
        <Text color="gray.100">Debug:</Text>
        <Button
          isLoading={deleteOfflineStatus}
          onClick={() => {
            setDeleteOfflineStatus(true);
            unregister();
            setDeleteOfflineStatus(false);
          }}
        >
          Service-Worker löschen
        </Button>
        <Text color="gray.100">
          {" "}
          Der Service-Worker ist ein Skript welches die Offline-Benutzung
          ermöglicht, so das wenn die App geöffnet wird, die Webseite nicht
          jedes mal neu geladen werden muss
        </Text>
       
        <Link href="https://www.hoyer-it.de" isExternal color="gray.100">
        powered by Hoyer-IT <ExternalLinkIcon mx="2px" />
      </Link>
      </Stack>
      
    </Layout>
  );
}

export default SettingsPage;
