import { ComponentType } from "react";

interface UnitySectionProps {
  SampleLicenseManager: ComponentType;
  SampleUiFlow: ComponentType;
}
const UnitySection = ({
  SampleLicenseManager,
  SampleUiFlow,
}: UnitySectionProps) => (
  <section>
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
        — coroutine that calls the status API and resets license if inactive.
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
  </section>
);

export default UnitySection;
