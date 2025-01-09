const ecommerceSites = [
    {
        name: "Shopee",
        host: "shopee.vn",
        chatInputSelector: ".MdXquzGuDv",
    },
    {
        name: "Lazada",
        host: "lazada.vn",
        chatInputSelector: "textarea[placeholder='Type your message here']",
    },
    {
        name: "Tiki",
        host: "tiki.vn",
        chatInputSelector: "textarea.chat-input",
    },
];

async function fetchSuggestion(inputText) {
    try {
        const response = await fetch("http://localhost:3000/get-suggestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: inputText }),
        });

        const data = await response.json();
        if (data.suggestion) {
            return data.suggestion;
        }
    } catch (error) {
        console.error("Error fetching suggestion:", error);
    }
    return null;
}

fetchSuggestion("Quần");
fetchSuggestion("Shop mở lúc mấy giờ?");

function animateSuggestion(inputElement, suggestion) {
    const newText = `${suggestion}`; 

    anime({
        targets: inputElement,
        opacity: [1, 0],
        duration: 300,
        easing: "easeInOutQuad",
        complete: () => {
            inputElement.value = newText;

            anime({
                targets: inputElement,
                opacity: [0, 1],
                duration: 300,
                easing: "easeInOutQuad",
            });
        },
    });
}

function getCurrentSiteConfig() {
    const currentHost = window.location.host;
    return ecommerceSites.find((site) => currentHost.includes(site.host));
}

function suggestText(inputText) {
    const suggestions = {
        Quần: "Quần legging",
        Áo: "Áo phông",
        Giày: "Giày sneaker",
    };

    return suggestions[inputText.trim()];
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function handleChatInput(inputElement) {

    const debouncedSuggest = debounce((inputText) => {
        const suggestion = suggestText(inputText);

        if (suggestion) {
            animateSuggestion(inputElement, suggestion);
        }
    }, 1000);

    inputElement.addEventListener("input", (event) => {
        const inputText = event.target.value;
        debouncedSuggest(inputText);
    });
}

function setupChatSuggestions() {
    const siteConfig = getCurrentSiteConfig();
    if (!siteConfig) return;

    const chatInput = document.querySelector(".MdXquzGuDv");

    if (chatInput) {
        handleChatInput(chatInput);
    }
}

function observeChatSection() {
    const observer = new MutationObserver(() => {
        setupChatSuggestions();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function initializeExtension() {
    setupChatSuggestions();
    observeChatSection();
}

initializeExtension();