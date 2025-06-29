import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// ?canceled=true&code=00&id=2fa62c3d38454af69ce3fef6f111536d&cancel=true&status=CANCELLED&orderCode=848172
const HandleTransactionResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      searchParams.get("code") &&
      searchParams.get("id") &&
      searchParams.get("status") &&
      searchParams.get("orderCode")
    ) {
      const transactionType = Cookies.get("pendingTransaction");
      if (transactionType == "deposit") {
        navigate(`/account/wallet-and-transactions`);
        Cookies.set("transactionResult", searchParams.get("status") ?? "", {
          expires: new Date(Date.now() + 30 * 60 * 1000),
        });
      }
    }
  }, []);

  return null;
};

export default HandleTransactionResult;
