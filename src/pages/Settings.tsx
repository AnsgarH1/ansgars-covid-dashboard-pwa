import { Button } from "@chakra-ui/button";
import { ArrowBackIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Link, Stack, Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import { Cookies } from "react-cookie-consent";
import { useHistory } from "react-router";
import Layout from "../components/Layout";
import { unregister } from "../serviceWorkerRegistration";

function SettingsPage() {
  const [deleteOfflineStatus, setDeleteOfflineStatus] = useState<boolean>(
    false
  );
  const history = useHistory();
  return (
    <Layout title="Einstellungen">
      <Stack pt="2rem" w="100%" px="1rem" flex="1">
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="outline"
          color="gray.100"
          onClick={() => history.push("/")}
        >
          zurück zum Start
        </Button>
        <Text color="gray.100" py="2rem">
          Debug:
        </Text>
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
        <Text color="gray.100" pb="2rem">
          {" "}
          Der Service-Worker ist ein Skript welches die Offline-Benutzung
          ermöglicht, so das wenn die App geöffnet wird, die Webseite nicht
          jedes mal neu geladen werden muss
        </Text>
        <Button
          onClick={() => {
            Cookies.remove("_ga");
            Cookies.remove("_gat");
            Cookies.remove("_gid");
          }}
        >
          Cookies löschen
        </Button>
        <Text pt="2rem" color="gray.100">
          powered by{" "}
          <Link href="https://www.hoyer-it.de" isExternal color="blue.300">
            Hoyer-IT <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
      </Stack>
    </Layout>
  );
}

export default SettingsPage;
