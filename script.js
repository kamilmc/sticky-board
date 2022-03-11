class Stick {
    constructor(id, posX, posY, value) {
        this.id = id;
        this.posX = posX;
        this.posY = posY;
        this.value = value;
    }
}

class Storage {
    static getSticks() {
        let sticks;
        if (!localStorage.getItem('sticks')) {
            sticks = [
                {id: '1', posX: 200, posY: 300, value: 'Note 1'},
                {id: '2', posX: 500, posY: 500, value: 'Note 2'},
            ];
            localStorage.setItem('sticks', JSON.stringify(sticks));
        } else {
            sticks = JSON.parse(localStorage.getItem('sticks'));
        }
        //!localStorage.getItem('sticks') ? sticks = null : sticks = JSON.parse(localStorage.getItem('sticks'));
        return sticks;
    }

    static addNewStick() {
        let sticks = this.getSticks();
        let stick;
        sticks === null ? stick = {id: 1, posX:200, posY:200, value:''} : stick = {id: +sticks[sticks.length-1].id+1, posX:200, posY:200, value:''}
        sticks.push(stick);
        localStorage.setItem('sticks', JSON.stringify(sticks));
        UI.viewNewStick(stick);
    }

    static saveStickText(id) {
        const text = document.querySelector(`#id-${id} textarea`).value;
        let sticks = this.getSticks();
        const index = sticks.findIndex(item => item.id == id);
        sticks[index].value = text;
        localStorage.setItem('sticks', JSON.stringify(sticks));
    }

    static savePosition(id, posX, posY) {
        let sticks = this.getSticks();
        const index = sticks.findIndex(item => item.id == id.split('-')[1]);
        sticks[index].posX = posX;
        sticks[index].posY = posY;
        localStorage.setItem('sticks', JSON.stringify(sticks));
    }
}

class UI {
    static initialView() {
        const sticks = Storage.getSticks();

        sticks.forEach((stick) => {
            const main = document.querySelector('#main');
            const div = document.createElement('div');
            div.innerHTML = `<textarea oninput="Storage.saveStickText(${stick.id})">${stick.value}</textarea>`;
            div.classList.add('square');
            div.id = `id-${stick.id}`;
            div.style.top = stick.posY+'px';
            div.style.left = stick.posX+'px';
            main.appendChild(div);

            const divEvent = document.querySelector(`#id-${stick.id}`);

            // changing position of sticky notes
            divEvent.addEventListener('touchstart', () => divEvent.addEventListener('touchmove', touchPos));
            divEvent.addEventListener('touchend', () => divEvent.removeEventListener('touchmove', touchPos));
            divEvent.addEventListener('mousedown', () => divEvent.addEventListener('mousemove', mousePos));
            divEvent.addEventListener('mouseup', () => divEvent.removeEventListener('mousemove', mousePos));
            document.querySelector(`#id-${stick.id} textarea`).addEventListener('focus', () => document.querySelector('#removebtn').setAttribute('data-id', stick.id));
        });

    }
    static viewNewStick(stick) {
        const main = document.querySelector('#main');
        const div = document.createElement('div');
        div.innerHTML = `<textarea oninput="Storage.saveStickText(${stick.id})">${stick.value}</textarea>`;
        div.classList.add('square');
        div.id = `id-${stick.id}`;
        div.style.top = stick.posY+'px';
        div.style.left = stick.posX+'px';
        main.appendChild(div);

        const divEvent = document.querySelector(`#id-${stick.id}`);

        divEvent.addEventListener('touchstart', () => divEvent.addEventListener('touchmove', touchPos));
        divEvent.addEventListener('touchend', () => divEvent.removeEventListener('touchmove', touchPos));
        divEvent.addEventListener('mousedown', () => divEvent.addEventListener('mousemove', mousePos));
        divEvent.addEventListener('mouseup', () => divEvent.removeEventListener('mousemove', mousePos));
        document.querySelector(`#id-${stick.id} textarea`).addEventListener('focus', () => console.log(stick.id));
    }
}

document.addEventListener('DOMContentLoaded', UI.initialView);

document.querySelector('#addbtn').addEventListener('click', () => Storage.addNewStick());


function touchPos(event) {
    this.style.top = event.touches[0].clientY+'px';
    this.style.left = event.touches[0].clientX+'px';
    Storage.savePosition(this.id, event.touches[0].clientX, event.touches[0].clientY);
}

function mousePos(event) {
    this.style.top = event.clientY+'px';
    this.style.left = event.clientX+'px';
    Storage.savePosition(this.id, event.clientX, event.clientY);
}