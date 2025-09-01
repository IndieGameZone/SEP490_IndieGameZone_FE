const SecurityConsiderations = () => (
  <section>
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
            If an attacker extracts the key, they can decrypt or forge stored
            values. Use OS-provided secure storage (Windows DPAPI, macOS
            Keychain, Android Keystore, iOS Keychain) or platform-specific
            encrypted storage libraries.
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
            (identical plaintext yields identical ciphertext). Use a random IV
            per encryption and store the IV alongside the ciphertext.
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
  </section>
);

export default SecurityConsiderations;
