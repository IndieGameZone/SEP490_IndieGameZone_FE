import CodeBlock from "@/components/code-block";
import SampleLicenseManager from "./sample-license-manager";
import SampleUiFlow from "./sample-ui-flow";
import { Anchor } from "antd";

const IntegrationGuide = () => {
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8 leading-7">
        <h2 className="mb-3 text-3xl font-bold" id="part-1">
          Integrating License Activation into Your Game — Sample Integration &
          Explanation
        </h2>
        <p className="mb-3 text-zinc-400">
          {new Date("2025-08-24").toDateString()}
        </p>
        <p>
          This article walks through a sample license-activation integration
          used by Unity games, explains what each part does, points out security
          and UX considerations, and shows how to adapt the same idea for other
          engines and platforms. The Unity sample (provided below) demonstrates
          a practical, client-driven activation flow that talks to an activation
          API:
        </p>
        <CodeBlock
          className="mt-2"
          language="bash"
          code={`PUT /api/games/{gameId}/activation-keys/{licenseKey}/activation`}
        />
        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-1">
          What this integration does
        </h2>
        <ul className="list-disc ps-5">
          <li>
            Sends the user’s license key to a server endpoint to activate the
            key for the current game and device.
          </li>
          <li>
            If the server accepts the activation, the client stores the license
            key and a machine identifier locally (encrypted) and marks the game
            as activated.
          </li>
          <li>
            On subsequent runs the game checks local storage and validates that
            the saved machine ID matches the current machine ID.
          </li>
          <li>
            Periodically calls the status endpoint to verify that the saved
            license key is still active. If the key is revoked, it resets local
            activation.
          </li>
        </ul>
        <p className="mt-2">
          This approach implements machine-bound license activation — useful for
          single-seat licenses tied to a specific device.
        </p>
        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-2">
          Unity sample — how to use it
        </h2>
        <h3 className="font-semibold text-lg">Example LicenseManager usage</h3>
        <SampleLicenseManager />
        <p className="mt-5">
          Your code exposes a static{" "}
          <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
            LicenseManager
          </code>{" "}
          with three main public pieces:
        </p>
        <ul className="list-disc ps-5">
          <li>
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              IsActivated()
            </code>{" "}
            — checks local activation state
          </li>
          <li>
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              Activate(string inputKey, Action&lt;bool&gt; onResult)
            </code>{" "}
            — coroutine that sends a PUT to the server and invokes{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              onResult(true|false)
            </code>
          </li>
          <li>
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              VerifyLicense(Action&lt;bool&gt; onResult)
            </code>
            — coroutine that calls the status API and resets license if
            inactive.
          </li>
          <li>
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              ResetLicense()
            </code>{" "}
            — clears local activation
          </li>
        </ul>
        <h3 className="font-semibold text-lg mt-8">
          Example MonoBehaviour usage (UI flow)
        </h3>
        <SampleUiFlow />
        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-3">
          Walkthrough of the Unity sample internals
        </h2>

        <p>Here’s what each relevant piece does and why it matters.</p>
        <h4 className="font-semibold text-lg my-2">
          <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
            IsActivated()
          </code>
        </h4>
        <ul className="list-disc ps-5">
          <li>
            Reads{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              Activated
            </code>{" "}
            flag and two PlayerPrefs strings (license + machine id).
          </li>
          <li>
            Decrypts both and compares saved machine ID to{" "}
            <code>SystemInfo.deviceUniqueIdentifier</code>.
          </li>
          <li>
            Returns{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              true
            </code>{" "}
            only if the saved machine matches current device.
          </li>
          <li>
            <strong className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              Why:
            </strong>{" "}
            prevents the same saved key being used on different machines
            silently.
          </li>
        </ul>
        <h4 className="font-semibold text-lg my-2">
          <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
            Activate(...)
          </code>{" "}
          coroutine
        </h4>
        <ul className="list-disc ps-5">
          <li>
            Builds the PUT URL:{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              {`https://&lt;server&gt;/api/games/{gameId}/activation-keys/{inputKey}/activation`}
            </code>
          </li>
          <li>
            Sends an empty PUT with{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              Content-Type: application/json
            </code>
            .
          </li>
          <li>
            If server responds{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              204 No Content
            </code>
            , it:
          </li>
          <ul className="list-disc ps-5">
            <li>
              Encrypts and stores: license key and{" "}
              <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
                SystemInfo.deviceUniqueIdentifier
              </code>{" "}
              in PlayerPrefs.
            </li>
            <li>
              Sets{" "}
              <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
                Activated
              </code>{" "}
              flag to{" "}
              <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
                1
              </code>
              .
            </li>
            <li>
              Invokes{" "}
              <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
                onResult(true)
              </code>
              .
            </li>
          </ul>
          <li>
            For{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              400
            </code>{" "}
            or other errors, logs/warns and invokes{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              onResult(false)
            </code>
            .
          </li>
          <li>
            {" "}
            <strong>Why:</strong> uses server-side authoritative activation.
            Client stores only encrypted copies for offline checks.
          </li>
        </ul>
        <h4 className="font-semibold text-lg my-2">
          <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
            VerifyLicense(...)
          </code>{" "}
          coroutine
        </h4>
        <ul className="list-disc ps-5">
          <li>Builds the GET URL to the status API.</li>
          <li>
            Sends a request and checks if response is
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              "true"
            </code>
            or
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              "false".
            </code>
          </li>
          <li>
            If{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              "false"
            </code>
            , clears local activation (ResetLicense).
          </li>
        </ul>
        <h4 className="font-semibold text-lg my-2">
          <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
            EncryptString
          </code>{" "}
          &amp;{" "}
          <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
            DecryptString
          </code>
        </h4>
        <ul className="list-disc ps-5">
          <li>
            Uses AES with a static key declared in{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              encryptionKey
            </code>
            .
          </li>
          <li>
            Uses an all-zero IV (
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
              new byte[16]
            </code>
            ).
          </li>
          <li>
            <strong>Caution:</strong> This is <em>functional but insecure</em>{" "}
            in production (more below).
          </li>
        </ul>

        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-4">
          Security & design considerations
        </h2>

        <ol className="list-decimal ps-5">
          <li>
            <p>
              <strong>
                Never hard-code symmetric encryption keys in shipped builds.
              </strong>
            </p>
            <ul>
              <li>
                If an attacker extracts the key, they can decrypt or forge
                stored values. Use OS-provided secure storage (Windows DPAPI,
                macOS Keychain, Android Keystore, iOS Keychain) or
                platform-specific encrypted storage libraries.
              </li>
            </ul>
          </li>
          <li>
            <p>
              <strong>Do not use a fixed/zero IV for AES.</strong>
            </p>
            <ul>
              <li>
                The sample uses a zero IV which undermines cipher security
                (identical plaintext yields identical ciphertext). Use a random
                IV per encryption and store the IV alongside the ciphertext.
              </li>
            </ul>
          </li>
          <li>
            <p>
              <strong>
                Prefer authenticated encryption (AES-GCM) or include an HMAC.
              </strong>
            </p>
            <ul>
              <li>Prevents tampering and provides integrity checks.</li>
            </ul>
          </li>
        </ol>

        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-5">
          Adapting this pattern to other engines & platforms
        </h2>
        <p>
          The architecture is the same across engines: call the activation API →
          on success, store a device-bound token locally (secure) → check on
          startup.
        </p>
        <h3 className="font-semibold text-lg mt-4 mb-2">
          Unreal Engine (C++ / Blueprint)
        </h3>
        <ul className="list-disc ps-5">
          <li>
            Make an HTTP PUT to the activation endpoint using{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              FHttpModule
            </code>
            .
          </li>
          <li>
            On success save the encrypted key + machine ID using{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              FPlatformMisc::GetDeviceId()
            </code>{" "}
            and secure file storage (or platform keychain).
          </li>
          <li>
            Use blueprints or C++ to attempt activation and respond to UI.
          </li>
        </ul>
        <h3 className="font-semibold text-lg mt-4 mb-2">Godot (GDScript)</h3>
        <ul className="list-disc ps-5">
          <li>
            Use{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              HTTPClient
            </code>{" "}
            or{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              HTTPRequest
            </code>{" "}
            node to send a PUT.
          </li>
          <li>
            Save encrypted token to{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              user://
            </code>{" "}
            filesystem and retrieve{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              OS.get_unique_id()
            </code>{" "}
            (or another stable identifier) for matching.
          </li>
        </ul>
        <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-6">
          Example improvements you might make
        </h2>
        <ul className="list-disc ps-5">
          <li>
            Replace AES with AES-GCM and store{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">{`{iv}:{ciphertext}:{tag}`}</code>
            .
          </li>
          <li>
            Use an RSA/ECDSA-signed server token: server returns{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              signedToken
            </code>{" "}
            containing{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              deviceId
            </code>
            ,{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              gameId
            </code>
            ,{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              issuedAt
            </code>
            ,{" "}
            <code className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono rounded">
              expiry
            </code>
            . Client verifies signature with server public key and stores token.
          </li>
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
                title: "What this integration does",
              },
              {
                key: "part-2",
                href: "#part-2",
                title: "Unity sample",
              },
              {
                key: "part-3",
                href: "#part-3",
                title: "Walkthrough of the Unity sample internals",
              },
              {
                key: "part-4",
                href: "#part-4",
                title: "Security & design considerations",
              },
              {
                key: "part-5",
                href: "#part-5",
                title: "Adapting to other engines & platforms",
              },
              {
                key: "part-6",
                href: "#part-6",
                title: "Example improvements",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;
