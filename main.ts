//% color=190 weight=1 icon="\uf03d" block="Cutscene"
namespace cutscene {
    /**
     * Event method type
     */
    export type EventMethod = (I: CutsceneHandler) => void;

    /**
     * Event schema object
     */
    export type Event = {
        /**
         * Event identification reference
         */
        id: string, // Used for differentiating events from each other

        /**
         * When the event should run in **miliseconds**
         */
        time: number, // When the event should play

        /**
         * The event method to run.
         */
        method: EventMethod // method
    }

    export interface IHandler {
        add(t: number, id: string, method: EventMethod): void
        remove(id: string): void
        start(): void
        stop(): void
    }

    /**
     * Enable verbosity (e.g. more descriptive commenting)
     */
    export let verboseMode: boolean = false;

    // rest doesn't seem to work correctly on this version of typescript :<
    function verbose(...msg: any[]): void {
        if (!verboseMode) return;
        console.log(`{CS:VERBOSE}: ${msg}`);
    }

    //% block
    export class CutsceneHandler implements IHandler {
        // time since- y'know, right???
        _time: number = 0;

        public stopWhenFinished: boolean = false;

        // An array of all locally registered events
        _events: Event[] = [];
        _startTime: number = 0;
        _eventPtr: number = 0;
        _isSorted: boolean = true;

        // whether to continue updating, or not...
        _continue: boolean = false;
        private get continue(): boolean {
            return this._continue;
        }
        private set continue(v: boolean) {
            verbose(`Playback ${v ? "enabled" : "disabled"}`)
            this._continue = v;
        }

        constructor() {
            game.onUpdate(() => this._update());
        }

        _update(): void {
            if (!this.continue) return;

            const currentTime: number = game.runtime() - this._startTime;

            while (this._eventPtr < this._events.length && this._events[this._eventPtr].time <= currentTime) {
                const evnt: Event = this._events[this._eventPtr];
                verbose(`Running "${evnt.id}" at ${evnt.time}ms`);
                evnt.method(this); this._eventPtr++;
            }

            if (this.stopWhenFinished && this._eventPtr >= this._events.length) {
                this.stop();
            }
        }

        /** 
         * Add an event to the handler's list.
         */
        //% block="add event $handler to $this with id $id at $t ms"
        //% t.shadow=timePicker
        //% draggableParameters="reporter"
        //% weight=99
        //% blockGap=8
        //% blockId="cutscene_add_event"
        public add(t: number, id: string, handler: EventMethod): void {
            this._events.push({ id: id, time: t, method: handler });
            this._isSorted = false;
            verbose(`Regsitered event to id "${id}" @ ${t / 1000} second(s)`);

        }

        /**
         * Remove an event.
         */
        //% block="remove event from $this using $id"
        public remove(id: string): void {
            this._events = this._events.filter(e => e.id !== id)
        }

        /**
         * Start the cutscene handler.
         */
        //% block="start $this"
        public start(): void {
            if (this._events.length === 0) return;

            // Only sort if we've added new events
            if (!this._isSorted) {
                this._events.sort((a, b) => a.time - b.time);
                this._isSorted = true;
            }

            this._eventPtr = 0;
            this._startTime = game.runtime();
            this.continue = true;
        }

        /**
         * Stop the cutscene handler.
         */
        //% block="stop $this"
        public stop(): void {
            this.continue = false;
            // returning `this` messes blocks up :<
            // return this;
        }
    }

    /**
     * Use for registering events in block mode.
     * I guess this could be used as some kind of signal-like handler, but eh...
     * 
     * To use events on block mode you'll need to require them using the `get global event` 
     * (also known as `Registry.get("EVENT_NAME")`) block.
     */
    export class Registry {
        /**
         * Event map
         */
        static events: { [key: string]: EventMethod } = {};

        /**
         * Sets an event by it's `ID`.
         * @param id the id reference to the event
         * @param the event callback
         */
        static set(id: string, callback: (handler: CutsceneHandler) => void): void {
            Registry.events[id] = callback;
        }

        /**
         * Retrieves an event by its `ID`.
         * @param id the name of the event to get
         */
        //% block="get global event $id"
        static get(id: string): EventMethod {
            return Registry.events[id];
        }
    }

    /**
     * Register a static event
     * 
     * This isn't automatically added to every `CutsceneHandler` instance...
     * So instead you'll need to manually require them by calling `cutscene.Registry.get("EVENT_NAME")`,
     * which uses the type : `(handler:CutsceneHandler) => void`...
     * 
     * @param id The name of this event (e.g., "intro")
     * @param callback the event callback
     */
    //% block="set global cutscene event $id"
    //% draggableParameters="reporter"
    export function registerStaticEvent(id: string, callback: (handler: CutsceneHandler) => void): void {
        Registry.set(id, callback);
    }

    /**
     * Create a cutscene handler
     */
    //% block="create cutscene"
    export function create(): CutsceneHandler {
        return new CutsceneHandler();
    }
}