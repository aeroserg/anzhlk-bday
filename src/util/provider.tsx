import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa6";
export default function TimeProvider({ children }: { children: React.ReactNode }) {

    const [isNowBD, setIsNowBD] = useState<0 | 1 | 2>(0);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const targetDateStart = new Date('2025-10-18 00:00:00');
        const targetDateEnd = new Date('2025-10-18 23:59:59');

        const interval = setInterval(() => {
            if (Date.now() > targetDateStart.getTime() && Date.now() < targetDateEnd.getTime()) {
                setIsNowBD(1);
            } else if (Date.now() < targetDateStart.getTime()) {
                setIsNowBD(0);
            } else if (Date.now() > targetDateEnd.getTime()) {
                setIsNowBD(2);
            }

            setDaysLeft(Math.floor((targetDateStart.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        }, 0);
        return () => clearInterval(interval);
    }, []);

    let whatRender: React.ReactNode;
    switch(isNowBD) {
        case 0:
            whatRender = <div className="action-card">
                <p>А что такое? А что случилось? </p>
                <p>Нашла какую-то ссылку, а она не работает? Обидно, обидно... </p>
                <h3>Ничего, осталось подождать <b>{daysLeft} {daysLeft.toString().endsWith('1') ? 'день' : daysLeft.toString().endsWith('2') ? 'дня' : 'дней'}</b>.</h3>
                <div style={{marginTop: '4rem'}}>
                    <FaClock size={60} />
                </div>
            </div>;
            break;
        case 1:
            whatRender = children;
            break;
        case 2:
            whatRender = <div className="action-card">
                День рождения уже прошел Надеюсь, ты сохарнила подарки!
            </div>;
            break;
    }

  return (
    <div>
      {whatRender}
    </div>
  );
}

