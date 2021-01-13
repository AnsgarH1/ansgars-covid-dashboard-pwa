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
  Reducer,
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

interface IFavoriteReducerAction {
  type: string;
  payload: ICovData;
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
  const favoritesReducer = (
    favorites: Array<ICovData>,
    action: IFavoriteReducerAction
  ) => {
    switch (action.type) {
      case "addFavorite":
        return [...favorites, action.payload];
      case "removeFavorite":
        const newFavorites = [...favorites];
        const indexOfObject = newFavorites.indexOf(action.payload);
        newFavorites.splice(indexOfObject, 1);
        console.log(newFavorites);
        return newFavorites;
      default:
        throw new Error();
    }
  };

  const [data, setData] = useState<Array<ICovData>>([]);
  const [favorites, dispatchFavorites] = useReducer(favoritesReducer, []);
  const [filterString, setFilterString] = useState<string>("");

  const isFavorite = (item: ICovData) => favorites.includes(item);
  const testDataSet: ICovData = {
    ags: "07131",
    name: "Ahrweiler",
    county: "LK Ahrweiler",
    state: "Rheinland-Pfalz",
    population: 130086,
    cases: 2305,
    deaths: 35,
    casesPerWeek: 175,
    deathsPerWeek: 1,
    stateAbbreviation: "RP",
    recovered: 1859,
    weekIncidence: 134.52639023415279,
    casesPer100k: 1771.9047399412696,
    delta: { cases: 20, deaths: 0, recovered: 40 },
  };

  useEffect(() => {
    fetch("https://api.corona-zahlen.org/districts")
      .then((res) => res.json())

      .then((res) => {
        console.log("Fetched Data!", res);
        setData(Object.values(res.data));
      })
      .catch((error) => console.log("Fetch failed!", error));
  }, []);

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
              handleFavoriteClick={() =>
                dispatchFavorites({
                  type: isFavorite(favorite) ? "removeFavorite" : "addFavorite",
                  payload: favorite,
                })
              }
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
                  dispatchFavorites({
                    type: isFavorite(item) ? "removeFavorite" : "addFavorite",
                    payload: item,
                  });
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
