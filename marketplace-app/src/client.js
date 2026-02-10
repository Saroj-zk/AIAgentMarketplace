import { createThirdwebClient } from "thirdweb";

// Replace with your actual client ID from https://thirdweb.com/create-api-key
const clientId = "671f0dd3b9382346c44e42e5a64307fc";

export const client = createThirdwebClient({
    clientId: clientId,
});
