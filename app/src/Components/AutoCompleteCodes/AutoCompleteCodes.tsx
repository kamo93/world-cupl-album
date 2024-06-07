import { useState } from "react";
import { Form, Block, Columns, Icon } from "react-bulma-components";
import styled from "styled-components";
import { ALBUM } from "../../../../share/constants";

const ListContainerStyled = styled(Columns)`
  position: absolute;
  z-index: 10;
`;

const ContainerStyled = styled(Block)`
  position: relative;
`;

const ItemStyled = styled(Block)`
  background-color: white;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
  border-left: 1px solid gray;
  &:first-child {
    border-top: 1px solid gray;
  }
  :hover {
    background-color: gray;
    color: white;
  }
`;

const EmptySearchIconStyled = styled(Icon)`
  &.icon.is-right.has-text-dark {
    pointer-events: all;
    cursor: pointer;
  }
`;

const CODES = Object.keys(ALBUM);

interface AutoCompleteCodesProps {
  onItemSelected: (value: any) => void;
}

// TODO add errase filter button
function AutoCompleteCodes({ onItemSelected }: AutoCompleteCodesProps) {
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const [codes, setCodes] = useState(CODES);

  function shouldShowOption(value: string, label: string): boolean {
    return label.toLowerCase().includes(value.toLowerCase());
  }

  function resultExactMatch(list: string[], str: string) {
    console.log({ list, str });
    return list.length === 1 && list[0].toLowerCase() === str.toLowerCase();
  }

  const handlerInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    const newListCodes = CODES.filter((code) => shouldShowOption(val, code));
    if (resultExactMatch(newListCodes, val)) {
      setShowList(false);
      onItemSelected(val.toUpperCase());
      setSearch(val.toUpperCase());
    } else {
      setSearch(val);
      if (ev.target.value.length >= 1) {
        setShowList(true);
        setCodes(newListCodes);
      } else {
        setShowList(false);
      }
    }
  };

  const handlerItemSelected = (codeSelected: string) => {
    setShowList(false);
    setSearch(codeSelected);
    onItemSelected(codeSelected);
  };

  const handlerRemoveSearch = () => {
    setSearch("");
    onItemSelected("");
  };

  return (
    <ContainerStyled mb={3}>
      <Form.Field>
        <Form.Control className="has-icons-right">
          {search ? (
            <EmptySearchIconStyled
              align="right"
              color="dark"
              onClick={() => {
                handlerRemoveSearch();
              }}
            >
              <i className="fa-solid fa-xmark" />
            </EmptySearchIconStyled>
          ) : null}
          <Form.Input
            type="search"
            placeholder="Busca la mona"
            color="info"
            onChange={handlerInputChange}
            value={search}
          />
        </Form.Control>
      </Form.Field>
      <ListContainerStyled.Column paddingless>
        {showList
          ? codes.map((code) => {
              return (
                <ItemStyled
                  key={code}
                  onClick={() => handlerItemSelected(code)}
                  marginless
                  mobile={{ textAlign: "center", textSize: 4 }}
                >
                  <span>{code}</span>
                </ItemStyled>
              );
            })
          : null}
      </ListContainerStyled.Column>
    </ContainerStyled>
  );
}

export default AutoCompleteCodes;
