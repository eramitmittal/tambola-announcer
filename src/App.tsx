import { useState } from 'react';
import backgroundImg from './background.png'
import './App.css';
import { Announcer } from './Announcer';

const maxNum = 90;
const perRowCount = 10;
let enabled = true;

let announcer = new Announcer(maxNum);

function App() {
  const [lastNumAnnounced, setLastNumAnnounced] = useState<number>();
  
  return (
    <div className='App' style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="App-main">
        <header className='App-header'>
          <div className='App-title'>Welcome to !!!Masha & Bear Housie!!!</div>
          <div className='App-actions'>
            <button style={{gridColumn: 2}} onClick={()=>{
              if(!enabled) return;
              const announced = announcer.next();
              if(announced > 0) {
                setLastNumAnnounced(announced)
                playAnnouncedNumber();
              };
            }
            }>Next
            </button>
            <button style={{gridColumn: 4}} onClick={()=>{
              playAnnouncedNumber();
            }
            }>Play again
            </button>
            <button style={{gridColumn: 6}} onClick={()=>{
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
                    return TambolaNum(i + n)
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
        <p style={{gridColumn: 2, gridRow: 3}}>Numbers announced {announcer.allAnnounced.length}/{maxNum}</p>
        <p style={{gridColumn: 4, gridRow: 3}}>Last number announced: {lastNumAnnounced}</p>
        <p style={{gridColumnStart: 2, gridColumnEnd: 5, gridRow: 4, color: 'white'}}>For Sammy-Shoi, with <span style={{color: "red", 'fontSize':25}}>&#10084;</span> from Fufu</p>
      </footer>
    </div>
  );
}

function playAnnouncedNumber() {
  if(!enabled)return;
  enabled = false;
  if(announcer.lastAnnounced() <= 15) {
  const sound = `${process.env.PUBLIC_URL}/sound/${announcer.lastAnnounced()}.opus`;
  new Audio(sound).play().then
  (()=>{
    return new Promise((r)=>{
      setTimeout(() => {
        r(undefined);
      }, 7000);
    })
  }).then(()=>{
    enabled = true;
  })
} else {enabled = true}
}

function TambolaNum(num : number) {
  return <td className={announcer.hasBeenAnnounced(num)? "Announced" : ""}>{num}</td>
}

export default App;
