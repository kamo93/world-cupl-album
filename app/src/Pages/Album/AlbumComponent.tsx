import { Heading, Level } from "react-bulma-components";
import Figure from "../../Figure";
import { Album } from "../../Stores/Album";
import {
  AlbumContatinerStyled,
  InnerSectionStyled,
  SectionStyled,
} from "./StyledComponents";

interface AlbumComponentProps {
  albumList: Album | null;
  increaseOneOnRepeatSticker: (
    code: string,
    value: string,
    isSubtractMode: boolean,
  ) => void;
  isSubtractMode: boolean;
}

function AlbumComponent({
  albumList,
  increaseOneOnRepeatSticker,
  isSubtractMode,
}: AlbumComponentProps) {
  return (
    <AlbumContatinerStyled>
      {albumList !== null
        ? Object.keys(albumList).map((code) => {
            if (albumList[code].figures.length === 0) return null;
            return (
              <SectionStyled key={code}>
                <Level.Item mt={3} mb={1}>
                  <Heading>{code}</Heading>
                </Level.Item>
                <InnerSectionStyled justifyContent="center">
                  {albumList[code].figures.map(
                    ({ value, repeat, isImportant }) => {
                      return (
                        <Figure
                          key={`${code}-${value}`}
                          albumNumber={value}
                          timesRepeat={repeat}
                          isImportant={isImportant}
                          onClick={() => {
                            increaseOneOnRepeatSticker(
                              code,
                              value,
                              isSubtractMode,
                            );
                          }}
                        />
                      );
                    },
                  )}
                </InnerSectionStyled>
              </SectionStyled>
            );
          })
        : null}
    </AlbumContatinerStyled>
  );
}

export default AlbumComponent;
