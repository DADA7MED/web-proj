const API_URL = "api/wishlist.php";

async function sendRequest(url, options = {}) {
    let response;

    try {
        response = await fetch(url, {
            credentials: "same-origin",
            ...options
        });
    } catch (error) {
        throw new Error(
            "Cannot connect to the server. Make sure XAMPP is running."
        );
    }

    let result;

    try {
        result = await response.json();
    } catch (error) {
        throw new Error(
            "The server returned an invalid response. Check the PHP API."
        );
    }

    if (!response.ok || result.success === false) {
        throw new Error(
            result.message || `Request failed (${response.status}).`
        );
    }

    return result;
}

export const wishlistStore = {
    async getAll() {
        const result = await sendRequest(API_URL);
        return result.data || result.items || [];
    },

    async add(productId) {
        return sendRequest(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id: productId
            })
        });
    },

    async remove(productId) {
        return sendRequest(
            `${API_URL}?product_id=${encodeURIComponent(productId)}`,
            {
                method: "DELETE"
            }
        );
    },

    async clear() {
        return sendRequest(API_URL, {
            method: "DELETE"
        });
    }
};