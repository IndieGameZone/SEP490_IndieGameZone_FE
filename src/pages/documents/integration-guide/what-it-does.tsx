const WhatItDoes = () => (
  <section>
    <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-1">
      What this integration does
    </h2>
    <ul className="list-disc ps-5">
      <li>
        Sends the user's license key to a server endpoint to activate the key
        for the current game and device.
      </li>
      <li>
        If the server accepts the activation, the client stores the license key
        and a machine identifier locally (encrypted) and marks the game as
        activated.
      </li>
      <li>
        On subsequent runs the game checks local storage and validates that the
        saved machine ID matches the current machine ID.
      </li>
      <li>
        Periodically calls the status endpoint to verify that the saved license
        key is still active. If the key is revoked, it resets local activation.
      </li>
    </ul>
    <p className="mt-2">
      This approach implements machine-bound license activation — useful for
      single-seat licenses tied to a specific device.
    </p>
  </section>
);

export default WhatItDoes;
