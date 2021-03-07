import { Line } from "@reactchartjs/react-chart.js";
import { Box, Heading, Icon, Spinner, Text } from "@chakra-ui/react";
import { ICovData } from "../types/ICovData";
import { ICovHistorie, ICovHistoryData } from "../types/ICovHistoryData";
import { StarIcon } from "@chakra-ui/icons";
import { convertTimesStampToDateString } from "../utility/timeStampToString";

interface ICardCompProps {
  item: ICovData;
  isFavorite: boolean;
  handleFavoriteClick: () => void;
  history: Array<ICovHistoryData>;
  enableHistory: Boolean;
}

const HISTORY_SIZE: Number = 14;

function CardComp({
  item,
  isFavorite,
  handleFavoriteClick,
  history,
  enableHistory,
}: ICardCompProps) {
  let cardHistory: Array<ICovHistorie> = [];
  if (enableHistory && history.length > 0) {
    console.log(
      "Historie of " + item.GEN,
      item,
      history.filter((county) => county.name === item.GEN)
    );
    cardHistory = history
      .filter((county) => county.name === item.GEN)[0]
      .history.slice(-HISTORY_SIZE);
  }

  return (
    <Box
      key={item.OBJECTID}
      background={Math.round(item.cases7_per_100k) >= 200 ? "#e95d69" : "white"}
      borderRadius="5px"
      color="gray.600"
      display="flex"
      flexDir="column"
      m="6px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        fontWeight="semibold"
        letterSpacing="wide"
        ml="2"
        px="12px"
        py="12px"
      >
        {/** Left Box */}
        <Box maxWidth="70%">
          {/** Box with County Type and Star-Icon */}
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
          {/** Box with County Name and Date */}
          <Box>
            <Heading fontSize="xl">{item.GEN}</Heading>
            <Text fontSize="12px">{item.last_update}</Text>
          </Box>
        </Box>
        {/** Right Box */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          justifyContent="space-around"
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
              abs. Fälle/7-Tage
            </Text>
          </Box>
        </Box>
      </Box>
      {enableHistory && (
        <Box>
          {history?.length > 0 ? (
            <Box width="100%" m="0" px="0.5rem" pb="0.5rem">
              <Box height="6rem">
                <Line
                  type="line"
                  data={{
                    labels: [
                      ...cardHistory.map((dateData) =>
                        convertTimesStampToDateString(dateData.date)
                      ),
                    ],
                    datasets: [
                      {
                        data: [
                          ...cardHistory.map(
                            (dateData) => dateData.weekIncidence
                          ),
                        ],
                        fill: false,
                        backgroundColor: getColorByHistory(cardHistory),
                        pointRadius: "4",
                      },
                    ],
                  }}
                  options={{
                    legend: {
                      display: false,
                    },
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            autoSkip: true,
                            maxTicksLimit: 4,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10,
                          },
                        },
                      ],
                    },
                    tooltips: {
                      enabled: false,
                    },
                  }}
                  width={0.3}
                  height={0.1}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-evenly"
                fontWeight="bold"
                fontSize="xs"
              >
                <Box
                  backgroundColor="#099c11"
                  borderRadius="3.5rem"
                  width="6rem"
                  p="2px"
                  textAlign="center"
                >
                  <Text color="gray.100">Inzidenz &lt; 50 </Text>
                </Box>
                <Box
                  backgroundColor="#e3e30e"
                  borderRadius="3.5rem"
                  width="6rem"
                  p="2px"
                  textAlign="center"
                >
                  <Text color="gray.750"> Inzidenz &gt; 50 </Text>
                </Box>
                <Box
                  backgroundColor="#c21f1f"
                  borderRadius="3.5rem"
                  width="6rem"
                  p="2px"
                  textAlign="center"
                >
                  <Text color="gray.100">Inzidenz &gt; 100 </Text>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box display="flex" p="0.5rem" w="100%" justifyContent="center">
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
              >
                <Spinner color="pink" />
                <Text mr="1rem">Lade Historie..</Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default CardComp;

function getColorByHistory(cardHistory: ICovHistorie[]): Array<String> {
  return cardHistory.map((histItem) => {
    if (histItem.weekIncidence >= 100) {
      return "#c21f1f";
    }
    if (histItem.weekIncidence >= 50) {
      return "#e3e30e";
    }
    return "#099c11";
  });
}
