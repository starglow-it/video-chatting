class TimerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._updateIntervalInMS = 1000 / 30;
        this._nextUpdateFrame = this._updateIntervalInMS;
    }

    get intervalInFrames() {
        return (this._updateIntervalInMS / 1000) * sampleRate;
    }

    process(inputs) {
        const input = inputs[0];

        if (input.length > 0) {
            const samples = input[0];
            let sum = 0;

            for (let i = 0; i < samples.length; ++i)
                sum += samples[i] * samples[i];

            this._nextUpdateFrame -= samples.length;

            if (this._nextUpdateFrame < 0) {
                this._nextUpdateFrame += this.intervalInFrames;
                this.port.postMessage({ isNeedToRender: true });

                return true;
            }

            return true;
        }

        this.port.postMessage({ isNeedToRender: false });

        return false;
    }
}

registerProcessor('timer', TimerProcessor);
