import { redirect } from "next/navigation";

/** Profile notifications list now lives at the dedicated Notifications Center. */
export default function ProfileNotificationsRedirect() {
  redirect("/notifications");
}
