import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CardComp from "./components/CardComp";
import { ICovData } from "./types/ICovData";
import { ICovHistoryData } from "./types/ICovHistoryData";
import { compare } from "./utility/compareICovData";

const App = () => {
  const [rkiData, setRkiData] = useState<Array<ICovData>>([]);
  const [history, setHistory] = useState<Array<ICovHistoryData>>([]);
  const [fetchFailed, setFetchFailed] = useState<Boolean>(false);
  const [favorites, setFavorites] = useState<Array<ICovData>>([]);
  const [filterString, setFilterString] = useState<string>("");

  const isFavorite = (item: ICovData): boolean => favorites.includes(item);

  //fetching Data from RKI Api
  useEffect(() => {
    const url: string =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=OBJECTID,AGS,BEZ,AGS_0,EWZ,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k,cases7_bl,death7_bl,cases7_lk,death7_lk,cases7_per_100k_txt,GEN&returnGeometry=false&outSR=4326&f=json";
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log("Fetched Data!", res);
        setRkiData(
          Object.values(res.features.map((items: any) => items.attributes))
        );
      })
      .catch((error) => {
        setFetchFailed(true);
        console.log("Fetch failed!", error);
      });
  }, []);

  //fetching Data from Corona-Zahlen Api
  useEffect(() => {
    const covid_url: string = `https://api.corona-zahlen.org/districts/history/incidence`;
    fetch(covid_url)
      .then((response) => response.json())
      .then((response) => {
        console.log(
          "covid-zahlen",
          Object.values(response.data).filter((item: any) =>
            item.name.includes("Berlin")
          )[0]
        );
        console.log("covid-zahlen", Object.values(response.data)[0]);
        setHistory(Object.values(response.data));
      })
      .then()
      .catch((err) => console.log("covid-daten-api-fehler:", err));
  }, []);

  const updateFavorites = async (item: ICovData) => {
    if (isFavorite(item)) {
      const newFavorites = [...favorites];
      const indexOfObject = newFavorites.indexOf(item);
      newFavorites.splice(indexOfObject, 1);
      console.log(newFavorites);
      setFavorites(newFavorites);
      saveFavoritesToLocalStorage(newFavorites);
    } else {
      const newFavorites = [...favorites, item];
      setFavorites(newFavorites);
      saveFavoritesToLocalStorage(newFavorites);
    }
  };

  //Load from Favorites
  useEffect(() => {
    const storedFavoritesJSON = localStorage.getItem("favorites");
    if (storedFavoritesJSON) {
      const storedFavoriteCountys: Array<string> = JSON.parse(
        storedFavoritesJSON
      );
      setFavorites(
        rkiData.filter((item) => storedFavoriteCountys.includes(item.county))
      );
    } else {
      console.log("no stored json found!");
    }
  }, [rkiData]);

  // Save to Favorites
  const saveFavoritesToLocalStorage = (newFavorites: Array<ICovData>): void => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(newFavorites.map((fav) => fav.county))
    );
    console.log(
      "saved Favorites to localStorage!",
      newFavorites.map((fav) => fav.county)
    );
  };

  return (
    <Flex
      direction="column"
      w="100vw"
      h="100vh"
      bgGradient="linear(to-b,#2F1847 ,#474a7a, #143642  20%)"
      align="center"
      pt="1rem"
      pl="1rem"
      pr="1rem"
    >
      {" "}
      <Box w="100vw" align="center">
        <Heading as="h2" color="gray.200" pt="10px">
          Corona Fallzahlen:
        </Heading>
      </Box>
      <Box w="100%" pt="1rem">
        <Input
          textColor="grey.100"
          colorScheme="grey.100"
          type="text"
          placeholder="Landkreis suchen"
          onChange={(event) => setFilterString(event.target.value)}
          style={{ color: "white" }}
        ></Input>
      </Box>
      {rkiData.length > 0 ? (
        <Box overflowY="scroll" overflowX="unset" mt="1rem" w="90vw">
          {" "}
          <Box my="1em">
            <Text color="gray.100">Favoriten:</Text>
          </Box>
          {favorites
            .filter(
              (item) =>
                filterString.length < 1 ||
                item.county.toLowerCase().includes(filterString.toLowerCase())
            )
            .map((favorite) => (
              <Box key={favorite.OBJECTID}>
                <CardComp
                  item={favorite}
                  isFavorite={isFavorite(favorite)}
                  handleFavoriteClick={() => {
                    updateFavorites(favorite);
                  }}
                  enableHistory={true}
                  history={history}
                />
              </Box>
            ))}
          <Box my="1em">
            <Text color="gray.100">Alle Landkreise:</Text>
          </Box>
          {rkiData
            .sort(compare)
            .filter(
              (item) =>
                filterString.length < 1 ||
                item.county.toLowerCase().includes(filterString.toLowerCase())
            )
            .map((item) => (
              <CardComp
                item={item}
                isFavorite={isFavorite(item)}
                handleFavoriteClick={() => updateFavorites(item)}
                history={[]}
                enableHistory={false}
              />
            ))}
        </Box>
      ) : (
        <Box flex="1" justify="center" my="2em">
          {fetchFailed ? (
            <Alert
              status="error"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Fehler beim Laden aktueller Covid-Zahlen!
              </AlertTitle>
              <AlertDescription>
                Es konnte nicht auf Daten des Robert-Koch-Instituts zugegriffen
                werden.
              </AlertDescription>
            </Alert>
          ) : (
            <Spinner color="white" />
          )}
        </Box>
      )}
      <Box
        width="100vw"
        background="gray.800"
        display="flex"
        justifyContent="space-around"
        color="gray.200"
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
      </Box>
    </Flex>
  );
};

export default App;
