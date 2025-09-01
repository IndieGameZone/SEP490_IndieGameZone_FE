import CodeSnippet from "@/components/code-snippet";

const Improvements = () => (
  <section>
    <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-6">
      Example improvements you might make
    </h2>
    <ul className="list-disc ps-5">
      <li>
        Replace AES with AES-GCM and store{" "}
        <CodeSnippet>{`{iv}:{ciphertext}:{tag}`}</CodeSnippet>.
      </li>
      <li>
        Use an RSA/ECDSA-signed server token: server returns{" "}
        <CodeSnippet>signedToken</CodeSnippet> containing{" "}
        <CodeSnippet>deviceId</CodeSnippet>, <CodeSnippet>gameId</CodeSnippet>,{" "}
        <CodeSnippet>issuedAt</CodeSnippet>, <CodeSnippet>expiry</CodeSnippet>.
        Client verifies signature with server public key and stores token.
      </li>
    </ul>
  </section>
);

export default Improvements;
