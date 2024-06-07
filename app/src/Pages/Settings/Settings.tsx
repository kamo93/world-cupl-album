import { useState } from "react";
import { Heading } from "react-bulma-components";
import useSWRImmutable from "swr/immutable";
import useSWRMutate from "swr/mutation";
import PageLoader from "../../Components/PageLoader/PageLoader";
import { useAlbumStore } from "../../Stores/Album";
import { User, useUserStore } from "../../Stores/User";
import customFetch from "../../customFetch";
import ChangeAlbumModal from "./ChangeAlbumModal";
import {
  AlbumItemStyled,
  AlbumsContainerStyled,
  ContainerStyled,
  EmailContainerStyled,
} from "./StyledComponents";
import ShowSelected from "./ShowSelected";

interface GetAlbumsByEmail {
  id: string;
  name: string;
  selected: boolean;
}

async function fetcher(url: string) {
  return await customFetch.get<{ data: GetAlbumsByEmail[] | null }>({ url });
}

async function fetcherUser(url: string) {
  return await customFetch.get<{ data: string[] | null }>({ url });
}

async function updateAlbumSelected(
  url: string,
  {
    arg: { albumIdSelected, userEmail },
  }: { arg: { albumIdSelected: string; userEmail: string } },
) {
  return await customFetch.put<{ data: any }>({
    url: `${url}/${albumIdSelected}`,
    body: { userEmail },
  });
}

function Settings() {
  const albumId = useAlbumStore((state) => state.id);
  const setIdAlbum = useAlbumStore((state) => state.setIdAlbum);
  const name = useAlbumStore((state) => state.name);
  const { trigger, isMutating } = useSWRMutate(
    "/api/albums",
    updateAlbumSelected,
  );
  const [showModal, setShowModal] = useState(false);
  const [albumIdSelected, setAlbumIdSelected] = useState("");
  console.count("settings");
  const user = useUserStore((state) => state.user);
  // TODO error not used err fix this manage some how the error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    data: responseAlbum,
    isLoading,
    error,
    mutate,
  } = useSWRImmutable(`/api/albums/user/${(user as User).email}`, fetcher, {
    fallback: <div>....hola cargando</div>,
  });
  const {
    data: responseUser,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useSWRImmutable(`/api/users/album/${albumId as string}`, fetcherUser);
  console.log("api/usesr/albums", { responseUser, isLoadingUser, errorUser });

  const openChangeAlbumSelectedModal = (id: string, selected: boolean) => {
    if (!selected) {
      setShowModal(true);
      setAlbumIdSelected(id);
    }
  };

  const setAlbumSelected = async (albumIdSelected: string): Promise<void> => {
    try {
      const { data } = await trigger({
        userEmail: (user as User).email,
        albumIdSelected,
      });
      console.log("data", data);
      if (data) {
        setShowModal(false);
        console.log();
        const mutateData = responseAlbum.data.map(({ name, id }) => ({
          name,
          id,
          selected: id === albumIdSelected,
        }));
        await mutate({ data: mutateData }, { revalidate: false });
        setIdAlbum(albumIdSelected);
        // await userMutate()
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading || isLoadingUser) {
    return <PageLoader />;
  }

  if (
    typeof responseUser !== "undefined" &&
    typeof responseAlbum !== "undefined"
  ) {
    const { data: albumData } = responseAlbum;
    const { data: userData } = responseUser;
    return (
      <>
        <ChangeAlbumModal
          openModal={showModal}
          album={{ name: name as string, id: albumIdSelected }}
          handleOnClose={() => setShowModal(false)}
          handleSelectNewAlbum={setAlbumSelected}
          isLoading={isMutating}
        />
        <ContainerStyled>
          <AlbumsContainerStyled>
            <Heading renderAs="h3" size={5}>
              Otros albums que estas completando:
            </Heading>
            <ul>
              {albumData != null
                ? albumData.map(({ name, id, selected }) => {
                    return (
                      <AlbumItemStyled
                        key={id}
                        className={`${selected ? "selected" : ""}`}
                        onClick={() =>
                          openChangeAlbumSelectedModal(id, selected)
                        }
                      >
                        <div>{name}</div>
                        <ShowSelected selected={selected} />
                      </AlbumItemStyled>
                    );
                  })
                : null}
            </ul>
          </AlbumsContainerStyled>
          <EmailContainerStyled>
            <Heading renderAs="h3" size={5}>
              Este album lo estas completando con:
            </Heading>
            <ul>
              {userData !== null
                ? userData.map((email) => {
                    return <li key={email}>{email}</li>;
                  })
                : null}
            </ul>
          </EmailContainerStyled>
        </ContainerStyled>
      </>
    );
  }

  return null;
}

export default Settings;
