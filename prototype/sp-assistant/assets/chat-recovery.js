export async function runRecoverableChatSubmission({ submit, onPending, onSuccess, onFailure }) {
  onPending(true);
  try {
    const response = await submit();
    if (response?.status !== "AVAILABLE" || typeof response.message !== "string" || !response.message.trim()) {
      throw new Error(response?.message || "malformed chat response");
    }
    await onSuccess(response);
    return { ok:true, response };
  } catch (error) {
    await onFailure(error);
    return { ok:false, error };
  } finally {
    onPending(false);
  }
}
