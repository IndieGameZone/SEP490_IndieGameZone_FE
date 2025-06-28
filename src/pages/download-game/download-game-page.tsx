import { Navigate, useParams } from "react-router-dom";

const DownloadGamePage = () => {
  const { gameId } = useParams();
  if (!gameId) {
    return <Navigate to={"/"} />;
  }
  return (
    <div>
      Thanks for downloading City of Voices (demo) by Kini. You can find more
      from the same creator on their page: Kini.
      <br />
      The download should start momentarily. If it doesn't, check your popup
      blocker.
    </div>
  );
};

export default DownloadGamePage;
