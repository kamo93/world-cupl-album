import styled from "styled-components";
import LogoWorldCup from "../../Components/LogoWorldCup/LogoWorldCup";

const ContainerCoverStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

function Cover(): JSX.Element {
  return (
    <ContainerCoverStyled>
      <LogoWorldCup />
    </ContainerCoverStyled>
  );
}

export default Cover;
