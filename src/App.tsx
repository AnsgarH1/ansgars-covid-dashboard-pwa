import { StarIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  Icon,
  Input,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { FunctionComponent, useEffect, useState } from "react";

interface ICovData {
  OBJECTID: number;
  AGS: string;
  BEZ: string;
  AGS_0: string;
  EWZ: number;
  death_rate: number;
  cases: number;
  deaths: number;
  cases_per_100k: number;
  cases_per_population: number;
  BL: string;
  BL_ID: string;
  county: string;
  last_update: string;
  cases7_per_100k: number;
  recovered: number;
  EWZ_BL: number;
  cases7_bl_per_100k: number;
  cases7_bl: number;
  death7_bl: number;
  cases7_lk: number;
  death7_lk: number;
  cases7_per_100k_txt: string;
  GEN: string;
}

interface ICardCompProps {
  item: ICovData;
  isFavorite: boolean;
  handleFavoriteClick: () => void;
}

const CardComp = ({
  item,
  isFavorite,
  handleFavoriteClick,
}: ICardCompProps) => {
  return (
    <Box
      key={item.OBJECTID}
      background={Math.round(item.cases7_per_100k) >= 200 ? "#e95d69" : "white"}
      m="6px"
      px="12px"
      py="12px"
      borderRadius="5px"
      color="gray.600"
      fontWeight="semibold"
      letterSpacing="wide"
      ml="2"
      display="flex"
      justifyContent="space-between"
    >
      <Box maxWidth="70%">
        <Box display="flex" alignItems="bottom">
          <Icon
            as={StarIcon}
            color={isFavorite ? "#f8f32b" : "#8f8f8f"}
            w="20px"
            mr="8px"
            onClick={handleFavoriteClick}
          />
          <Text fontSize="15px">{item.BEZ}</Text>
        </Box>
        <Box>
          <Heading fontSize="xl">{item.GEN}</Heading>
          <Text fontSize="12px">{item.last_update}</Text>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="space-around"
        flex="1"
      >
        <Box display="flex">
          <Heading fontSize="xl">{item.cases7_per_100k_txt}</Heading>
          <Text ml="4px" fontSize="10px" alignSelf="flex-end">
            /100k
          </Text>
        </Box>
        <Box display="flex">
          <Text fontSize="15px" alignSelf="flex-end">
            {item.cases7_lk}
          </Text>
          <Text ml="4px" fontSize="10px" alignSelf="flex-end">
            Fälle/7-Tage
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const App: FunctionComponent = () => {
  const [data, setData] = useState<Array<ICovData>>([]);
  const [fetchFailed, setFetchFailed] = useState<Boolean>(false);
  const [favorites, setFavorites] = useState<Array<ICovData>>([]);
  const [filterString, setFilterString] = useState<string>("");

  const isFavorite = (item: ICovData): boolean => favorites.includes(item);

  useEffect(() => {
    const url: string =
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=OBJECTID,AGS,BEZ,AGS_0,EWZ,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k,cases7_bl,death7_bl,cases7_lk,death7_lk,cases7_per_100k_txt,GEN&returnGeometry=false&outSR=4326&f=json";
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log("Fetched Data!", res);
        setData(
          Object.values(res.features.map((items: any) => items.attributes))
        );
      })
      .catch((error) => {
        setFetchFailed(true);
        console.log("Fetch failed!", error);
      });
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
        data.filter((item) => storedFavoriteCountys.includes(item.county))
      );
    } else {
      console.log("no stored json found!");
    }
  }, [data]);

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

  const compare = (curr: ICovData, prev: ICovData): number => {
    if (curr.county < prev.county) {
      return -1;
    }
    if (curr.county > prev.county) {
      return 1;
    }
    return 0;
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

        <Text color="gray.300">auf 100k Einwohner</Text>
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
      {data.length > 0 ? (
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
              <CardComp
                item={favorite}
                isFavorite={isFavorite(favorite)}
                handleFavoriteClick={() => {
                  updateFavorites(favorite);
                }}
              />
            ))}
          <Box my="1em">
            <Text color="gray.100">Alle Landkreise:</Text>
          </Box>
          {data
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
