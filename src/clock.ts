export class Clock {

    private el = document.createElement('div');
    private time: number = Date.now();

    constructor(anchor: HTMLElement) {
        anchor.appendChild(this.el);
    }

    public setTime(time: number) {
        this.time = time;
        this.refreshDisplay();
    }

    private refreshDisplay() {
        const d = new Date(this.time);
        this.el.innerText = d.toUTCString();
    }
} 