import CodeSnippet from "@/components/code-snippet";

const InternalsWalkthrough = () => (
  <section>
    <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-3">
      Walkthrough of the Unity sample internals
    </h2>
    <p>Here's what each relevant piece does and why it matters.</p>

    <h4 className="font-semibold text-lg my-2">
      <CodeSnippet>IsActivated()</CodeSnippet>
    </h4>
    <ul className="list-disc ps-5">
      <li>
        Reads <CodeSnippet>Activated</CodeSnippet> flag and two PlayerPrefs
        strings (license + machine id).
      </li>
      <li>
        Decrypts both and compares saved machine ID to{" "}
        <code>SystemInfo.deviceUniqueIdentifier</code>.
      </li>
      <li>
        Returns <CodeSnippet>true</CodeSnippet> only if the saved machine
        matches current device.
      </li>
      <li>
        <strong className="px-1 py-0.5 bg-zinc-800 text-pink-600 font-mono text-sm rounded">
          Why:
        </strong>{" "}
        prevents the same saved key being used on different machines silently.
      </li>
    </ul>

    <h4 className="font-semibold text-lg my-2">
      <CodeSnippet>Activate(...)</CodeSnippet> coroutine
    </h4>
    <ul className="list-disc ps-5">
      <li>
        Builds the PUT URL:{" "}
        <CodeSnippet>
          {`https://&lt;server&gt;/api/games/{gameId}/activation-keys/{inputKey}/activation`}
        </CodeSnippet>
      </li>
      <li>
        Sends an empty PUT with{" "}
        <CodeSnippet>Content-Type: application/json</CodeSnippet>.
      </li>
      <li>
        If server responds <CodeSnippet>204 No Content</CodeSnippet>, it:
      </li>
      <ul className="list-disc ps-5">
        <li>
          Encrypts and stores: license key and{" "}
          <CodeSnippet>SystemInfo.deviceUniqueIdentifier</CodeSnippet> in
          PlayerPrefs.
        </li>
        <li>
          Sets <CodeSnippet>Activated</CodeSnippet> flag to{" "}
          <CodeSnippet>1</CodeSnippet>.
        </li>
        <li>
          Invokes <CodeSnippet>onResult(true)</CodeSnippet>.
        </li>
      </ul>
      <li>
        For <CodeSnippet>400</CodeSnippet> or other errors, logs/warns and
        invokes <CodeSnippet>onResult(false)</CodeSnippet>.
      </li>
      <li>
        <strong>Why:</strong> uses server-side authoritative activation. Client
        stores only encrypted copies for offline checks.
      </li>
    </ul>

    <h4 className="font-semibold text-lg my-2">
      <CodeSnippet>VerifyLicense(...)</CodeSnippet> coroutine
    </h4>
    <ul className="list-disc ps-5">
      <li>Builds the GET URL to the status API.</li>
      <li>
        Sends a request and checks if response is
        <CodeSnippet>"true"</CodeSnippet> or <CodeSnippet>"false"</CodeSnippet>.
      </li>
      <li>
        If <CodeSnippet>"false"</CodeSnippet>, clears local activation
        (ResetLicense).
      </li>
    </ul>

    <h4 className="font-semibold text-lg my-2">
      <CodeSnippet>EncryptString</CodeSnippet> &amp;{" "}
      <CodeSnippet>DecryptString</CodeSnippet>
    </h4>
    <ul className="list-disc ps-5">
      <li>
        Uses AES with a static key declared in{" "}
        <CodeSnippet>encryptionKey</CodeSnippet>.
      </li>
      <li>
        Uses an all-zero IV (<CodeSnippet>new byte[16]</CodeSnippet>).
      </li>
      <li>
        <strong>Caution:</strong> This is <em>functional but insecure</em> in
        production (more below).
      </li>
    </ul>
  </section>
);

export default InternalsWalkthrough;
