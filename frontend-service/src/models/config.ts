export const config ={
    html:{
        canvasID:'canvas.webgl',
        sizeX: window.innerWidth,
        sizeY: window.innerHeight
    },
    assets:{
        envPath:'./textures/environmentMaps/0/',
        envFiles:['px','nx','py','ny','pz','nz'],
        envExt:'.jpg'
    },
    scene:{
        background: 'white',
        toneExposure:5,
        physicallyCorrectLight: true
    },
    lights:{
        keyLight:{
            enable: false,
            intensity: 36,
            position:{
                    x: -1.35,
                    y: 1.983,
                    z: 5.092
                    }
        },
        ambientLight:{
            enable: true,
            intensity: 2.5
        },
        environmentLight:{
            enable: false,
            intensity: 0,
            encoding: 2
        }
    },
    shadows: {
        farDistance: 10,
        scale:{
            near:0,
            far:10.951,
            left:-4.57,
            right:4.64,
            top:4.57,
            bottom:-2.1
        },
        normalBias: 0.117
    },
    camera:{
        enablePan: false,
        enableDamping: false,
        enableZoom: false,
        enableRotate: false,
        mouseTilt: false,
        tiltSensibility: 0.1,
        tiltTime:1,
        tiltBackTime:2,
        fov:{
            mobile:48,
            pc: 48
        },
        position:{
            x: 0,
            y: 0,
            z: 3
            },
        lookAt:{
            x: 0,
            y: 0,
            z: 0
        },
        constraint:{
            vertical: false,
            verticalMin: 0.2,
            verticalMax: 1,
            horizontal: false,
            horizontalMin: 0,
            horizontalMax: 1
        }
    },
    mobile:{
        maxOrientation:20, //degree
    },
    debug:{
        commandLine:'?debug',
        rawLoad: false //impact material texture swap or not
        }


}