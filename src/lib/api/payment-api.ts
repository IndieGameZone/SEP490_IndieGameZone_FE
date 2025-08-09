import { axiosClient } from "./config/axios-client";

export interface ApiResponse {
  error: string | null;
  data: any;
  success: boolean;
}
export const handleApiError = (error: any): ApiResponse => {
  try {
    const errorMessage = error.response?.data.message || error?.message || "An unexpected error occurred.";
    return { error: errorMessage, data: null, success: false };
  } catch (err) {
    return { error: "An unexpected error occurred.", data: null, success: false };
  }
};
export const depositTransaction = async (userId: string, amount: number, description: string): Promise<ApiResponse> => {
  try {
    const response = await axiosClient.post(`/api/users/${userId}/transactions/deposit`, {
      amount,
      description,
    });
    return { error: null, data: response.data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const danateGame = async (
  userId: string,
  amount: number,
  paymentMethod: "Wallet" | "PayOS",
  gameId: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosClient.post(`/api/users/${userId}/games/${gameId}/transactions/donation`, {
      amount,
      paymentMethod,
    });
    return { error: null, data: response.data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getTransactionsPurchase = async (userId: string) => {
  try {
    const params = new URLSearchParams();
    params.append("TransactionTypes", "Deposit");
    params.append("TransactionTypes", "PurchaseGame");
    params.append("TransactionTypes", "Donation");
    params.append("TransactionTypes", "Withdraw");
    params.append("TransactionTypes", "PurchaseCommercialPackage");
    params.append("PageNumber", "1");
    params.append("PageSize", "10");

    const { data } = await axiosClient.get(`/api/users/${userId}/transactions`, {
      params,
    });

    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTransactionsEarning = async (userId: string) => {
  try {
    const params = new URLSearchParams();
    params.append("TransactionTypes", "PurchaseGameRevenue");
    params.append("TransactionTypes", "PurchaseCommercialPackageRevenue");
    params.append("TransactionTypes", "DonationRevenue");
    params.append("PageNumber", "1");
    params.append("PageSize", "10");

    const { data } = await axiosClient.get(`/api/users/${userId}/transactions`, {
      params,
    });

    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type PaymentMethod = "Wallet" | "PayOS";

export const purchaseGame = async (
  userId: string,
  gameId: string,
  amount?: number,
  couponCode?: string,
  paymentMethod?: PaymentMethod
): Promise<ApiResponse> => {
  try {
    const requestBody = {
      CouponCode: couponCode || "",
      Amount: amount,
      PaymentMethod: paymentMethod ?? "Wallet",
    };

    const response = await axiosClient.post(
      `/api/users/${userId}/games/${gameId}/transactions/game-purchasing`,
      requestBody,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { error: null, data: response.data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
type CommercialPaymentMethod = "Wallet" | "PayOS";

export const purchaseCommercialPackage = async (
  userId: string,
  gameId: string,
  commercialPackageId: string,
  startDate: string,
  paymentMethod: CommercialPaymentMethod = "Wallet"
): Promise<ApiResponse> => {
  try {
    const requestBody = {
      startDate,
      paymentMethod,
    };

    const response = await axiosClient.post(
      `/api/users/${userId}/games/${gameId}/commercial-packages/${commercialPackageId}/transactions/commercial-purchasing`,
      requestBody
    );

    return { error: null, data: response.data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getOrderByUserId = async (userId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/orders`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getAllTransactions = async () => {
  try {
    const { data } = await axiosClient.get(`/api/transactions`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
