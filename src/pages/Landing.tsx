import React, { useEffect, useState } from "react";

import { SearchIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  Select,
} from "@chakra-ui/react";

import { ICovData } from "../types/ICovData";
import { ICovHistoryData } from "../types/ICovHistoryData";
import { compare } from "../utility/compareICovData";
import CardComp from "../components/CardComp";
import Layout from "../components/Layout";

function LandingPage() {
  const [rkiData, setRkiData] = useState<Array<ICovData>>([]);
  const [history, setHistory] = useState<Array<ICovHistoryData>>([]);
  const [fetchFailed, setFetchFailed] = useState<Boolean>(false);
  const [historyFetchFailed, setHistoryFetchFailed] = useState<Boolean>(false);
  const [favorites, setFavorites] = useState<Array<ICovData>>([]);
  const [filterString, setFilterString] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<
    "County" | "Highest" | "Lowest"
  >("County");

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
      .catch((err) => {
        console.log("covid-daten-api-fehler:", err);
        setHistoryFetchFailed(true);
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
      setFilterString("");
      const newFavorites = [...favorites, item];
      setFavorites(newFavorites);
      saveFavoritesToLocalStorage(newFavorites);
    }
  };

  //Load from Favorites
  useEffect(() => {
    const storedFavoritesJSON = localStorage.getItem("favorites");
    if (storedFavoritesJSON) {
      const storedFavoriteCountys: Array<string> =
        JSON.parse(storedFavoritesJSON);
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
    <Layout title="Corona-Fallzahlen">
      <Box pt="1rem">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            focusBorderColor="#1d427d"
            textColor="grey.100"
            colorScheme="grey.100"
            type="text"
            placeholder="Landkreis suchen"
            onChange={(event) => setFilterString(event.target.value)}
            value={filterString}
            style={{ color: "white" }}
          />
        </InputGroup>
      </Box>
      {rkiData.length > 0 ? (
        <Box overflowX="unset" mt="1rem">
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
                  historyLoadFailed={historyFetchFailed}
                />
              </Box>
            ))}
          <Box my="1em">
            <Text color="gray.100">Alle Landkreise:</Text>
          </Box>
          <InputGroup>
            <Select
              backgroundColor="white"
              placeholder="Sortieren nach:"
              size="sm"
              onChange={(event) => {
                switch (event.target.value) {
                  case "Landkreis alphabetisch":
                    setFilterCategory("County");
                    break;
                  case "Nach Inzidenz aufsteigend":
                    setFilterCategory("Highest");
                    break;
                  case "Nach Inzidenz absteigend":
                    setFilterCategory("Lowest");
                    break;
                  default:
                    break;
                }
              }}
            >
              <option>Landkreis alphabetisch</option>
              <option>Nach Inzidenz aufsteigend</option>
              <option> Nach Inzidenz absteigend</option>
            </Select>
          </InputGroup>
          {rkiData
            .sort((a, b) => compare(a, b, filterCategory))
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
                historyLoadFailed={historyFetchFailed}
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
    </Layout>
  );
}

export default LandingPage;
