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

let changePair = true

p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if(props.scale) commonScale = props.scale
    if(props.background) background = props.background
    if(props.color1) color1 = props.color1
    if(props.color2) color2 = props.color2
    if(props.overlay) overlay = props.overlay
    if(props.colorOpacity) colorOpacity = props.colorOpacity
};



/* Initial Params for processing */
let Step = 0
let LazyStep = 0
let TotalStep = null
let ReadyPatternNum = 0
let render = true
let TypeOfFilling = "fillAsRowTable"

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


    }
}






p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(20)
}

p.draw = () => {

    p.clear()
    p.background(background)

    //Here we create Shapes and push them to Common Array
    if(Step <= TotalStep && render) {
        FillingProcesses[TypeOfFilling]({scale: commonScale, currentStep: Step})

        if(Step === TotalStep) {
            render = false
            Step = 0
            TotalStep = null

            setTimeout(() => {
                changePair = !changePair
                Step = 0
                TypeOfFilling = generateRender()
                ReadyPatternNum = (ReadyPatternNum == 2) ? 0 : ReadyPatternNum + 1
                render = true

                Layers.first.map((Shape, i) => {
                    Layers.second[i] = [...Shape] 
                })
                Layers.first = []
            }, 3000)
        }

        
    }

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
            p.arc(CircleShape[0]-1, CircleShape[1]-1, CircleShape[2]+2, CircleShape[3]+2, CircleShape[4], CircleShape[5])
        }
    })

    Layers.first.map((Shape, i) => {
        if(!overlay) {
            p.fill(background)
            p.stroke(background)
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
            p.arc(CircleShape[0]-1, CircleShape[1]-1, CircleShape[2]+2, CircleShape[3]+2, CircleShape[4], CircleShape[5])
        }


        
    })


}



}


export default anim