import generateShape from './generateShape'
import generateRender from './generateRender'
import regenerateShape from './regenerateShape'
import UseReadyPatterns from './useReadyPatterns'


const anim = (p) => {

/* Initial Params with props*/
let Layers = {
    'first': [],
    'second': []
}

let overlay = false
let commonScale = 1.0
let background = 'black'
let color1 = '#30FCD9'
let color2 = 'white'
let colorOpacity = 1
let secondLevel = false

let changePair = true

p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if(props.scale) commonScale = props.scale
    if(props.background) background = props.background
    if(props.color1) color1 = props.color1
    if(props.color2) color2 = props.color2
    if(props.overlay) overlay = props.overlay
    if(props.colorOpacity) colorOpacity = props.colorOpacity
    if(props.secondLevel) secondLevel = props.secondLevel
};



/* Initial Params for processing */
let Step = 0
let LazyStep = 0
let TotalStep = null
let ReadyPatternNum = 0
let render = true
let TypeOfFilling = "fillAsRowTable"

/* Initial Params for second Level */
let SecStep = 0
let SecTotalStep = null
let SecPrevTotalStep = null
let SecRender = false
let SecFirstStep = null

/* Start Filling Processes */
const setInitParams = (_scale) => {
    let ColNum = _scale * 6
    let SegmentSize = p.windowWidth / ColNum
    let RowNum = Math.ceil(p.windowHeight / SegmentSize)

    return {'TotalSteps': ColNum * RowNum, 'SegmentSize': SegmentSize, 'ColNum': ColNum, 'RowNum': RowNum}
}

const FillingProcesses = {

    fillAsRowTable : ({ scale, currentStep }) => {
        let pm = setInitParams(scale)

        if(currentStep === 0) {
            TotalStep = pm.TotalSteps
        } 
        
        let Left = currentStep%pm.ColNum * pm.SegmentSize
        let Top = Math.floor(currentStep/pm.ColNum) * pm.SegmentSize
        

        let GeneratedShape = generateShape(pm.SegmentSize)
        let CornersRadius = GeneratedShape.CornersRadius
        let FillStroke = GeneratedShape.FillStroke
        let ShapeType = GeneratedShape.ShapeType

        if(currentStep != 0) {
            let getPrevShape = Layers.first[currentStep-1]
            let getUpShape = (currentStep > pm.ColNum) ? Layers.first[currentStep-pm.ColNum] : null

            let UpIf = null
            let UpString = null
            if(getUpShape) {
                UpIf = (typeof getUpShape[10] == 'string') ? getUpShape[10].substr(0, 6) : null
                UpString = getUpShape[10]
            }

            if(getPrevShape[10].substr(0, 6) == 'Circle' || UpIf == 'Circle') {
                let RegeneratedShape = regenerateShape(pm.SegmentSize, getPrevShape[10], UpString, GeneratedShape)
                CornersRadius = RegeneratedShape.CornersRadius
                FillStroke = RegeneratedShape.FillStroke
                ShapeType = RegeneratedShape.ShapeType
            }
        }

        let Shape = [Left, Top, pm.SegmentSize, pm.SegmentSize, CornersRadius[0], CornersRadius[1], CornersRadius[2], CornersRadius[3], FillStroke[0], FillStroke[1], ShapeType]

        Layers.first[currentStep] = Shape

    },
    fillAsColTable : ({ scale, currentStep }) => {
        let pm = setInitParams(scale)

        if(currentStep === 0) {
            TotalStep = pm.TotalSteps
        } 
        
        let Left = Math.floor(currentStep/pm.RowNum) * pm.SegmentSize
        let Top = currentStep%pm.RowNum * pm.SegmentSize

        let GeneratedShape = generateShape(pm.SegmentSize)
        let CornersRadius = GeneratedShape.CornersRadius
        let FillStroke = GeneratedShape.FillStroke
        let ShapeType = GeneratedShape.ShapeType

        if(currentStep != 0) {
            let getPrevShape = Layers.first[currentStep-1]
            let getUpShape = (currentStep > pm.ColNum) ? Layers.first[currentStep-pm.ColNum] : null

            let UpIf = null
            let UpString = null
            if(getUpShape) {
                UpIf = (typeof getUpShape[10] == 'string') ? getUpShape[10].substr(0, 6) : null
                UpString = getUpShape[10]
            }

            if(getPrevShape[10].substr(0, 6) == 'Circle' || UpIf == 'Circle') {
                let RegeneratedShape = regenerateShape(pm.SegmentSize, getPrevShape[10], UpString, GeneratedShape)
                CornersRadius = RegeneratedShape.CornersRadius
                FillStroke = RegeneratedShape.FillStroke
                ShapeType = RegeneratedShape.ShapeType
            }
        }

        let Shape = [Left, Top, pm.SegmentSize, pm.SegmentSize, CornersRadius[0], CornersRadius[1], CornersRadius[2], CornersRadius[3], FillStroke[0], FillStroke[1], ShapeType]

        Layers.first[currentStep] = Shape
    },
    fillAsReadyPatterns: ({scale, currentStep }) => {
        let pm = setInitParams(scale)

        if(currentStep === 0) {
            TotalStep = pm.TotalSteps
        } 

        let Left = currentStep%pm.ColNum * pm.SegmentSize
        let Top = Math.floor(currentStep/pm.ColNum) * pm.SegmentSize

        let GeneratedShape = UseReadyPatterns(pm.SegmentSize, ReadyPatternNum, currentStep)
        let CornersRadius = GeneratedShape.CornersRadius
        let FillStroke = GeneratedShape.FillStroke
        let ShapeType = GeneratedShape.ShapeType

        let Shape = [Left, Top, pm.SegmentSize, pm.SegmentSize, CornersRadius[0], CornersRadius[1], CornersRadius[2], CornersRadius[3], FillStroke[0], FillStroke[1], ShapeType]

        Layers.first[currentStep] = Shape


    },
    fillAsSecondLevel: ({scale, currentStep}) => {
        let pm = setInitParams(scale)

        let LocalStep = SecStep%4

        let Left = SecFirstStep[0] + LocalStep%2 * pm.SegmentSize/2
        let Top = SecFirstStep[1] + Math.floor(LocalStep/2) * pm.SegmentSize/2

        let GeneratedShape = generateShape(pm.SegmentSize/2)
        let CornersRadius = GeneratedShape.CornersRadius
        let FillStroke = GeneratedShape.FillStroke
        let ShapeType = GeneratedShape.ShapeType

        let Shape = [Left, Top, pm.SegmentSize/2, pm.SegmentSize/2, CornersRadius[0], CornersRadius[1], CornersRadius[2], CornersRadius[3], FillStroke[0], FillStroke[1], ShapeType]

        Layers.first.push(Shape)
    }
}


const UpdateRenderAfterTimeout = () => {
    changePair = !changePair
    Step = 0
    TypeOfFilling = generateRender()
    ReadyPatternNum = (ReadyPatternNum == 2) ? 0 : ReadyPatternNum + 1
    render = true

    Layers.first.map((Shape, i) => {
        Layers.second[i] = [...Shape] 
    })
    Layers.first = []
}



p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    
}

p.draw = () => {
    p.frameRate(20*commonScale)

    p.clear()
    p.background(background)

    //Here we create Shapes and push them to Common Array
    if(Step <= TotalStep && render) {
        if(commonScale === 1) {
            FillingProcesses[TypeOfFilling]({scale: commonScale, currentStep: Step})
        } else {
            FillingProcesses['fillAsRowTable']({scale: commonScale, currentStep: Step})
        }

        if(Step === TotalStep && !secondLevel) {
            render = false
            Step = 0
            TotalStep = null

            setTimeout(UpdateRenderAfterTimeout, 3000)
        } else if(Step === TotalStep && secondLevel) {
            render = false
            Step = 0
            
            SecPrevTotalStep = Layers.first.length-1 // Just for Copy
            SecTotalStep = Math.ceil(SecPrevTotalStep)
            
            let _mod = (SecTotalStep + 1)%4
            SecStep = 0
            SecTotalStep -= _mod
            SecRender = true

            TotalStep = null
        }
        
    }

    /* Here We create Second Level Render */
        if(SecStep <= SecTotalStep && SecRender) {
            if(SecStep === 0 || (SecStep)%4 === 0) {
                //Here We define which Upper Step has to be changed
                let getNewArea = Math.round(Math.random()*(Layers.first.length-1))
                SecFirstStep = [...Layers.first[getNewArea]]

                console.log('Me')
                console.log(Layers.first[getNewArea])
                //Here We remove Rendered First Level Step
                Layers.first.splice(getNewArea,1)
            }

            console.log('Le')
            console.log(SecFirstStep)

            FillingProcesses['fillAsSecondLevel']({scale: commonScale, currentStep: SecStep})

            if(SecStep === SecTotalStep) {
                SecRender = false
                SecStep = 0
                SecTotalStep = null
                SecFirstStep = null

                setTimeout(UpdateRenderAfterTimeout, 3000)
            }
        }

        SecStep = (SecStep < SecTotalStep) ? SecStep + 1 : SecTotalStep
    /* End Second Level */

    let ReRenderArr = [
        0, 0, 1, 0, 1, 0, 0, 0
    ]

    let randomReRender = Math.round(Math.random() * (ReRenderArr.length - 1))

    if(!ReRenderArr[randomReRender] && LazyStep === 0) {
        Step = (Step < TotalStep) ? Step + 1 : TotalStep
    } else {
        Step = (Step < TotalStep) ? Step : TotalStep
        LazyStep = (LazyStep <= 3) ? LazyStep + 1 : 0
    }


    //Here we draw Shapes
    Layers.second.map((Shape, i) => {
        if(Shape[8]) {
            if(!overlay) {
                p.fill(color1)
            } else {

                if(overlay && changePair) {
                    p.fill(color2)
                } else if(overlay && !changePair) {
                    p.fill(color1)
                }
            }
        } else {
            p.noFill()
        }

        if(Shape[9]) {
            if(!overlay) {
                p.stroke(color1)
            } else {
                
                if(overlay && changePair) {
                    p.stroke(color2)
                } else if(overlay && !changePair) {
                    p.stroke(color1)
                }
            }
            p.strokeWeight(1)
        } else {
            p.noStroke()
        }
        
        if(Shape[10] == 'Rect') {
            p.rect(Shape[0], Shape[1], Shape[2], Shape[3], Shape[4], Shape[5], Shape[6], Shape[7])
        } else if(Shape[10].substr(0, 6) == 'Circle') {

            let CircleShape = [Shape[0] + Shape[4] * Shape[2], Shape[1] + Shape[5] * Shape[2], Shape[2] * 2, Shape[2] * 2, Shape[6], Shape[7]]
            p.arc(CircleShape[0], CircleShape[1], CircleShape[2], CircleShape[3], CircleShape[4], CircleShape[5])
        }
    })

    Layers.first.map((Shape, i) => {
        if(!overlay) {
            p.fill(background)
            p.noStroke()
            p.rect(Shape[0], Shape[1], Shape[2], Shape[3])
        } else {
            p.noFill()
        }
        

        if(i === Step-1) {
            p.stroke('white')
            p.strokeWeight(1)
            p.noFill()
            p.rect(Shape[0], Shape[1], Shape[2], Shape[3])
        }

        let _color1 = p.color(color1)
            _color1.setAlpha(255*colorOpacity)

            let _color2 = p.color(color2)
            _color2.setAlpha(255*colorOpacity)

        if(Shape[8]) {
            

            p.fill(_color1)

            if(overlay && changePair) {
                p.fill(_color1)
            } else if(overlay && !changePair) {
                p.fill(_color2)
            }
        } else {
            p.noFill()
        }

        if(Shape[9]) {
            p.stroke(_color1)

            if(overlay && changePair) {
                p.stroke(_color1)
            } else if(overlay && !changePair) {
                p.stroke(_color2)
            }
            p.strokeWeight(1)
        } else {
            p.noStroke()
        }
        
        if(Shape[10] == 'Rect') {
            p.rect(Shape[0], Shape[1], Shape[2], Shape[3], Shape[4], Shape[5], Shape[6], Shape[7])
        } else if(Shape[10].substr(0, 6) == 'Circle') {

            let CircleShape = [Shape[0] + Shape[4] * Shape[2], Shape[1] + Shape[5] * Shape[2], Shape[2] * 2, Shape[2] * 2, Shape[6], Shape[7]]
            p.arc(CircleShape[0], CircleShape[1], CircleShape[2], CircleShape[3], CircleShape[4], CircleShape[5])
        }


        
    })


}



}


export default anim