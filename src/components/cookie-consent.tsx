import { Button } from "antd";
import { useEffect, useState } from "react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  // Check if the user has already given consent
  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setShowConsent(true);
    }
  }, []);

  // Handle the user's response to the consent request
  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowConsent(false);
  };

  return (
    showConsent && (
      <div className="fixed bottom-5 right-5 w-[500px] bg-zinc-800 text-white p-4 flex justify-between items-end z-50 rounded border border-zinc-600">
        <div className="flex-1">
          <p className="text-xl font-bold">We use cookies</p>
          <p className="text-sm">
            We use cookies to improve your experience on our site. By using our
            site, you consent to our use of cookies.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleAccept} type="primary">
            Accept
          </Button>
          <Button onClick={handleDecline}>Decline</Button>
        </div>
      </div>
    )
  );
};

export default CookieConsent;
