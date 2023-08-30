const socket = io('http://localhost:8000');

const form = document.getElementById("send-form-m");
const messageInput = document.getElementById("messageinp");
const mesContainer = document.querySelector(".container");
var audio = new Audio('ding.mp3');

const append = (mes, pos) => {
    if (mes.length !== null && mes.length !== 0) {
        const mesEle = document.createElement('div');
        mesEle.innerText = mes;
        mesEle.classList.add('message');
        mesEle.classList.add(pos);
        mesContainer.append(mesEle);
        if (pos === 'msgleft' || pos === 'msgcenter') {
            audio.play();
        }
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = messageInput.value;
    if (msg.trim().length !== 0) {
        append(`You: ${msg}`, 'msgright');
        socket.emit('new-message', msg);
    }
    messageInput.value = "";
});

const name = prompt("Enter your name: ");
socket.emit('new-user-joined', name);

socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'msgcenter');
});

socket.on('receive', (data) => {
    if (data.message.trim().length !== 0) {
        const nameEle = document.createElement('span');
        nameEle.style.fontWeight = "bold";
        nameEle.textContent = data.name;

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message');
        messageContainer.classList.add('msgleft');
        messageContainer.appendChild(nameEle);

        const messageText = document.createTextNode(`: ${data.message}`);
        messageContainer.appendChild(messageText);

        mesContainer.appendChild(messageContainer);
        audio.play();
    }
});

socket.on('leave', (data) => {
    append(`${data} left the chat`, 'msgcenter');
});

// Display name in the chat window
append(`Your name: ${name}`, 'userjoined');