import { Anchor } from "antd";
import { Link } from "react-router-dom";

const LicenseActivationOverview = () => {
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8 leading-7">
        <h2 className="mb-3 text-3xl font-bold" id="part-1">
          Introduction to Game License
        </h2>
        <p className="mb-3 text-zinc-400">
          {new Date("2025-08-23").toDateString()}
        </p>
        <p>
          To protect your game and make sure only valid players can play after
          purchase, our platform provides a{" "}
          <Link
            className="text-blue-400 hover:underline"
            to={`/docs/api/activate-license`}
          >
            License Activation API
          </Link>
          . This works for any game engine or framework (Unity, Unreal, Godot,
          custom engines, or even browser-based games). It allows you to
          securely verify a player’s activation key with our servers and bind
          that license to their device.
        </p>
        <p className="my-3">With this system:</p>
        <ul className="list-disc ps-5 mb-2">
          <li>
            Players enter their activation key after purchasing your game.
          </li>
          <li>Your game communicates with our API to confirm the key.</li>
          <li>
            Once validated, the key is{" "}
            <strong>securely saved and tied to the player’s device</strong>.
          </li>
          <li>
            Players can keep playing offline without checking the server every
            time.
          </li>
        </ul>
        <p>
          This ensures both strong protection and a smooth player experience.
        </p>

        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-2">
          Getting Your Game ID
        </h2>
        <p>
          Every game on our platform has a unique{" "}
          <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
            gameId
          </code>{" "}
          which you’ll need when calling the License Activation API. To get
          this:
        </p>
        <ol className="list-decimal ps-5 my-3">
          <li>Go to your developer dashboard.</li>
          <li>
            Upload your game (you can start with just a draft—no need to publish
            yet).
          </li>
          <li>
            Once uploaded, the draft entry will display your game’s assigned{" "}
            <strong>Game ID</strong>.
          </li>
          <li>
            Use this Game ID in your API requests when validating activation
            keys.
          </li>
        </ol>
        <p>
          This way you can integrate license checks even before your game is
          fully published.
        </p>

        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-3">
          How It Works (High-Level Flow)
        </h2>
        <ol className="list-decimal ps-5">
          <li>
            <strong>Player enters activation key</strong> inside your game.
          </li>
          <li>
            <strong>Your game sends a request</strong> to the License Activation
            API with:
            <ul className="list-disc ps-5">
              <li className="ql-indent-1">
                Your{" "}
                <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
                  gameId
                </code>
              </li>
              <li className="ql-indent-1">
                The player’s{" "}
                <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
                  activationKey
                </code>
              </li>
            </ul>
          </li>
          <li>
            <strong>Server validates</strong>:
            <ul className="list-disc ps-5">
              <li className="ql-indent-1">
                If the key is valid and unused → success (HTTP 204).
              </li>
              <li className="ql-indent-1">
                If the key is invalid or already activated → error (HTTP 400).
              </li>
            </ul>
          </li>
          <li>
            <strong>On success</strong>, your game should:
            <ul className="list-disc ps-5">
              <li className="ql-indent-1">
                Encrypt and store the key + the machine’s unique ID locally.
              </li>
              <li className="ql-indent-1">
                Mark the license as activated in your local save/config system
                (the exact storage method depends on your tech stack).
              </li>
            </ul>
          </li>
          <li>
            <strong>On next launches</strong>, your game checks the locally
            stored encrypted data to confirm the license, without needing the
            server again.
          </li>
        </ol>

        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-4">
          Best Practices
        </h2>
        <ul className="list-disc ps-5">
          <li>
            <strong>One-time online activation</strong> – no constant server
            checks.
          </li>
          <li>
            <strong>Machine binding</strong> – prevents key sharing by linking
            licenses to devices.
          </li>
          <li>
            <strong>Encryption</strong> – keeps keys and IDs secure.
          </li>
          <li>
            <strong>Easy reset</strong> – clear stored data for testing or
            troubleshooting anytime.
          </li>
        </ul>

        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-5">
          Requirements
        </h2>
        <ul className="list-disc ps-5">
          <li>
            Your game must know its assigned <strong>Game ID</strong> (from your
            draft or published game entry).
          </li>
          <li>
            Players must provide a valid <strong>activation key</strong>.
          </li>
          <li>Internet access is required only for first-time activation.</li>
        </ul>
        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-6">
          Next Steps
        </h2>
        <ul className="list-disc ps-5">
          <Link
            to={`/docs/api/activate-license`}
            className="text-blue-400 hover:underline"
          >
            <li>View game license activation API document</li>
          </Link>
          <Link
            to={`/docs/api/activate-license/example`}
            className="text-blue-400 hover:underline"
          >
            <li>View example code</li>
          </Link>
        </ul>
      </div>
      <div className="col-span-4">
        <div className="sticky top-20">
          <h3 className="font-semibold text-xl mb-3">In this article</h3>
          <Anchor
            affix={false}
            items={[
              {
                key: "part-1",
                href: "#part-1",
                title: "Introduction",
              },
              {
                key: "part-2",
                href: "#part-2",
                title: "Getting Your Game ID",
              },
              {
                key: "part-3",
                href: "#part-3",
                title: "How It Works",
              },
              {
                key: "part-4",
                href: "#part-4",
                title: "Best Practices",
              },
              {
                key: "part-5",
                href: "#part-5",
                title: "Requirements",
              },
              {
                key: "part-6",
                href: "#part-6",
                title: "Next Steps",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default LicenseActivationOverview;
