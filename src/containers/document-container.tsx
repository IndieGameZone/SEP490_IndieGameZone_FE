import ApiDocumentLayout from "@/layouts/api-documents-layout";
import HomeLayout from "@/layouts/home-layout";
import ActivateLicenseEndpointDocs from "@/pages/documents/api-docs/activate-license-endpoint-docs";
import LicenseStatusEndpointDocs from "@/pages/documents/api-docs/license-status-endpoint-docs";
import IntegrationGuide from "@/pages/documents/integration-guide/integration-guide";
import LicenseActivationOverview from "@/pages/documents/license-activation-overview";
import NotFoundPage from "@/pages/errors/not-found-page";
import { Route, Routes } from "react-router-dom";

const ApiDocumentContainer = () => {
  return (
    <ApiDocumentLayout>
      <Routes>
        <Route path="/overview" element={<LicenseActivationOverview />} />
        <Route
          path="/activate-license"
          element={<ActivateLicenseEndpointDocs />}
        />
        <Route path="/license-status" element={<LicenseStatusEndpointDocs />} />
        <Route path="/integration-guide" element={<IntegrationGuide />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </ApiDocumentLayout>
  );
};
const DocumentContainer = () => {
  return (
    <HomeLayout>
      <Routes>
        <Route path="/api/*" element={<ApiDocumentContainer />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </HomeLayout>
  );
};

export default DocumentContainer;
