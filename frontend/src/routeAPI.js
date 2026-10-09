const API_BASE_URL = "http://127.0.0.1:8000";

export async function generateQuotation(quotationRequest) {
  const response = await fetch(
    `${API_BASE_URL}/api/quotation/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quotationRequest),
    }
  );

  if (!response.ok) {
    let message = `Quotation API failed: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      // Keep the default error message
    }

    throw new Error(message);
  }

  return await response.json();
}