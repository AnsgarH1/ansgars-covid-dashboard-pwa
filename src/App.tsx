import { StarIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, {
  FunctionComponent,
  useEffect,
  useReducer,
  useState,
} from "react";

interface ICovData {
  cases: number;
  deaths: number;
  ags: string;
  county: string;
  state: string;
  population: number;
  name: string;
  casesPerWeek: number;
  deathsPerWeek: number;
  recovered: number;
  weekIncidence: number;
  casesPer100k: number;
  stateAbbreviation: string;
  delta: {
    cases: number;
    deaths: number;
    recovered: number;
  };
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
      key={item.ags}
      background={Math.round(item.weekIncidence) >= 200 ? "#ff1f1f" : "white"}
      m="3px"
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
      <Box>
        <Box display="flex">
          <Icon
            as={StarIcon}
            color={isFavorite ? "#bfbf02" : "#8f8f8f"}
            w="13px"
            mr="8px"
            onClick={handleFavoriteClick}
          />
          <Heading fontSize="l">{item.county}:</Heading>
        </Box>
        <Text>{item.state}</Text>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
      >
        <Heading fontSize="l">{Math.round(item.weekIncidence)}</Heading>
        <Box display="flex" alignItems="center" justifyContent="center" w="3em">
          <Icon
            as={item.delta.cases > 0 ? TriangleUpIcon : TriangleDownIcon}
            w="13px"
            mr="2px"
          />
          <Text fontSize="sm">{item.delta.cases} </Text>
        </Box>
      </Box>
    </Box>
  );
};

const App: FunctionComponent = () => {
  const [data, setData] = useState<Array<ICovData>>([]);
  const [favorites, setFavorites] = useState<Array<ICovData>>([]);
  const [filterString, setFilterString] = useState<string>("");

  const isFavorite = (item: ICovData): boolean => favorites.includes(item);

  useEffect(() => {
    fetch("https://api.corona-zahlen.org/districts")
      .then((res) => res.json())

      .then((res) => {
        console.log("Fetched Data!", res);
        setData(Object.values(res.data));
      })
      .catch((error) => console.log("Fetch failed!", error));
  }, []);

  useEffect(() => {
    const storedFavoritesJSON = localStorage.getItem("favorites");
    if (storedFavoritesJSON) {
      const storedFavorites: Array<ICovData> = JSON.parse(storedFavoritesJSON);
      setFavorites(storedFavorites);
    } else {
      console.log("no stored json found!");
    }
  }, []);
  useEffect(() => {
    const saveToLocalStorage = async () => {
      localStorage.setItem("favorites", JSON.stringify(favorites));
      console.log("saved Favorites to localStorage!");
    };
    saveToLocalStorage();
  }, [favorites]);
  const compare = (curr: ICovData, prev: ICovData): number => {
    if (curr.name < prev.name) {
      return -1;
    }
    if (curr.name > prev.name) {
      return 1;
    }
    return 0;
  };

  return (
    <Flex
      direction="column"
      w="100vw"
      h="100vh"
      bgGradient="linear(to-b,#686973 ,#474a7a, #143642  20%)"
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

      {data.length > 0 ? (
        <Box overflowY="scroll" overflowX="unset" mt="1rem" w="90vw">
          <Box my="1em">
            <Text color="gray.100">Favoriten:</Text>
          </Box>
          {favorites.map((favorite) => (
            <CardComp
              item={favorite}
              isFavorite={isFavorite(favorite)}
              handleFavoriteClick={() => {
                if (isFavorite(favorite)) {
                  const newFavorites = [...favorites];
                  const indexOfObject = newFavorites.indexOf(favorite);
                  newFavorites.splice(indexOfObject, 1);
                  setFavorites(newFavorites);
                } else {
                  setFavorites([...favorites, favorite]);
                }
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
                handleFavoriteClick={() => {
                  if (isFavorite(item)) {
                    const newFavorites = [...favorites];
                    const indexOfObject = newFavorites.indexOf(item);
                    newFavorites.splice(indexOfObject, 1);
                    console.log(newFavorites);
                    setFavorites(newFavorites);
                  } else {
                    setFavorites([...favorites, item]);
                  }
                }}
              />
            ))}
        </Box>
      ) : (
        <Box flex="1" justify="center">
          <Spinner color="white" />
        </Box>
      )}
    </Flex>
  );
};

export default App;

/**
 * 
 * {Object.entries(data)
                .filter((item) => {
                  return true;
                })
                .map((item) => (
                  <CardComp
                    item={item}
                    favorites={favorites}
                    onStarClick={onStarClick}
                  />
                ))}
 */

/**
  * 
  * 
  *  {Object.entries(data.data)
            .sort(compare)
            .filter(
              (item) =>
                filterString.length < 1 ||
                item[1].county
                  .toLowerCase()
                  .includes(filterString.toLowerCase())
            )
            .map((item) => (
              <CardComp
                item={item}
                favorites={favorites}
                onStarClick={onStarClick}
              />
            ))}
  */
