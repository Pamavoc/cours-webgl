let cvs, 
    gl, 
    vShader, 
    fShader, 
    container, 
    buffer, 
    positionAttribLoc, 
    program;
const dpr = window.devicePixelRatio
const size = 512;
const NB_POINTS = 2000;
const _data = []

let colorAttribLoc;


// pos dans l'espace
const vert = `
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0., 1.);
    gl_PointSize = 40.;
    vColor = aColor;
}`

// fragment 
const frag = `
precision highp float;
varying vec3 vColor;

void main() {
    vec3 color = vColor;
    gl_FragColor = vec4(color, 1.);
}
`

const createCanvas = () => {
    cvs = document.createElement('canvas')
    cvs.style.width = `${size}px`
    cvs.style.height = `${size}px`
    cvs.style.background = 'black'
    cvs.width = window.innerWidth * dpr
    cvs.height = window.innerHeight * dpr

    gl = cvs.getContext('webgl')
    document.body.appendChild(cvs)
}



const createShader = (gl, type, src) =>{
    const shader = gl.createShader(type)
    
    // lire le texte du shader
    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    const didCompile = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if(didCompile) {
        return shader
    } else {
        console.log(gl.getShaderInfoLog(shader))
    }
}

const setupProgram = () => {
    vShader = createShader(gl, gl.VERTEX_SHADER, vert)
    fShader = createShader(gl, gl.FRAGMENT_SHADER, frag)
    program = createProgram(gl, vShader, fShader)
}

const createProgram = (gl, vertexShader, fragmentShader) => {
    const prg = gl.createProgram()
    gl.attachShader(prg, vertexShader)
    gl.attachShader(prg, fragmentShader)
    gl.linkProgram(prg)

    const didLink = gl.getProgramParameter(prg, gl.LINK_STATUS)

    if(didLink) {
        return prg
    }

    return prg
}

const setupData = () => {

    // attrib memory location
    positionAttribLoc = gl.getAttribLocation(program, 'aPosition')
    colorAttribLoc = gl.getAttribLocation(program, 'aColor')

    // buffer
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    
    
    for (let i = 0; i < NB_POINTS; i++) {
        _data.push(Math.random(), Math.random(), Math.random(), 0, 0)  // x, y  r,g,b
    }


    const bufferData = new Float32Array(_data)
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW); // static draw ou dynamic draw = same shit

    // j'unbind le buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

}

const onFrame = ()=> {
    requestAnimationFrame(onFrame)

    const nbComponents = 5
    for (let i = 0; i < NB_POINTS; i++) {
        let x = bufferData[i*nbComponents]
        let y = bufferData[i*nbComponents+1]
        
        x += .001
        x = x % 1

        bufferData[i*nbComponents] = x
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
}

const update = () => {

}

const render = () => {
    gl.viewport(0, 0, size * dpr, size * dpr)

    gl.useProgram(program)

    // bind data
    gl.enableVertexAttribArray(positionAttribLoc)
    gl.enableVertexAttribArray(colorAttribLoc)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)


    
    gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 20, 0); 
    // 2 correspond à x, y
    // stribe = longueur de l'attribut en byte (il faut faire x4) pour un vertex
   
    gl.vertexAttribPointer(colorAttribLoc, 3, gl.FLOAT, false, 20, 8); 
    // 3 correspond à R,G,B
    // stribe = longueur de l'attribut en byte (il faut faire x4)
    // l'offset, c'est +8, ça correspond à l'endroit ou se trouve les couleurs, c'est a dire après le double Math.random

    gl.drawArrays(gl.POINTS, 0, NB_POINTS)


    // le raf c'set le temps entre chaque frame
}





createCanvas()
setupProgram()
setupData()
render()