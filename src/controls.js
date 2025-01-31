import InputSlider from './InputSlider';

export const Controls = (props) => {
    return (
        <div 
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.5rem',
          userSelect: 'none',
          width: '20rem',

          backgroundColor: '#555',
          color: 'white',
          opacity: props.controlPanelHover ? '80%' : '50%',
        }}
        onMouseOver={() => props.setControlPanelHover(true)}
        onMouseLeave={() => props.setControlPanelHover(false)}
      >
        <InputSlider
          value={props.juliaSeed[0]}
          onChange={(ev) => {
            const newJuliaSeed = [...props.juliaSeed];
            newJuliaSeed[0] = ev.target.value;
            props.setJuliaSeed(newJuliaSeed)
          }}
        />
        <InputSlider
          value={props.juliaSeed[1]}
          onChange={(ev) => {
            const newJuliaSeed = [...props.juliaSeed];
            newJuliaSeed[1] = ev.target.value;
            props.setJuliaSeed(newJuliaSeed)
          }}
        />
        <InputSlider
          value={props.juliaSeed[2]}
          onChange={(ev) => {
            const newJuliaSeed = [...props.juliaSeed];
            newJuliaSeed[2] = ev.target.value;
            props.setJuliaSeed(newJuliaSeed)
          }}
        />
        <InputSlider
          value={props.juliaSeed[3]}
          onChange={(ev) => {
            const newJuliaSeed = [...props.juliaSeed];
            newJuliaSeed[3] = ev.target.value;
            props.setJuliaSeed(newJuliaSeed)
          }}
        />
        <InputSlider
          value={props.plane}
          onChange={(ev) => props.setPlane(ev.target.value)}
        />
      </div>
    )
}

export default Controls;
