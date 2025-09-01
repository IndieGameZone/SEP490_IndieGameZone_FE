import CodeBlock from "@/components/code-block";
import ArticleHeader from "./article-header";
import WhatItDoes from "./what-it-does";
import UnitySection from "./unity-section";
import SampleLicenseManager from "../sample-license-manager";
import SampleUiFlow from "../sample-ui-flow";
import InternalsWalkthrough from "./internals-walkthough";
import SecurityConsiderations from "./security-considerations";
import OtherEngines from "./other-engines";
import Improvements from "./improvement";
import TableOfContents from "./table-of-contents";

const IntegrationGuide = () => {
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8 leading-7">
        <ArticleHeader />
        <CodeBlock
          className="mt-2"
          language="bash"
          code={`PUT /api/games/{gameId}/activation-keys/{licenseKey}/activation`}
        />
        <WhatItDoes />
        <UnitySection
          SampleLicenseManager={SampleLicenseManager}
          SampleUiFlow={SampleUiFlow}
        />
        <InternalsWalkthrough />
        <SecurityConsiderations />
        <OtherEngines />
        <Improvements />
      </div>
      <TableOfContents />
    </div>
  );
};

export default IntegrationGuide;
