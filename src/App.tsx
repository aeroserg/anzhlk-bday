import { useEffect, useRef, useState } from "react";
import "./App.css";
import ActionCard from "./components/card";
import SwitchButton from "./components/switch-button";
import { store } from "./storage/store";

type Dir = "left" | "right";

function getUrlParam(name: string): number {
  const url = new URL(window.location.href);
  const param = url.searchParams.get(name);
  return param
    ? Math.max(0, Math.min(Number(param), store.state.cards.length - 1))
    : 0;
}

function App() {
  const cards = store.state.cards;
  const [current, setCurrent] = useState<number>(() => getUrlParam("slide"));
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<Dir>("right");
  const timerRef = useRef<number | null>(null);

  const [isNowBD, setIsNowBD] = useState<boolean>(false);

  useEffect(() => {
    const targetDateEnd = new Date(`${store.targetDate} 23:59:59`);
    const now = Date.now();
    if (now > targetDateEnd.getTime()) {
      console.log(targetDateEnd);
      setIsNowBD(true);
    }
  }, []);

  let additionalElements: React.ReactNode | null = null;
  switch (isNowBD) {
    case true:
      additionalElements = (
        <p>День рождения уже прошел, но вся презентация сохраенена</p>
      );
      break;
    default:
  }

  useEffect(() => {
    const urlSlide = getUrlParam("slide");
    if (urlSlide !== current) {
      setCurrent(urlSlide);
    }
  }, []);

  const go = (next: number, direction: Dir) => {
    if (next === current) return;
    setDir(direction);
    setPrev(current);
    setCurrent(next);
    window.history.replaceState(null, "", `?slide=${next}`);

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

  useEffect(() => {
    const handlePopState = () => {
      const urlSlide = getUrlParam("slide");
      if (urlSlide !== current) {
        const direction = urlSlide > current ? "right" : "left";
        go(urlSlide, direction);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [current]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      {additionalElements && cards[current].id === 1 && (
        <h2 className="additional-elements">{additionalElements}</h2>
      )}
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
              link={cards[prev].link ?? null}
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
