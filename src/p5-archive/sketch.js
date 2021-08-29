const sketch = (p) => {

    let prevScale = 0
    let nowScale = 1
    let progressScale = 0

    let moveCircle = 0

    let random = true
    let noiseLevel = 1.0

    let progressMove = 0

    let progressMoving = 0
    let progressEase = (_progress) => {
        return 1 - Math.pow(1 - _progress, 4);
    }
    let accessMoving = false

    let ShapesToMoveArr = []
    let AlreadyUsedShapes = []

    // Shape: [fill, stroke, rLeft, rRight...]
    const Shapes = [
        ['white', 'white', 0, 0, 0, 0],
        [false, false, 0, 0, 0, 0],
        [false, 'white', 100, 100, 0, 100],
        [false, 'white', 100, 100, 100, 100],
        [false, false, 0, 0, 0, 0],
        ['white', 'white', 100, 100, 100, 100],
        [false, 'white', 0, 0, 0, 0],
        [false, 'white', 20, 20, 20, 20],
        [false, false, 0, 0, 0, 0]
    ]

    const Shapes2 = [
        ['white', 'white', 0, 0, 0, 0],
        [false, false, 0, 0, 0, 0],
        [false, 'white', 100, 100, 0, 100],
        [false, false, 0, 0, 0, 0],
        [false, 'white', 100, 100, 100, 100],
        [false, false, 0, 0, 0, 0],
        ['white', 'white', 100, 100, 100, 100],
        [false, false, 0, 0, 0, 0],
        [false, 'white', 0, 0, 0, 0],
        [false, false, 0, 0, 0, 0],
        [false, 'white', 20, 20, 20, 20],
        [false, false, 0, 0, 0, 0]
    ]

    let ShapesArr = []
    let ShapesArrCopy = []

    /*
    if(genShape[0]) {
                p.fill(genShape[0])
            } else {
                p.noFill()
            }

            if(genShape[1]) {
                p.stroke(genShape[1])
            } else {
                p.noStroke()
            }
    */

            const separateDistrict = (_dtSize, _dtLeft, _dtTop, _dtLevel) => {
                let dtSize = _dtSize
        
                for(let b=0; b<4; b++) {
                    let genI = (_dtLevel === 5) ? Math.floor(Math.random()*(Shapes2.length-1)) : Math.floor(Math.random()*(Shapes.length-1))
                    let genShape = (_dtLevel === 5) ? Shapes2[genI] : Shapes[genI]
        
                    let dtLeft = (b%2*dtSize)
                    let dtTop = Math.floor(b/2)*dtSize
        
                    let dtSizeWithOffset = dtSize - 2.4
                    let dtBorderRadius = (c) => {
                        return genShape[c]*.01*dtSize
                    }
                    let dtNewLeft = _dtLeft + dtLeft
                    let dtNewTop = _dtTop + dtTop

                    let dtDivisionNoise = Math.round(p.noise(_dtLeft + dtSize / 2, _dtTop + dtSize / 2))
                    let dtDivisionRandom = Math.round(Math.random())

                    let dtSelRandom = (random) ? dtDivisionRandom : dtDivisionNoise
        
                    if(dtSelRandom == 0 || _dtLevel == 2) {
                        ShapesArr.push([dtNewLeft + 1.2, dtNewTop + 1.2, dtSizeWithOffset, dtSizeWithOffset, dtBorderRadius(2), dtBorderRadius(3), dtBorderRadius(4), dtBorderRadius(5), genShape[0], genShape[1], _dtLevel, b])
        
                        if(_dtLevel == 2 && !genShape[0] && !genShape[1]) {
                            let dtOptions = {'d0': [1, 2, 'left', 'top'], 'd1': [-1, 2, 'left', 'bottom'], 'd2': [-2, 1, 'top', 'right'], 'd3': [-2, -1, 'top', 'left']}
                            let setDtOptions = (_arrPos, _count) => {
                                return [_arrPos + dtOptions['d'+_count][0], _arrPos + dtOptions['d'+_count][1]]
                            }
                
        
                            ShapesToMoveArr.push({'empty': ShapesArr.length-1, 'options': setDtOptions(ShapesArr.length-1, b)})
                        }
                    } else {
                        separateDistrict(dtSize / 2, dtNewLeft, dtNewTop, _dtLevel+1)
                    }
                }
            }

    const drawDistricts = () => {
        ShapesArr = []
        let dtColNum = nowScale * 7

        let dtSize = p.windowWidth / dtColNum
        let dtRowNum = Math.ceil(p.windowHeight / dtSize)

        let dtItemsNum = dtRowNum * dtColNum

        for(let i=0; i<dtItemsNum; i++) {
            let genI = Math.floor(Math.random()*(Shapes.length-1))
            let genShape = Shapes[genI]

            let dtLeft = (i%dtColNum*dtSize)
            let dtTop = Math.floor(i/dtColNum)*dtSize

            let dtDivisionNoise = Math.round(p.noise(dtLeft + dtSize / 2, dtTop + dtSize / 2))
            let dtDivisionRandom = Math.round(Math.random())

            let dtSelRandom = (random) ? dtDivisionRandom : dtDivisionNoise

            
            if(dtSelRandom == 0) {
                ShapesArr.push([dtLeft + 1, dtTop + 1, dtSize - 2, dtSize - 2, genShape[2]*.01*dtSize, genShape[3]*.01*dtSize, genShape[4]*.01*dtSize, genShape[5]*.01*dtSize, genShape[0], genShape[1]])
            } else {
                separateDistrict(dtSize/2, dtLeft, dtTop, 1)
            }
            
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.background(0);

        p.noLoop()

        setInterval(() => {
            

            ShapesToMoveArr = []
            AlreadyUsedShapes = []
            ShapesArrCopy = []
            progressMoving = 0

            for(let key in ShapesArr) {
                ShapesArrCopy[key] = [...ShapesArr[key]]

                if(!ShapesArrCopy[key][8] && !ShapesArrCopy[key][9] && ShapesArrCopy[key][10] === 2) {
                    let dtOptions = {'d0': [1, 2, 'left', 'top'], 'd1': [-1, 2, 'left', 'bottom'], 'd2': [-2, 1, 'top', 'right'], 'd3': [-2, -1, 'top', 'left']}
                    let setDtOptions = (_arrPos, _count) => {
                        let __arrPos = parseInt(_arrPos)
                        
                        let FoundShapes = [__arrPos + dtOptions['d'+_count][0], __arrPos + dtOptions['d'+_count][1]]

                        if(!ShapesArr[FoundShapes[0]] || !ShapesArr[FoundShapes[1]]) console.log('Problem: ' + FoundShapes)

                        if(ShapesArr[FoundShapes[0]] && ShapesArr[FoundShapes[1]]) {
                            if(ShapesArr[FoundShapes[0]][10] < 2 || ShapesArr[FoundShapes[1]][10] < 2) console.log('P..: ' + FoundShapes)
                        }

                        return FoundShapes
                    }
        

                    ShapesToMoveArr.push({'empty': parseInt(key), 'options': setDtOptions(key, ShapesArrCopy[key][11])})
                }
                
            }

            console.log(ShapesToMoveArr)

            accessMoving = true
            p.loop()

            
        }, 1000)

        drawDistricts()

    }

    p.myCustomRedrawAccordingToNewPropsHandler = (props) => {

        if(props.scale) {
            /*
            scale.prev = scale.now
            console.log(scale.prev)
            let prev = scale.now
            let next = props.scale

            console.log(prev+', '+next)

            scale.now = props.scale
            scale.progress = 0
            */

            
        }

        if(props.random) random = props.random
        if(props.noiseLevel) noiseLevel = props.noiseLevel


        
    };

    

    p.draw = () => {
        p.strokeWeight(2)
        p.clear()
        p.background(0)

        

        ShapesArr.map((key, i) => {
            if(key[8]) {
                p.fill(key[8])
            } else {
                p.noFill()
            }

            if(key[9]) {
                p.stroke(key[9])
            } else {
                p.noStroke()
            }

            p.rect(key[0], key[1], key[2], key[3], key[4], key[5], key[6], key[7])
            p.fill('red')
        })

        if(progressMoving >= 0 && progressMoving <= 1 && accessMoving) {


            
            ShapesToMoveArr.map((key, _i) => {
                let emptyShape = key.empty

                let optionRandom
                if(progressMoving === 0) {
                    let queueCommon = Math.round(Math.random())
                    if(AlreadyUsedShapes.includes(key.options[queueCommon])) {
                        queueCommon = (queueCommon === 0) ? 1 : 0

                        if(AlreadyUsedShapes.includes(key.options[queueCommon])) {
                            queueCommon = 3
                        }
                    }
                    AlreadyUsedShapes.push(key.options[queueCommon])
                    AlreadyUsedShapes.push(key.empty)

                    ShapesToMoveArr[_i].random = queueCommon
                    optionRandom = ShapesToMoveArr[_i].random
                } else {
                    optionRandom = key.random
                }
                
                
                

                let optionShape = (optionRandom === 3) ? key.empty :  key.options[optionRandom]

                if(ShapesArrCopy[emptyShape] && ShapesArr[emptyShape] && ShapesArr[optionShape] && ShapesArrCopy[optionShape]) {
                    
                    ShapesArr[emptyShape][0] = ShapesArrCopy[emptyShape][0] + (ShapesArrCopy[optionShape][0] - ShapesArrCopy[emptyShape][0])*progressEase(progressMoving)
                    ShapesArr[emptyShape][1] = ShapesArrCopy[emptyShape][1] + (ShapesArrCopy[optionShape][1] - ShapesArrCopy[emptyShape][1])*progressEase(progressMoving)
                    ShapesArr[optionShape][0] = ShapesArrCopy[optionShape][0] + (ShapesArrCopy[emptyShape][0] - ShapesArrCopy[optionShape][0])*progressEase(progressMoving)
                    ShapesArr[optionShape][1] = ShapesArrCopy[optionShape][1] + (ShapesArrCopy[emptyShape][1] - ShapesArrCopy[optionShape][1])*progressEase(progressMoving)
                    

                    if(progressMoving === 1) {
                        ShapesArr[emptyShape][11] = ShapesArrCopy[optionShape][11]
                        ShapesArr[optionShape][11] = ShapesArrCopy[emptyShape][11]

                        let emptyShapeCopy = [...ShapesArr[emptyShape]]
                        let optionShapeCopy = [...ShapesArr[optionShape]]

                        ShapesArr[emptyShape] = [...optionShapeCopy]
                        ShapesArr[optionShape] = [...emptyShapeCopy]
                    }
                }
            
            })
            
            
            let progressStep = .1

            if(progressMoving + progressStep >= 1) {
                if(progressMoving === 1) accessMoving = false
                progressMoving = 1
                
            } else {
                progressMoving += progressStep
            }

            

        } else if(progressMoving >= 1 && !accessMoving) {
            ShapesArrCopy = []
            progressMoving = 0
            p.noLoop()
        }

      }

}

export default sketch