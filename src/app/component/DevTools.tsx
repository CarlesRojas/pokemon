import { EventKey, useEventSubscription } from "@/app/context/Event";
import { useDebounceValue } from "usehooks-ts";

const DevTools = () => {
    const [frameRate, setFrameRate] = useDebounceValue(0, 1000, { maxWait: 1000 });
    useEventSubscription(EventKey.FRAME_RATE_CHANGE, ({ frameRate }) => setFrameRate(frameRate));

    return (
        <section className="absolute inset-0 z-50 flex justify-end">
            <p className="text-shadow-sm drop-shadow-text p-2 text-3xl tracking-widest text-orange-500">{frameRate}</p>
        </section>
    );
};

export default DevTools;
