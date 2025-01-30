import {vertexShader, fragmentShader} from './shader'
import {initProgram, initPositionBuffer} from './glUtils'

class glManager {
    constructor(canvas) {
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height

        const gl = canvas.getContext('webgl');

        this.shaderProgram = initProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(this.shaderProgram);

        this.shaderAttribs = {
            vertexPosition: gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
            resolution: gl.getUniformLocation(this.shaderProgram, 'resolution'),
            aspect: gl.getUniformLocation(this.shaderProgram, 'aspect'),
            cameraX: gl.getUniformLocation(this.shaderProgram, 'cameraX'),
            cameraY: gl.getUniformLocation(this.shaderProgram, 'cameraY'),
            cameraZ: gl.getUniformLocation(this.shaderProgram, 'cameraZ'),
            cameraPos: gl.getUniformLocation(this.shaderProgram, 'cameraPos'),
            juliaSeed: gl.getUniformLocation(this.shaderProgram, 'juliaSeed'),
            plane: gl.getUniformLocation(this.shaderProgram, 'plane'),
        };
        
        gl.uniform2fv(this.shaderAttribs.resolution, [this.width, this.height]);
        gl.uniform1f(this.shaderAttribs.aspect, this.height/this.width)

        this.positionBuffer = initPositionBuffer(gl, this.shaderAttribs.vertexPosition);

        this.gl = gl
    }

    render(cameraPos, cameraX, cameraY, cameraZ, juliaSeed, plane) {
        this.gl.uniform3fv(this.shaderAttribs.cameraPos, cameraPos);
        this.gl.uniform3fv(this.shaderAttribs.cameraX, cameraX);
        this.gl.uniform3fv(this.shaderAttribs.cameraY, cameraY);
        this.gl.uniform3fv(this.shaderAttribs.cameraZ, cameraZ);

        this.gl.uniform4fv(this.shaderAttribs.juliaSeed, juliaSeed);
        this.gl.uniform1f(this.shaderAttribs.plane, plane)

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}

export default glManager
