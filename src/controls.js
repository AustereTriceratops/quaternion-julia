import { useState } from 'react';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

import InputSlider from './InputSlider';

export const Controls = (props) => {
    const {juliaSeed, setJuliaSeed} = props;

    const [controlPanelHover, setControlPanelHover] = useState(false);

    const [controlsHidden, setControlsHidden] = useState(false);

    const toggleControlsHidden = () => {
        setControlsHidden(!controlsHidden);
    }
 
    return (
        <div
            style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                color: 'white',
            }}
        >
            <div 
                style={{
                    display: controlsHidden ? 'none' : 'flex',
                    flexDirection: 'column',
                    padding: '0.5rem',
                    userSelect: 'none',
                    width: '21rem',

                    backgroundColor: '#555',
                    opacity: controlPanelHover ? '80%' : '50%',
                }}
                onMouseOver={() => setControlPanelHover(true)}
                onMouseLeave={() => setControlPanelHover(false)}
            >
                <div>
                    Seed quaternion: {juliaSeed[0].toFixed(2)} + {juliaSeed[1].toFixed(2)}i + {juliaSeed[2].toFixed(2)}j + {juliaSeed[3].toFixed(2)}k
                </div>
                <InputSlider
                    value={juliaSeed[0]}
                    onChange={(ev) => {
                        const newJuliaSeed = [...juliaSeed];
                        newJuliaSeed[0] = ev.target.value;
                        setJuliaSeed(newJuliaSeed)
                    }}
                />
                <InputSlider
                    value={juliaSeed[1]}
                    onChange={(ev) => {
                        const newJuliaSeed = [...juliaSeed];
                        newJuliaSeed[1] = ev.target.value;
                        setJuliaSeed(newJuliaSeed)
                    }}
                />
                <InputSlider
                    value={juliaSeed[2]}
                    onChange={(ev) => {
                        const newJuliaSeed = [...juliaSeed];
                        newJuliaSeed[2] = ev.target.value;
                        setJuliaSeed(newJuliaSeed)
                    }}
                />
                <InputSlider
                    value={juliaSeed[3]}
                    onChange={(ev) => {
                        const newJuliaSeed = [...juliaSeed];
                        newJuliaSeed[3] = ev.target.value;
                        setJuliaSeed(newJuliaSeed)
                    }}
                />
                <InputSlider
                    value={props.plane}
                    onChange={(ev) => props.setPlane(ev.target.value)}
                />
            </div>
            <div
                style={{
                    backgroundColor: '#555',
                    opacity: '70%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                }}
                onClick={() => toggleControlsHidden()}
            >
                {controlsHidden? <ArrowRight/> : <ArrowLeft/>}
            </div>
        </div>
    )
}

export default Controls;
