const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");

const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;
let userMessage;

const createChatLi = (message, className) => {
	// Create a new chat li element with passed message and class name
	const chatLi = document.createElement("li");
	chatLi.classList.add("chat", className);
	let chatContent =
		className === "outgoing"
			? `<p></p>`
			: `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
	chatLi.innerHTML = chatContent;
	chatLi.querySelector("p").textContent = message;
	return chatLi;
};

const generateResponse = (incomingChatLi) => {
	const API_URL = "https://api.openai.com/v1/chat/completions";
	const messageElement = incomingChatLi.querySelector("p");

	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${API_KEY}`,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: userMessage }],
		}),
	};
	// Send POST request to OpenAI API
	fetch(API_URL, requestOptions)
		.then((res) => res.json())
		.then((data) => {
			messageElement.textContent = data.choices[0].message.content;
		})
		.catch((err) => {
			messageElement.classList.add("error");
			messageElement.textContent =
				"Oops! Something went wrong. Please try again.";
		})
		.finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
	userMessage = chatInput.value.trim();
	console.log(userMessage);
	if (!userMessage) {
		return;
	}
	chatInput.value = "";
	chatInput.style.height = `${inputInitHeight}px`;
	// Append the user message to the chatbox
	chatbox.appendChild(createChatLi(userMessage, "outgoing"));
	chatbox.scrollTo(0, chatbox.scrollHeight);

	setTimeout(() => {
		// Append the bot message to the chatbox with a delay of 600ms
		const incomingChatLi = createChatLi("Lemme think...", "incoming");
		chatbox.appendChild(incomingChatLi);
		chatbox.scrollTo(0, chatbox.scrollHeight);
		generateResponse(incomingChatLi);
	}, 600);
};

chatInput.addEventListener("input", () => {
	chatInput.style.height = `${inputInitHeight.scrollHeight}px`;
	chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
		e.preventDefault();
		handleChat();
	}
});

sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => {
	document.body.classList.toggle("show-chatbot");
});
