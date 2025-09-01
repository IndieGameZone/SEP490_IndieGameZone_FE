import CodeSnippet from "@/components/code-snippet";

const OtherEngines = () => (
  <section>
    <h2 className="mt-10 mb-5 text-3xl font-bold" id="part-5">
      Adapting this pattern to other engines & platforms
    </h2>
    <p>
      The architecture is the same across engines: call the activation API → on
      success, store a device-bound token locally (secure) → check on startup.
    </p>
    <h3 className="font-semibold text-lg mt-4 mb-2">
      Unreal Engine (C++ / Blueprint)
    </h3>
    <ul className="list-disc ps-5">
      <li>
        Make an HTTP PUT to the activation endpoint using{" "}
        <CodeSnippet>FHttpModule</CodeSnippet>.
      </li>
      <li>
        On success save the encrypted key + machine ID using{" "}
        <CodeSnippet>FPlatformMisc::GetDeviceId()</CodeSnippet> and secure file
        storage (or platform keychain).
      </li>
      <li>Use blueprints or C++ to attempt activation and respond to UI.</li>
    </ul>
    <h3 className="font-semibold text-lg mt-4 mb-2">Godot (GDScript)</h3>
    <ul className="list-disc ps-5">
      <li>
        Use <CodeSnippet>HTTPClient</CodeSnippet> or{" "}
        <CodeSnippet>HTTPRequest</CodeSnippet> node to send a PUT.
      </li>
      <li>
        Save encrypted token to <CodeSnippet>user://</CodeSnippet> filesystem
        and retrieve <CodeSnippet>OS.get_unique_id()</CodeSnippet> (or another
        stable identifier) for matching.
      </li>
    </ul>
  </section>
);

export default OtherEngines;
