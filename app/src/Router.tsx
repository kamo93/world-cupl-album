import { useEffect } from "react";
import "bulma/css/bulma.min.css";

import Login from "./Pages/Login/Login";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useSupabaseContext } from "./Contexts/SupabaseContext";
import SelectOrCreateAlbum from "./Pages/SelectOrCreateAlbum/SelectOrCreateAlbum";
import { useUserStore } from "./Stores/User";
import { Album, useAlbumStore } from "./Stores/Album";

import AlbumPage from "./Pages/Album/Album";
import { AuthChangeEvent } from "@supabase/supabase-js";
import Cover from "./Pages/Cover/Cover";
import WithMenuBar from "./Layouts/WithMenuBar";
import Stats from "./Pages/Stats/Stats";
import Settings from "./Pages/Settings/Settings";
import customFetch, { CustomFetchError } from "./customFetch";
import useSWRMutation from "swr/mutation";
import MenuBarLayout from "./Layouts/WithMenuBar";

interface User {
  email: string;
  avatar: string;
}

function ProtectRoute(): JSX.Element {
  const { user } = useUserStore((state) => state);

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (user === "idle") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

const validAuthEvents: AuthChangeEvent[] = ["SIGNED_IN", "TOKEN_REFRESHED"];

interface AlbumApiResponse {
  id: string;
  stickers: Album;
}

interface InsertUserApiResponse {
  data: {
    avatar: string;
    email: string;
  };
}

async function fetcher(url: string, { arg: userEmail }: { arg: string }) {
  return await customFetch.get<{ data: AlbumApiResponse | null }>({
    url: `${url}?selected=true&userEmail=${userEmail}`,
  });
}

function Router(): JSX.Element {
  const { supabase } = useSupabaseContext();
  const { trigger } = useSWRMutation("/api/album", fetcher, {
    populateCache: true,
  });
  const { addUser } = useUserStore((state) => state);
  const navigate = useNavigate();
  const { setAlbum, setIdAlbum } = useAlbumStore((state) => state);

  async function userHaveAlbum(user: User): Promise<void> {
    try {
      const { data } = await trigger(user.email);
      if (data !== null) {
        setAlbum(data.stickers);
        setIdAlbum(data.id);
        navigate("/protected/user/album");
      } else {
        navigate("/protected/select-album");
      }
    } catch (e) {
      if ((e as CustomFetchError).statusCode === 404) {
        navigate("/protected/select-album");
      }
      console.warn(e);
    }
    // }
  }

  async function getUserSession(): Promise<void> {
    const { error } = await supabase.auth.refreshSession();
    if (error != null) {
      navigate("/login");
      // TODO add logger instead
      // throw new Error("Error refreshSession");
    }
  }

  useEffect(() => {
    void getUserSession();
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (event, session) => {
        if (validAuthEvents.includes(event)) {
          if (session !== null) {
            const user = {
              email: session.user.user_metadata.email,
              avatar: session.user.user_metadata.avatar_url,
            };
            const { data } = await customFetch.post<InsertUserApiResponse>({
              url: "/api/user",
              body: { ...user },
            });
            if (data !== null) {
              console.log("new user do something TODO");
            }
            addUser(data);
            await userHaveAlbum(data);
          }
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/protected" element={<ProtectRoute />}>
        <Route
          path="/protected/select-album"
          element={<SelectOrCreateAlbum />}
        />
        <Route path="/protected/user" element={<MenuBarLayout />}>
          <Route path="/protected/user/album" element={<AlbumPage />} />
          <Route path="/protected/user/stats" element={<Stats />} />
          <Route path="/protected/user/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<Cover />} />
    </Routes>
  );
}

export default Router;
