import { useEffect, useRef, useState } from "react";
import "./App.css";
import ActionCard from "./components/card";
import SwitchButton from "./components/switch-button";
import { store } from "./storage/store";

type Dir = "left" | "right";

function getUrlParam(name: string): number | string {
  const url = new URL(window.location.href);
  return Number(url.searchParams.get(name));
}

function App() {
  const cards = store.state.cards;
  const [current, setCurrent] = useState<number>(store.state.currentCard);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<Dir>("right");
  const timerRef = useRef<number | null>(null);

  const go = (next: number, direction: Dir) => {
    if (next === current) return;
    setDir(direction);
    setPrev(current);
    setCurrent(next);
    window.history.replaceState(null, '', `?slide=${current}`);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setPrev(null), 360);
  };

  const onLeft = () => {
    const next = Math.max(0, current - 1);
    go(next, "left");
  };
  const onRight = () => {
    const next = Math.min(cards.length - 1, current + 1);
    go(next, "right");
  };

  useEffect(
    () => () => {
      const isNeedToReplaceSlide = Number(getUrlParam('slide')) && Number(getUrlParam('slide')) >= 0 && store.state.cards.length - 1  >= Number(getUrlParam('slide')) 
      if (isNeedToReplaceSlide) {
        go(Number(getUrlParam('slide')), 'right');
        return;
      }
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [current]
  );

  return (
    <>
      <div className="slider">
        <div
          key={`curr-${cards[current].id}`}
          className={`slide slide--enter-${dir}`}
        >
          <ActionCard
            title={cards[current].title}
            image={cards[current].image ?? null}
            link={cards[current].link ?? null}
          />
        </div>

        {prev !== null && (
          <div
            key={`prev-${cards[prev].id}`}
            className={`slide slide--exit-${dir === "left" ? "right" : "left"}`}
          >
            <ActionCard
              title={cards[prev].title}
              image={cards[prev].image ?? null}
              link={cards[current].link ?? null}
            />
          </div>
        )}
      </div>

      <div className="button-container">
        <SwitchButton type="left" onClick={onLeft} />
        <SwitchButton type="right" onClick={onRight} />
      </div>
    </>
  );
}

export default App;
