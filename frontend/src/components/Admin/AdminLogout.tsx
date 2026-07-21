import { useEffectOnce, useLocalStorage } from "react-use";
import api from "../../lib/api/apiClient";
import { alertError } from "../../lib/alert";
import { useNavigate } from "react-router";

export default function AdminLogout() {
  const [_, __, removeToken] = useLocalStorage("token", "");
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await api.DELETE("/admin/logout");

    if (error) {
      await alertError((error as any)?.message || "Gagal logout");
    } else {
      removeToken();
      await navigate({
        pathname: "/admin/login",
      });
    }
  }

  useEffectOnce(() => {
    handleLogout().then(() => console.log("Admin berhasil logout"));
  });
  return <></>;
}
