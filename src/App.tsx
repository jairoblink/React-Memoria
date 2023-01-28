import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import RestartIcon from './svgs/restart.svg';
import { Button } from './components/button';
import { InfoItem } from './components/InfoItem';
import { useEffect, useState } from 'react';
import { GridItemType } from './types/GridItemType';
import {items} from './data/items';
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';


const App = () => {
  const [playing, setPlaying] = useState<Boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moverCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);


  useEffect(() => resetAndCreateGrid(), []); 

  useEffect(() => {
    const timer = setInterval(() =>{
      if(playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  useEffect(() => {
    if(shownCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2) {


        if(opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
                tmpGrid[i].shown = false;
              }
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          } else {
            setTimeout(() =>{
              let tmpGrid = [...gridItems];
            for(let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
              setGridItems(tmpGrid);
            setShownCount(0)
            },1000)
          }

            setMoveCount(moverCount => moverCount + 1);
      }

    }
  }, [shownCount, gridItems]);

  // verificando se o jogo acabou
  useEffect(() => {
    if(moverCount > 0 && gridItems.every(item => item.permanentShown === true)){
      setPlaying(false);
    }
  }, [moverCount, gridItems]);

  const resetAndCreateGrid = () => {
    // passo 1 - resertar o jogo
    setTimeElapsed(0);
    setPlaying(false);
    setMoveCount(0);
    setShownCount(0);

    //passo 2 - criar o grid e começar o jogo
    // 2.1 - criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i =0; i < (items.length *2); i++) {
      tmpGrid.push( {
        item: null,
        shown: false,
        permanentShown: false
      });

    }
    // 2.2 - preencher o grid
    for(let w = 0; w < 2; w++) {
      for(let i = 0; i < items.length; i++) {
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random () * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }

    }
    //2.3- jogar n state
    setGridItems(tmpGrid);

    // passo 3 - criar o jogo
    setPlaying(true);

  }
   const handleItemClick = (index: number) => {
      if(playing && index !== null && shownCount < 2) {
        let tmpGrid = [...gridItems];

        if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
          tmpGrid[index].shown = true; 
          setShownCount(shownCount + 1);
        }
        setGridItems(tmpGrid);
      }
   }
  return (
     <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
          </C.LogoLink>

          <C.InfoArea>
            shownCount: {shownCount}
            <InfoItem label="tempo" value= {formatTimeElapsed(timeElapsed)} />
            <InfoItem label="movimentos" value= {moverCount.toString()}   />
          </C.InfoArea>


            <Button  label="Reiniciar" icon={RestartIcon}onClick={resetAndCreateGrid} />
           </C.Info>
            <C.GridArea>
              <C.Grid>
                {gridItems.map((item, index)=>(
                  <GridItem
                    key={index}
                    item={item}
                    onClick={() => handleItemClick(index)}

                  />
                ))}

              </C.Grid>
            </C.GridArea>
          </C.Container>
     );
  }
 
  export default App;
       
