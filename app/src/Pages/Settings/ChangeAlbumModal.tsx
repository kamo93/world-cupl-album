import { Button, Modal } from "react-bulma-components";
import styled from "styled-components";

const StyledModal = styled(Modal)`
  padding: 0 12px;
`;

interface ChangeAlbumModalProps {
  openModal: boolean;
  album: { name: string; id: string };
  handleSelectNewAlbum: (id: string) => Promise<void>;
  handleOnClose: () => void;
  isLoading: boolean;
}

function ChangeAlbumModal({
  openModal,
  album,
  handleSelectNewAlbum,
  handleOnClose,
  isLoading,
}: ChangeAlbumModalProps): JSX.Element {
  function handleAceptButton(): void {
    handleSelectNewAlbum(album.id);
  }

  return (
    <StyledModal
      show={openModal}
      onClose={handleOnClose}
      showClose={false}
      closeOnEsc={!isLoading}
    >
      <Modal.Card mx={5}>
        <Modal.Card.Header showClose={!isLoading}>
          <Modal.Card.Title>Cambiar de album</Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <p>Deseas cambiar al album {album.name}?</p>
        </Modal.Card.Body>
        <Modal.Card.Footer justifyContent="flex-end">
          <Button color="info" disabled={isLoading} onClick={handleOnClose}>
            Cancelar
          </Button>
          <Button
            color="success"
            loading={isLoading}
            onClick={handleAceptButton}
          >
            Aceptar
          </Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </StyledModal>
  );
}

export default ChangeAlbumModal;
