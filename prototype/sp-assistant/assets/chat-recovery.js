export async function runRecoverableChatSubmission({ submit, onPending, onSuccess, onFailure }) {
  let result;
  let pendingMayHaveChanged = false;
  try {
    pendingMayHaveChanged = true;
    await onPending(true);
    const response = await submit();
    if (response?.status !== "AVAILABLE" || typeof response.message !== "string" || !response.message.trim()) {
      throw new Error(response?.message || "malformed chat response");
    }
    await onSuccess(response);
    result = { ok:true, response };
  } catch (error) {
    result = { ok:false, error };
    try {
      await onFailure(error);
    } catch (failureCallbackError) {
      result.failureCallbackError = failureCallbackError;
    }
  } finally {
    if (pendingMayHaveChanged) {
      try {
        await onPending(false);
      } catch (pendingReleaseError) {
        result ??= { ok:false, error:pendingReleaseError };
        result.pendingReleaseError = pendingReleaseError;
      }
    }
  }
  return result;
}
