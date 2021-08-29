import logo from './logo.svg';
import './App.css';

import P5Wrapper from "react-p5-wrapper";

import anim from './p5/anim'

import { useControls } from "leva"
import { useEffect } from 'react';

function App() {
  const { background, color1, colorOpacity, color2, scale, overlay, secondLevel } = useControls({ background: {value: 1, min: 1, max: 2, step: 1}, color1: {value: 1, min: 1, max: 4, step: 1}, colorOpacity: {value: 1, min: 0, max: 1, step: .1}, color2: {value: 2, min: 1, max: 4, step: 1}, scale: 1.0, overlay: false, secondLevel: false })
  const [{ random, noiseLevel }, setRandomNoise] = useControls(() => ({ random: true, noiseLevel: 1.0 }))


  const ColorArr = [
    '#40FCDA',
    'white',
    '#C1D0E0',
    '#465563'
  ]
  
  const ColorBackArr = [
    'white',
    'black'
  ]

  return (
    <P5Wrapper sketch={anim} scale={scale} color1={ColorArr[color1-1]} color2={ColorArr[color2-1]} colorOpacity = {colorOpacity} background={ColorBackArr[background-1]} overlay={overlay} secondLevel={secondLevel}/>
  );
}

export default App;
