import { useState } from 'react';
import backgroundImg from './background.png'
import './App.css';
import { Announcer } from './Announcer';
import number_calling from "./number_calling_lines.json";

const maxNum = 90;
const perRowCount = 9;
let voice: SpeechSynthesisVoice;

let announcer = new Announcer(maxNum);

function App() {
  const [lastNumAnnounced, setLastNumAnnounced] = useState<number>();
  const [enabled, setEnabled] = useState<boolean>(true);
  let [voicesLoaded, setVoicesLoaded] = useState<boolean>(false);

  speechSynthesis.onvoiceschanged = ()=>{
    voice = speechSynthesis.getVoices().filter(v => v.name === "Microsoft Swara Online (Natural) - Hindi (India)")[0];
    setVoicesLoaded(true);
  }
  
  return (
    <div className='App' style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="App-main">
        <header className='App-header'>
          {/* <div className='App-title'>Welcome to !!!Baby Boss Housie!!!</div> */}
          <div className='App-actions'>
            <button disabled={!enabled || !voicesLoaded} style={{gridColumn: 2}} onClick={()=>{
              const announced = announcer.next();
              if(announced > 0) {
                setEnabled(false);
                setLastNumAnnounced(announced);
                playAnnouncedNumber().then(()=>setEnabled(true));
              };
            }
            }>Next
            </button>
            <button disabled={!enabled || !voicesLoaded} style={{gridColumn: 4}} onClick={()=>{
              setEnabled(false);
              playAnnouncedNumber().then(()=>setEnabled(true));
            }
            }>Play again
            </button>
            <button disabled={!enabled || !voicesLoaded} style={{gridColumn: 6}} onClick={()=>{
              announcer = new Announcer(maxNum);
              setLastNumAnnounced(undefined);
            }
            }>Reset
            </button>
          </div>
        </header>
        <header className="App-body">
          {
            <table className='Main-content'>
            <tbody>
            {
              [...Array(maxNum/perRowCount)].map((x, i)=>{
                i = i*perRowCount + 1;
                return <tr key={i}>
                  {
                  [...Array(perRowCount)].filter((_, n)=> i + n <= maxNum).map((_, n)=>{
                    return TambolaNum(i + n, enabled)
                  })
                  }
                </tr>
              })
            }
            </tbody>
          </table>
          }
        </header>
      </div>
      <footer className='App-footer'>
        <p style={{gridColumn: 3, gridRow: 3}}>Announced: {announcer.allAnnounced.length}/{maxNum}</p>
        <p style={{gridColumn: 5, gridRow: 3}}>Last number: {lastNumAnnounced}</p>
        <p style={{gridColumnStart: 3, gridColumnEnd: 6, gridRow: 5, fontSize: 17, color: 'white'}}>For Anmay, with <span style={{color: "red", 'fontSize':25}}>&#10084;</span> from Papa</p>
      </footer>
    </div>
  );
}

function playAnnouncedNumber() {
  return new Promise<void>((resolve)=>{
    if(!announcer.lastAnnounced()) resolve();
  
    const utterance = new SpeechSynthesisUtterance();
    utterance.onend = ()=>{
      console.log("end");
      resolve();
    }
    utterance.voice = voice;
    utterance.lang = voice.lang;
    const num = number_calling as any;
    utterance.text = num[announcer.lastAnnounced().toString()];
    speechSynthesis.speak(utterance);
    // const sound = `${process.env.PUBLIC_URL}/sound/${announcer.lastAnnounced()}.opus`;
    // new Audio(sound).play().then
    // (()=>{
    //   return new Promise((r)=>{
    //     setTimeout(() => {
    //       r(undefined);
    //     }, 7000);
    //   })
    // }).then(()=>{
    //   resolve();
    // })
  })
}

function TambolaNum(num : number, enabled: boolean) {
  return <td key={num} className={announcer.hasBeenAnnounced(num)? (num === announcer.lastAnnounced() && !enabled ? "last-Announced": "Announced") : ""}>{num}</td>
}

export default App;
